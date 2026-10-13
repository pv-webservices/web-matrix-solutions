import { gen, sites } from '../data';
import { Action, Lines } from '../components/ui';

const ROWS = [sites.slice(0, 6), sites.slice(6, 12), [...sites.slice(12), ...sites.slice(0, 2)]];

export default function Showcase() {
  return <section className="showcase" id="showcase" aria-labelledby="showcase-title">
    <div className="showcase-sticky">
      <div className="showcase-stage" aria-hidden="true">
        <div className="showcase-plane">
          {ROWS.map((row, index) => <div className="showcase-row" key={index}>
            {[...row, ...row].map((name, i) => <img key={`${name}-${i}`} src={gen(name)} alt="" fetchPriority="low" decoding="async" width="1400" height="933"/>)}
          </div>)}
        </div>
      </div>
      <div className="showcase-copy">
        <Lines id="showcase-title" lines={['Design that speaks.', <em key="e">Growth that shows.</em>]}/>
        <p className="reveal">Every brand deserves a presence that feels considered, from the first scroll on Instagram to the moment someone taps “Call” on Google.</p>
        <div className="reveal"><Action href="#services">What we do</Action></div>
      </div>
    </div>
  </section>;
}
