import { useRef, type CSSProperties } from 'react';
import { ArrowDown } from 'lucide-react';
import { gen, services } from '../data';
import { createHeroAurora } from '../webgl/heroAurora';
import { prefersReducedMotion, useCanvasScene } from '../lib/useCanvasScene';
import { Action } from '../components/ui';

const CHIP_A = ['site-fashion', 'site-cafe', 'site-travel', 'site-skincare'];
const CHIP_B = ['site-realty', 'site-fitness', 'site-restaurant', 'site-yoga'];

function Chip({ images, round = false }: { images: string[]; round?: boolean }) {
  return <span className={`chip ${round ? 'chip-round' : ''}`} aria-hidden="true">
    {images.map((name, index) => <img key={name} src={gen(name)} alt="" style={{ '--n': index } as CSSProperties} fetchPriority={index === 0 ? 'high' : 'low'}/>)}
  </span>;
}

export default function Hero() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const webgl = useCanvasScene(canvas, element => createHeroAurora(element, !prefersReducedMotion()), aurora => {
    const move = (event: PointerEvent) => aurora.setPointer(event.clientX / window.innerWidth, 1 - event.clientY / window.innerHeight);
    const scroll = () => aurora.setFade(Math.max(0, 1 - window.scrollY / (window.innerHeight * 1.1)));
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('scroll', scroll, { passive: true });
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('scroll', scroll); };
  });

  return <section className="hero" id="home">
    <canvas ref={canvas} className={`hero-canvas ${webgl ? '' : 'is-fallback'}`} aria-hidden="true"/>
    <div className="hero-inner">
      <p className="hero-kicker intro" style={{ '--d': 0.1 } as CSSProperties}><span className="pulse" aria-hidden="true"/>Digital growth studio · India</p>
      <h1 className="hero-title">
        <span className="line"><span className="line-inner">Brands people</span>{' '}</span>
        <span className="line"><span className="line-inner"><Chip images={CHIP_A}/> <em>can't scroll</em></span>{' '}</span>
        <span className="line"><span className="line-inner">past<span className="accent">.</span> <Chip images={CHIP_B} round/></span></span>
      </h1>
      <div className="hero-foot">
        <p className="hero-lead intro" style={{ '--d': 0.9 } as CSSProperties}>We design and manage <strong>websites</strong>, <strong>social media</strong>, <strong>content</strong> and <strong>Google Business profiles</strong> for brands that want to be found, followed and chosen.</p>
        <div className="hero-actions intro" style={{ '--d': 1.05 } as CSSProperties}>
          <Action href="#contact" variant="primary">Start your project</Action>
          <Action href="#work">See our work</Action>
        </div>
      </div>
    </div>
    <ul className="hero-services intro" style={{ '--d': 1.2 } as CSSProperties} aria-label="Our services">
      {services.map(({ short, icon: Icon }) => <li key={short}><Icon size={15} aria-hidden="true"/>{short}</li>)}
    </ul>
    <a className="hero-scroll intro" style={{ '--d': 1.3 } as CSSProperties} href="#showcase" aria-label="Scroll to explore"><span>Scroll</span><ArrowDown size={14}/></a>
  </section>;
}
