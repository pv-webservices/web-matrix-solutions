import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { commitments } from '../data';
import { SectionIntro } from './ui';
import { moveRail, railStep } from './rail';

const AUTOPLAY_MS = 4500;

export default function Commitments() {
  const rail = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [current, setCurrent] = useState(0);
  const [positions, setPositions] = useState<number>(commitments.length);

  const move = (direction: number) => { if (rail.current) moveRail(rail.current, '.commitment-card', direction, true); };

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const update = () => {
      const step = railStep(element, '.commitment-card');
      setPositions(Math.round((element.scrollWidth - element.clientWidth) / step) + 1);
      setCurrent(Math.round(element.scrollLeft / step));
    };
    update();
    element.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { element.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (paused || reduced) return;
    const timer = window.setInterval(() => {
      const element = rail.current;
      if (!element) return;
      const box = element.getBoundingClientRect();
      if (box.bottom < 0 || box.top > window.innerHeight) return;
      moveRail(element, '.commitment-card', 1, true);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused]);

  const goTo = (index: number) => {
    const element = rail.current;
    if (element) element.scrollTo({ left: index * railStep(element, '.commitment-card'), behavior: 'smooth' });
  };

  return <section className="section commitments-section" aria-labelledby="commitments-title">
    <div className="container">
      <SectionIntro
        eyebrow="WHY WEB MATRIX"
        title={<span id="commitments-title">What you can<br/><span className="text-gradient">count on.</span></span>}
        description="The promises that shape every project, whether it is a new website, a CRM or a single automation."
        action={<div className="rail-controls">
          <button className="round-control" aria-label="Previous commitment" onClick={() => move(-1)}><ArrowLeft size={19}/></button>
          <button className="round-control" aria-label="Next commitment" onClick={() => move(1)}><ArrowRight size={19}/></button>
        </div>}
      />
    </div>
    <div
      className="commitment-rail"
      ref={rail}
      role="region"
      aria-roledescription="carousel"
      aria-label="Our commitments"
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onKeyDown={event => { if (event.key === 'ArrowRight') move(1); if (event.key === 'ArrowLeft') move(-1); }}
    >
      {commitments.map((item, index) => <article className="commitment-card tilt-card" key={item.title} aria-label={`${index + 1} of ${commitments.length}`}>
        <span className="card-spotlight" aria-hidden="true"/>
        <Quote className="commitment-quote" size={30} aria-hidden="true"/>
        <h3>{item.title}</h3>
        <p>{item.text}</p>
        <span className="commitment-foot"><span className="commitment-icon"><item.icon size={18}/></span>Web Matrix promise 0{index + 1}</span>
      </article>)}
    </div>
    <div className="container commitment-dots">
      {commitments.slice(0, positions).map((item, index) => <button key={item.title} className={current === index ? 'active' : ''} aria-label={`Show ${item.title}`} aria-pressed={current === index} onClick={() => goTo(index)}/>)}
    </div>
  </section>;
}
