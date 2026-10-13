import { useEffect, useRef, useState, type RefObject } from 'react';

export interface CanvasScene {
  resize: () => void;
  start: () => void;
  stop: () => void;
  dispose: () => void;
}

export const prefersReducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Creates a WebGL scene on mount (the factory may be async, e.g. to lazy-load three.js),
 * renders only while the canvas is near the viewport, follows its size, and disposes on
 * unmount. Returns false if WebGL could not start.
 * `bind` wires scroll/pointer input and returns its own cleanup.
 */
export function useCanvasScene<T extends CanvasScene>(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  create: (canvas: HTMLCanvasElement) => T | Promise<T>,
  bind: (scene: T) => () => void,
): boolean {
  const [ok, setOk] = useState(true);
  const createRef = useRef(create);
  const bindRef = useRef(bind);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let teardown: (() => void) | null = null;
    let cancelled = false;

    const mount = (scene: T) => {
      if (cancelled) { scene.dispose(); return; }
      const unbind = bindRef.current(scene);
      const visibility = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) scene.start(); else scene.stop();
      }, { rootMargin: '10% 0px' });
      visibility.observe(canvas);
      const sizing = new ResizeObserver(() => scene.resize());
      sizing.observe(canvas);
      teardown = () => {
        visibility.disconnect();
        sizing.disconnect();
        unbind();
        scene.dispose();
      };
    };

    Promise.resolve()
      .then(() => createRef.current(canvas))
      .then(mount)
      .catch(() => { if (!cancelled) setOk(false); });

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [canvasRef]);

  return ok;
}
