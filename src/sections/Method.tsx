import type { CSSProperties } from 'react';
import { steps } from '../data';
import { Eyebrow, Lines } from '../components/ui';

/** Pinned four-step process; lib/motion sets `data-step` and `--p` from scroll. */
export default function Method() {
  return <section className="method" id="process" aria-labelledby="method-title" data-step="0">
    <div className="method-sticky">
      <div className="container method-head">
        <div>
          <Eyebrow>Process</Eyebrow>
          <Lines id="method-title" lines={[<>The <em>Method</em></>]}/>
        </div>
        <p>Four steps. No surprises.</p>
      </div>
      <ol className="container method-tabs">
        {steps.map((step, index) => <li key={step.word} style={{ '--i': index } as CSSProperties}>
          <span>0{index + 1}</span>{step.word}<i aria-hidden="true"/>
        </li>)}
      </ol>
      <div className="container method-stage">
        {steps.map((step, index) => <div className="method-slide" key={step.word} style={{ '--i': index } as CSSProperties}>
          <span className="method-num" aria-hidden="true">0{index + 1}</span>
          <h3><span>{step.word}</span></h3>
          <p>{step.text}</p>
        </div>)}
      </div>
    </div>
  </section>;
}
