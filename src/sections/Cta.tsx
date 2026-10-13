import { gen } from '../data';
import { Action } from '../components/ui';

const FLOATERS = [
  { name: 'site-fashion', depth: 0.9 }, { name: 'site-organic', depth: 0.5 }, { name: 'site-architecture', depth: 1.2 },
  { name: 'site-education', depth: 0.7 }, { name: 'site-auto', depth: 1.1 }, { name: 'site-yoga', depth: 0.4 },
  { name: 'site-restaurant', depth: 0.8 }, { name: 'site-skincare', depth: 1.3 },
];

export default function Cta() {
  return <section className="cta" aria-labelledby="cta-title">
    <div className="cta-floaters" aria-hidden="true">
      {FLOATERS.map((item, index) => <img key={item.name} className={`cta-float c${index + 1}`} data-depth={item.depth} src={gen(item.name)} alt="" loading="lazy" width="1400" height="933"/>)}
    </div>
    <div className="cta-copy">
      <h2 id="cta-title" className="split"><span className="line"><span className="line-inner">Let's build something</span>{' '}</span><span className="line"><span className="line-inner"><em>together.</em></span></span></h2>
      <div className="cta-actions reveal">
        <Action href="#contact" variant="primary">Let's talk</Action>
        <Action href="#work">Explore the work</Action>
      </div>
    </div>
  </section>;
}
