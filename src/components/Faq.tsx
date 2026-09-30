import { useState } from 'react';
import { Mail, MessageCircle, Plus } from 'lucide-react';
import { EMAIL, faq } from '../data';
import { Action, Eyebrow, image } from './ui';

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return <section className="section faq-section" id="faq">
    <div className="container faq-grid">
      <div className="faq-intro">
        <div className="reveal">
          <Eyebrow>FAQ</Eyebrow>
          <h2>Frequently asked<br/><span className="text-gradient">questions.</span></h2>
          <p>Still have questions? We're here to help.</p>
          <Action href="#contact">Contact us</Action>
        </div>
        <div className="faq-orb tilt-card">
          <img src={image('faq-sphere')} width="1024" height="1024" loading="lazy" alt=""/>
          <div className="faq-orb-copy">
            <span className="faq-orb-icon"><MessageCircle size={18}/></span>
            <strong>Have a question?</strong>
            <span>We're just a message away.</span>
            <Action href={`mailto:${EMAIL}`} icon={<Mail size={14}/>}>Email us</Action>
          </div>
        </div>
      </div>
      <div className="faq-list">
        {faq.map(([question, answer], index) => {
          const isOpen = open === index;
          return <div className={`faq-item reveal ${isOpen ? 'open' : ''}`} key={question}>
            <h3>
              <button id={`faq-button-${index}`} aria-controls={`faq-answer-${index}`} aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : index)}>
                <span><small>0{index + 1}.</small>{question}</span>
                <span className="faq-toggle" aria-hidden="true"><Plus size={18}/></span>
              </button>
            </h3>
            <div id={`faq-answer-${index}`} className="faq-panel" role="region" aria-labelledby={`faq-button-${index}`} inert={!isOpen} aria-hidden={!isOpen}>
              <div><p>{answer}</p></div>
            </div>
          </div>;
        })}
      </div>
    </div>
  </section>;
}
