import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MOTION_OK = '(prefers-reduced-motion: no-preference)';
/** Pinned scenes need enough room to show a whole section at once. */
const PIN_OK = '(min-width: 900px) and (min-height: 680px)';
const TILT_MAX_DEG = 6;
const TOUCH_PRESS_MS = 420;

type Cleanup = () => void;
const all = <T extends Element = HTMLElement>(selector: string) => gsap.utils.toArray<T>(selector);

function revealOnScroll(): void {
  gsap.set('.reveal', { opacity: 0, y: 46 });
  ScrollTrigger.batch('.reveal', {
    start: 'top 90%',
    once: true,
    onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 1, stagger: 0.09, ease: 'power3.out', overwrite: true, clearProps: 'transform' }),
  });
}

function heroScene(): void {
  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
    .to('.hero-bg', { scale: 1.2, yPercent: 10, ease: 'none' }, 0)
    .to('.hero-art', { yPercent: -16, scale: 1.08, ease: 'none' }, 0)
    .to('.hero-copy', { yPercent: -14, opacity: 0.1, ease: 'none' }, 0)
    .to('.hero-bottom', { opacity: 0, ease: 'none' }, 0);
}

function counters(): Cleanup {
  const nodes = all<HTMLElement>('.count');
  const finalText = (node: HTMLElement) => String(node.dataset.count).padStart(Number(node.dataset.pad), '0');
  nodes.forEach(node => {
    const state = { value: 0 };
    gsap.to(state, {
      value: Number(node.dataset.count), duration: 1.8, delay: 0.9, ease: 'power2.out',
      onUpdate: () => { node.textContent = String(Math.round(state.value)).padStart(Number(node.dataset.pad), '0'); },
    });
  });
  return () => nodes.forEach(node => { node.textContent = finalText(node); });
}

function aboutWords(): void {
  gsap.fromTo('.about-statement .word', { opacity: 0.14 }, {
    opacity: 1, stagger: 0.06, ease: 'none',
    scrollTrigger: { trigger: '.about-statement', start: 'top 82%', end: 'bottom 45%', scrub: true },
  });
}

function processPinned(): Cleanup {
  const wrap = document.querySelector('.process-steps');
  const steps = all<HTMLElement>('.process-step');
  wrap?.classList.add('is-scrubbed');
  const activate = (progress: number) => {
    const active = Math.min(steps.length - 1, Math.floor(progress * steps.length + 0.15));
    steps.forEach((step, index) => step.classList.toggle('is-active', index <= active));
  };
  activate(0);
  gsap.timeline({
    scrollTrigger: {
      trigger: '.process-section', start: 'top top', end: '+=150%', pin: '.process-pin', scrub: 0.6,
      refreshPriority: 2, onUpdate: self => activate(self.progress),
    },
  })
    .fromTo('.process-fill', { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0)
    .to('.process-orb img', { rotate: 140, scale: 1.1, ease: 'none' }, 0);
  return () => { wrap?.classList.remove('is-scrubbed'); steps.forEach(step => step.classList.remove('is-active')); };
}

function processFlowing(): void {
  gsap.fromTo('.process-fill', { scaleY: 0 }, {
    scaleY: 1, ease: 'none',
    scrollTrigger: { trigger: '.process-list', start: 'top 75%', end: 'bottom 55%', scrub: true },
  });
  gsap.to('.process-orb img', { rotate: 90, ease: 'none', scrollTrigger: { trigger: '.process-section', start: 'top bottom', end: 'bottom top', scrub: true } });
}

function workPinned(): Cleanup {
  const section = document.querySelector<HTMLElement>('.work-section');
  const rail = document.querySelector<HTMLElement>('.work-rail');
  const track = document.querySelector<HTMLElement>('.work-track');
  if (!section || !rail || !track) return () => undefined;
  section.classList.add('is-pinned');
  const distance = () => Math.max(0, track.scrollWidth - rail.clientWidth);
  const slide = gsap.to(track, {
    x: () => -distance(), ease: 'none',
    scrollTrigger: {
      trigger: section, start: 'top top', end: () => `+=${distance()}`, pin: '.work-pin',
      scrub: 0.8, invalidateOnRefresh: true, refreshPriority: 1,
    },
  });
  all<HTMLElement>('.work-card img').forEach(img => {
    gsap.fromTo(img, { xPercent: -6 }, {
      xPercent: 6, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true },
    });
  });
  return () => section.classList.remove('is-pinned');
}

