import { steps } from '../data';
import { Action, Eyebrow, image } from './ui';

export default function Process() {
  return <section className="process-section" id="process">
    <div className="process-pin">
      <div className="container">
        <div className="process-head">
          <div className="process-intro reveal">
            <Eyebrow>THE PROCESS</Eyebrow>
            <h2>From strategy to<br/><span className="text-gradient">measurable growth.</span></h2>
            <p>A proven, transparent process designed to turn your goals into real business outcomes.</p>
            <Action href="#contact" variant="primary">Start with discovery</Action>
          </div>
          <div className="process-orb" aria-hidden="true">
            <img src={image('process-sphere')} loading="lazy" width="1024" height="1024" alt=""/>
            <span>IDEAS<br/>STRATEGY<br/>EXECUTION<br/>GROWTH</span>
          </div>
        </div>
        <div className="process-steps">
          <span className="process-track" aria-hidden="true"><span className="process-fill"/></span>
          <ol className="process-list">
            {steps.map((step, index) => <li className="process-step" key={step.name}>
              <span className="process-icon"><step.icon size={20} strokeWidth={1.8}/></span>
              <h3><small>0{index + 1}</small> {step.name}</h3>
              <p>{step.text}</p>
              <p className="process-detail">{step.detail}</p>
            </li>)}
          </ol>
        </div>
      </div>
    </div>
  </section>;
}
