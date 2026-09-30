import { Phone } from 'lucide-react';
import { PHONE } from '../data';
import { Action, Eyebrow, image } from './ui';

export default function CallToAction() {
  return <section className="cta-section" aria-labelledby="cta-title">
    <div className="container cta-card">
      <div className="cta-copy reveal">
        <Eyebrow>LET'S BUILD IT</Eyebrow>
        <h2 id="cta-title">Ready to grow<br/><span className="text-gradient">your business?</span></h2>
        <p>Let's talk about how strategy, design and smart technology can move your goals forward.</p>
        <div className="cta-actions">
          <Action href="#contact" variant="primary">Get started</Action>
          <Action href={`tel:${PHONE}`} icon={<Phone size={14}/>}>Book a call</Action>
        </div>
      </div>
      <div className="cta-art" aria-hidden="true">
        <img src={image('cta-device')} width="1344" height="752" loading="lazy" alt=""/>
        <span className="cta-words">Bigger ideas.<br/>Brighter<br/>futures.</span>
      </div>
    </div>
  </section>;
}
