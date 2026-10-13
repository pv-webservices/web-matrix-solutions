import { useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gen, sites } from '../data';
import { useCanvasScene } from '../lib/useCanvasScene';
import { Action, Eyebrow } from '../components/ui';

const IMAGES = sites.map(gen);
const OUTRO_AT = 0.86;
const label = (name: string) => name.replace('site-', '').replace(/^./, letter => letter.toUpperCase());

export default function Works() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const webgl = useCanvasScene(canvas, async element => {
    const { createWorksSphere } = await import('../webgl/worksSphere');
    return createWorksSphere({ canvas: element, images: IMAGES, titles: ['Our Work', 'Yours next'] });
  }, sphere => {
    const node = section.current;
    if (!node) return () => undefined;
    const trigger = ScrollTrigger.create({
      trigger: node, start: 'top 55%', end: 'bottom bottom',
      onUpdate: self => {
        sphere.setProgress(self.progress);
        node.classList.toggle('is-outro', self.progress > OUTRO_AT);
        node.style.setProperty('--p', self.progress.toFixed(3));
      },
    });
    const move = (event: PointerEvent) => sphere.setPointer((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1);
    node.addEventListener('pointermove', move);
    return () => { trigger.kill(); node.removeEventListener('pointermove', move); };
  });

  return <section ref={section} className={`works ${webgl ? '' : 'is-fallback'}`} id="work" aria-labelledby="works-title">
    <div className="works-sticky">
      <canvas ref={canvas} className="works-canvas" aria-hidden="true"/>
      <div className="works-hud">
        <Eyebrow>Concept showcase</Eyebrow>
        <h2 id="works-title" className="sr-only">Our work</h2>
        <p className="works-note">{sites.length} website concepts across cafes, clinics, fashion, travel and more. Keep scrolling to spin the globe.</p>
      </div>
      <div className="works-progress" aria-hidden="true"><span/></div>
      <div className="works-outro">
        <p>Your brand could be the next one here.</p>
        <Action href="#contact" variant="primary">Start your project</Action>
      </div>
      {!webgl && <div className="works-fallback">
        {IMAGES.slice(0, 8).map(src => <img key={src} src={src} alt="" loading="lazy"/>)}
      </div>}
    </div>
    <ul className="sr-only">{sites.map(name => <li key={name}>{label(name)} website concept</li>)}</ul>
  </section>;
}
