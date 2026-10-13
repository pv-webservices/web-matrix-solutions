import { marquee } from '../data';

export default function Marquee() {
  const items = [...marquee, ...marquee];
  return <div className="marquee" aria-hidden="true">
    <div className="marquee-track">
      {items.map((item, index) => <span key={index}>{index % 2 ? <em>{item}</em> : item}<i>✦</i></span>)}
    </div>
  </div>;
}
