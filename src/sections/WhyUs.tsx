import type { CSSProperties } from 'react';
import { promises } from '../data';
import { Eyebrow } from '../components/ui';

export default function WhyUs() {
  return <section className="promise" aria-labelledby="promise-title">
    <div className="promise-sticky">
      <Eyebrow>Why brands choose us</Eyebrow>
      <h2 id="promise-title" className="promise-title"><span>Built</span><span>to be</span><span>chosen</span></h2>
      <div className="promise-cards">
        {promises.map(({ icon: Icon, title, text }, index) => <article className="promise-card" key={title} style={{ '--i': index } as CSSProperties}>
          <span className="promise-index">0{index + 1}</span>
          <span className="promise-icon"><Icon size={20}/></span>
          <h3>{title}</h3>
          <p>{text}</p>
        </article>)}
      </div>
    </div>
  </section>;
}
