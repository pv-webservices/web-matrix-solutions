import { useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { projects } from '../data';
import { Eyebrow, image } from './ui';
import { moveRail } from './rail';

interface WorkProps {
  onSelect: (index: number) => void;
}

export default function Work({ onSelect }: WorkProps) {
  const rail = useRef<HTMLDivElement>(null);
  const move = (direction: number) => { if (rail.current) moveRail(rail.current, '.work-card', direction); };

  return <section className="work-section" id="work">
    <div className="work-pin">
      <div className="container work-head">
        <div className="reveal">
          <Eyebrow>OUR WORK</Eyebrow>
          <h2>Ideas with <span className="text-gradient">impact</span><br/>in mind.</h2>
        </div>
        <div className="work-aside reveal">
          <p>Visual directions and digital experiences we love to build. These are creative concepts that show what is possible for your brand.</p>
          <div className="rail-controls">
            <button className="round-control" aria-label="Previous concepts" onClick={() => move(-1)}><ArrowLeft size={19}/></button>
            <button className="round-control" aria-label="Next concepts" onClick={() => move(1)}><ArrowRight size={19}/></button>
          </div>
        </div>
      </div>
      <div className="work-rail" ref={rail} aria-label="Creative concepts">
        <div className="work-track">
          {projects.map((project, index) => <button className="work-card tilt-card" key={project.name} onClick={() => onSelect(index)} aria-label={`Explore ${project.name} concept`}>
            <img src={image(project.image)} width="768" height="1024" loading="lazy" alt=""/>
            <span className="work-shade" aria-hidden="true"/>
            <span className="work-index">0{index + 1} / 0{projects.length}</span>
            <span className="work-info">
              <span><small>{project.category}</small><strong>{project.name}</strong></span>
              <span className="work-arrow"><ArrowUpRight size={19}/></span>
            </span>
          </button>)}
          <a className="work-card work-cta tilt-card" href="#contact">
            <span className="work-cta-glow" aria-hidden="true"/>
            <small>YOUR BRAND HERE</small>
            <strong>Let's create<br/>what's next.</strong>
            <span className="work-arrow"><ArrowUpRight size={19}/></span>
          </a>
        </div>
      </div>
    </div>
  </section>;
}