function zoomScenes(): void {
  gsap.fromTo('.cta-card', { clipPath: 'inset(6% 5% round 36px)' }, {
    clipPath: 'inset(0% 0% round 28px)', ease: 'none',
    scrollTrigger: { trigger: '.cta-section', start: 'top 95%', end: 'top 40%', scrub: true },
  });
  gsap.fromTo('.cta-art img', { scale: 1.22, yPercent: 8 }, {
    scale: 1, yPercent: -6, ease: 'none',
    scrollTrigger: { trigger: '.cta-section', start: 'top bottom', end: 'bottom top', scrub: true },
  });
  all<HTMLElement>('.insight-media img').forEach(img => {
    gsap.fromTo(img, { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom 40%', scrub: true } });
  });
  gsap.to('.faq-orb img', { rotate: 60, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.faq-section', start: 'top bottom', end: 'bottom top', scrub: true } });
}

/** Pointer-follow tilt and spotlight for cards; press feedback for touch. */
function bindCardInteractions(): Cleanup {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = all<HTMLElement>('.tilt-card');
  const timers = new Map<HTMLElement, number>();
  const handlers = cards.map(card => {
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !fine) return;
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width;
      const y = (event.clientY - box.top) / box.height;
      card.style.setProperty('--mx', `${x * 100}%`);
      card.style.setProperty('--my', `${y * 100}%`);
      if (reduced) return;
      card.style.setProperty('--ry', `${(x - 0.5) * TILT_MAX_DEG * 2}deg`);
      card.style.setProperty('--rx', `${(0.5 - y) * TILT_MAX_DEG * 2}deg`);
    };
    const leave = () => { card.style.removeProperty('--rx'); card.style.removeProperty('--ry'); };
    const press = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') return;
      const box = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((event.clientX - box.left) / box.width) * 100}%`);
      card.style.setProperty('--my', `${((event.clientY - box.top) / box.height) * 100}%`);
      card.classList.add('is-pressed');
      window.clearTimeout(timers.get(card));
    };
    const release = () => timers.set(card, window.setTimeout(() => card.classList.remove('is-pressed'), TOUCH_PRESS_MS));
    card.addEventListener('pointermove', move);
    card.addEventListener('pointerleave', leave);
    card.addEventListener('pointerdown', press);
    card.addEventListener('pointerup', release);
    card.addEventListener('pointercancel', release);
    return () => {
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerleave', leave);
      card.removeEventListener('pointerdown', press);
      card.removeEventListener('pointerup', release);
      card.removeEventListener('pointercancel', release);
    };
  });
  return () => { handlers.forEach(off => off()); timers.forEach(timer => window.clearTimeout(timer)); };
}

export function useSiteMotion(root: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const unbindCards = bindCardInteractions();
    const mm = gsap.matchMedia();
    mm.add({ motion: MOTION_OK, pin: PIN_OK }, context => {
      const { motion, pin } = context.conditions as { motion: boolean; pin: boolean };
      if (!motion) return;
      const cleanups: Cleanup[] = [];
      if (pin) {
        cleanups.push(processPinned(), workPinned());
      } else {
        processFlowing();
      }
      heroScene();
      aboutWords();
      zoomScenes();
      revealOnScroll();
      cleanups.push(counters());
      return () => cleanups.forEach(cleanup => cleanup());
    }, root.current ?? undefined);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh).catch(() => undefined);
    return () => {
      window.removeEventListener('load', refresh);
      mm.revert();
      unbindCards();
    };
  }, [root]);
}
