import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const MOTION_OK = '(prefers-reduced-motion: no-preference)';
const DESKTOP = '(min-width: 900px)';
const READY_FALLBACK_MS = 4000;

type Cleanup = () => void;
const all = <T extends Element = HTMLElement>(selector: string) => gsap.utils.toArray<T>(selector);
const markReady = () => document.documentElement.classList.add('is-ready');

function smoothScroll(): Cleanup {
  const lenis = new Lenis({ lerp: 0.09, anchors: true, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  const observer = new MutationObserver(() => {
    if (document.documentElement.classList.contains('menu-open')) lenis.stop(); else lenis.start();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => { observer.disconnect(); gsap.ticker.remove(tick); lenis.destroy(); };
}

function preloader(): void {
  const counter = document.querySelector('.preloader-count');
  const state = { value: 0 };
  gsap.timeline({ onComplete: () => document.documentElement.classList.add('is-loaded') })
    .to(state, { value: 100, duration: 1.3, ease: 'power2.inOut', onUpdate: () => { if (counter) counter.textContent = String(Math.round(state.value)).padStart(3, '0'); } })
    .to('.preloader-bar span', { scaleX: 1, duration: 1.3, ease: 'power2.inOut' }, 0)
    .to('.preloader-inner', { yPercent: -40, opacity: 0, duration: 0.5, ease: 'power2.in' })
    .to('.preloader', { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut', onStart: markReady }, '-=0.15');
}

function splitReveals(): void {
  all<HTMLElement>('.split:not(.hero-title)').forEach(heading => {
    gsap.from(heading.querySelectorAll('.line-inner'), {
      yPercent: 110, rotate: 3, duration: 1.1, stagger: 0.1, ease: 'expo.out',
      scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
    });
  });
  gsap.set('.reveal', { opacity: 0, y: 40 });
  ScrollTrigger.batch('.reveal', {
    start: 'top 92%', once: true,
    onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: 'power3.out', clearProps: 'transform' }),
  });
}

function heroScene(): void {
  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
    .to('.hero-title', { yPercent: -18, scale: 0.94, opacity: 0.15, ease: 'none' }, 0)
    .to('.hero-foot, .hero-services', { y: -60, opacity: 0, ease: 'none' }, 0);
}

function showcaseScene(): void {
  const timeline = gsap.timeline({ scrollTrigger: { trigger: '.showcase', start: 'top bottom', end: 'bottom bottom', scrub: 0.6 } });
  timeline
    .fromTo('.showcase-plane', { rotateX: 48, rotateZ: -14, scale: 1.25, yPercent: 10 }, { rotateX: 0, rotateZ: 0, scale: 0.92, yPercent: 0, ease: 'none' }, 0)
    .fromTo('.showcase-row:nth-child(odd)', { xPercent: 0 }, { xPercent: -22, ease: 'none' }, 0)
    .fromTo('.showcase-row:nth-child(even)', { xPercent: -22 }, { xPercent: 0, ease: 'none' }, 0)
    .fromTo('.showcase-stage', { opacity: 1 }, { opacity: 0.22, ease: 'none' }, 0.55);
}

function statementScene(): void {
  gsap.fromTo('.statement .word', { opacity: 0.12 }, {
    opacity: 1, stagger: 0.05, ease: 'none',
    scrollTrigger: { trigger: '.statement-text', start: 'top 80%', end: 'bottom 45%', scrub: true },
  });
  all<HTMLElement>('.floater').forEach(img => {
    gsap.fromTo(img, { y: () => window.innerHeight * Number(img.dataset.speed) }, {
      y: () => -window.innerHeight * Number(img.dataset.speed), ease: 'none',
      scrollTrigger: { trigger: '.statement', start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    });
  });
}

function servicesStack(): void {
  const cards = all<HTMLElement>('.service-card');
  cards.slice(0, -1).forEach((card, index) => {
    gsap.fromTo(card, { scale: 1, filter: 'brightness(1)' }, {
      scale: 0.92, filter: 'brightness(0.6)', ease: 'none',
      scrollTrigger: { trigger: cards[index + 1], start: 'top bottom', end: 'top 20%', scrub: true },
    });
  });
  all<HTMLElement>('.service-media img').forEach(img => {
    gsap.fromTo(img, { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'top 25%', scrub: true } });
  });
}

/** The marquee drifts on its own and speeds up / reverses with scroll velocity. */
function marqueeScene(): Cleanup {
  const loop = gsap.to('.marquee-track', { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
  const trigger = ScrollTrigger.create({
    trigger: '.marquee', start: 'top bottom', end: 'bottom top',
    onUpdate: self => {
      const boost = gsap.utils.clamp(-6, 6, self.getVelocity() / 260);
      gsap.to(loop, { timeScale: boost === 0 ? 1 : boost, duration: 0.3, overwrite: true });
      gsap.to(loop, { timeScale: self.direction, duration: 1.2, delay: 0.3 });
    },
  });
  return () => { trigger.kill(); loop.kill(); };
}

function methodScene(): void {
  const section = document.querySelector<HTMLElement>('.method');
  const tabs = all<HTMLElement>('.method-tabs li');
  if (!section) return;
  ScrollTrigger.create({
    trigger: section, start: 'top top', end: 'bottom bottom',
    onUpdate: self => {
      const scaled = self.progress * tabs.length;
      section.dataset.step = String(Math.min(tabs.length - 1, Math.floor(scaled)));
      tabs.forEach((tab, index) => tab.style.setProperty('--p', String(gsap.utils.clamp(0, 1, scaled - index))));
    },
  });
}

function whyUsScene(): void {
  const cards = all<HTMLElement>('.promise-card');
  const timeline = gsap.timeline({ scrollTrigger: { trigger: '.promise', start: 'top top', end: 'bottom bottom', scrub: 0.8 } });
  timeline.fromTo('.promise-title', { scale: 0.86 }, { scale: 1.04, ease: 'none', duration: cards.length + 1 }, 0);
  cards.forEach((card, index) => {
    const tilt = index % 2 ? 5 : -5;
    timeline.fromTo(card, { y: () => window.innerHeight * 0.95, rotate: tilt * 2 }, { y: () => -window.innerHeight * 0.95, rotate: -tilt, ease: 'none', duration: 2 }, index * 0.9);
  });
}

function ctaScene(): Cleanup {
  const floaters = all<HTMLElement>('.cta-float');
  floaters.forEach(img => {
    const depth = Number(img.dataset.depth);
    gsap.fromTo(img, { y: 220 * depth }, { y: -220 * depth, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  const setters = floaters.map(img => ({ depth: Number(img.dataset.depth), x: gsap.quickTo(img, 'x', { duration: 1.2, ease: 'power3.out' }) }));
  const move = (event: PointerEvent) => {
    const offset = event.clientX / window.innerWidth - 0.5;
    setters.forEach(({ depth, x }) => x(-offset * 60 * depth));
  };
  window.addEventListener('pointermove', move, { passive: true });
  return () => window.removeEventListener('pointermove', move);
}

function footerScene(): void {
  gsap.from('.footer-wordmark span', {
    yPercent: 100, duration: 1.2, stagger: 0.05, ease: 'expo.out',
    scrollTrigger: { trigger: '.footer-wordmark', start: 'top 95%', once: true },
  });
}

function inViewClasses(): void {
  all<HTMLElement>('.bento-card').forEach(card => ScrollTrigger.create({ trigger: card, start: 'top 80%', once: true, onEnter: () => card.classList.add('is-in') }));
}

export function useSiteMotion(): void {
  useEffect(() => {
    const fallback = window.setTimeout(() => { markReady(); document.documentElement.classList.add('is-loaded'); }, READY_FALLBACK_MS);
    const mm = gsap.matchMedia();
    mm.add({ motion: MOTION_OK, desktop: DESKTOP }, context => {
      const { motion, desktop } = context.conditions as { motion: boolean; desktop: boolean };
      if (!motion) {
        markReady();
        document.documentElement.classList.add('is-loaded');
        inViewClasses();
        return;
      }
      const cleanups: Cleanup[] = [smoothScroll(), marqueeScene(), ctaScene()];
      preloader();
      splitReveals();
      heroScene();
      showcaseScene();
      statementScene();
      if (desktop) servicesStack();
      methodScene();
      whyUsScene();
      footerScene();
      inViewClasses();
      return () => cleanups.forEach(cleanup => cleanup());
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh).catch(() => undefined);
    return () => {
      window.clearTimeout(fallback);
      window.removeEventListener('load', refresh);
      mm.revert();
    };
  }, []);
}
