import { useEffect } from 'react';
import gsap from 'gsap';

const MAGNET_PULL = 0.3;
const TILT_MAX_DEG = 5;
const HOVER_TARGETS = 'a, button, [data-tilt], input, select, textarea';

type Cleanup = () => void;

function listen<K extends keyof DocumentEventMap>(target: Document | HTMLElement, type: K, handler: (event: DocumentEventMap[K]) => void): Cleanup {
  target.addEventListener(type, handler as EventListener, { passive: true });
  return () => target.removeEventListener(type, handler as EventListener);
}

/** Trailing ring that grows over interactive elements and shows "Scroll" over the works globe. */
function cursor(): Cleanup {
  const ring = document.querySelector<HTMLElement>('.cursor-ring');
  if (!ring) return () => undefined;
  document.documentElement.classList.add('has-cursor');
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' });
  const offs = [
    listen(document, 'pointermove', event => {
      if (event.pointerType !== 'mouse') return;
      ring.classList.add('is-active');
      ringX(event.clientX); ringY(event.clientY);
      const target = event.target instanceof Element ? event.target : null;
      ring.classList.toggle('is-hover', Boolean(target?.closest(HOVER_TARGETS)));
      ring.classList.toggle('is-light', Boolean(target?.closest('.method')));
      ring.classList.toggle('is-globe', Boolean(target?.closest('.works-sticky')) && !target?.closest('a'));
    }),
    listen(document, 'pointerdown', () => ring.classList.add('is-down')),
    listen(document, 'pointerup', () => ring.classList.remove('is-down')),
  ];
  return () => { offs.forEach(off => off()); document.documentElement.classList.remove('has-cursor'); };
}

function magnetic(): Cleanup {
  const offs = gsap.utils.toArray<HTMLElement>('[data-magnetic]').flatMap(element => {
    const x = gsap.quickTo(element, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const y = gsap.quickTo(element, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    return [
      listen(element, 'pointermove', event => {
        const box = element.getBoundingClientRect();
        x((event.clientX - box.left - box.width / 2) * MAGNET_PULL);
        y((event.clientY - box.top - box.height / 2) * MAGNET_PULL);
      }),
      listen(element, 'pointerleave', () => { x(0); y(0); }),
    ];
  });
  return () => offs.forEach(off => off());
}

function tilt(): Cleanup {
  const offs = gsap.utils.toArray<HTMLElement>('[data-tilt]').flatMap(card => [
    listen(card, 'pointermove', event => {
      const box = card.getBoundingClientRect();
      const px = (event.clientX - box.left) / box.width;
      const py = (event.clientY - box.top) / box.height;
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
      card.style.setProperty('--ry', `${(px - 0.5) * TILT_MAX_DEG * 2}deg`);
      card.style.setProperty('--rx', `${(0.5 - py) * TILT_MAX_DEG * 2}deg`);
    }),
    listen(card, 'pointerleave', () => { card.style.removeProperty('--rx'); card.style.removeProperty('--ry'); }),
  ]);
  return () => offs.forEach(off => off());
}

/** Pointer niceties for mouse users who have not asked for reduced motion. */
export function useInteractions(): void {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || calm) return;
    const cleanups = [cursor(), magnetic(), tilt()];
    return () => cleanups.forEach(cleanup => cleanup());
  }, []);
}
