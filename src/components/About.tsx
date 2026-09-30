import type { CSSProperties } from 'react';
import { aboutStatement, principles } from '../data';
import { Action } from './ui';

export default function About() {
  return <section className="section about-section" id="about">
    <div className="container about-grid">
      <div className="about-copy">
        <div className="about-sticky">
          <h2 className="eyebrow"><span aria-hidden="true"/>ABOUT US</h2>
          <p className="about-statement">
            {aboutStatement.split(' ').map((word, index) => <span className="word" key={`${word}-${index}`}>{word} </span>)}
          </p>
          <Action href="#process">See how we work</Action>
        </div>
      </div>
      <div className="about-stack">
        {principles.map((principle, index) => <article className="principle-card tilt-card" key={principle.number} style={{ '--i': index } as CSSProperties}>
          <span className="card-spotlight" aria-hidden="true"/>
          <span className="principle-number">{principle.number}<small>/ 0{principles.length}</small></span>
          <h3>{principle.title}</h3>
          <p>{principle.text}</p>
        </article>)}
      </div>
    </div>
  </section>;
}
