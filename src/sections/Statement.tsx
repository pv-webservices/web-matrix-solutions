import { gen, statement } from '../data';
import { Eyebrow } from '../components/ui';

const FLOATERS = [
  { name: 'site-jewellery', className: 'f1', speed: -0.25 },
  { name: 'site-tech', className: 'f2', speed: 0.35 },
  { name: 'site-interiors', className: 'f3', speed: -0.15 },
  { name: 'site-dental', className: 'f4', speed: 0.45 },
];

export default function Statement() {
  return <section className="statement" aria-label="What we do">
    {FLOATERS.map(item => <img key={item.name} className={`floater ${item.className}`} data-speed={item.speed} src={gen(item.name)} alt="" loading="lazy" width="1400" height="933"/>)}
    <div className="container statement-inner">
      <Eyebrow>What we do</Eyebrow>
      <p className="statement-text">{statement.split(' ').map((word, index) => <span className="word" key={index}>{word} </span>)}</p>
    </div>
  </section>;
}
