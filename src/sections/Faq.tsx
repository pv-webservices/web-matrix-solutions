import { useState } from 'react';
import { Plus } from 'lucide-react';
import { faq } from '../data';
import { Eyebrow, Lines } from '../components/ui';

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return <section className="section faq" id="faq" aria-labelledby="faq-title">
    <div className="container faq-inner">
      <div className="section-head centered">
        <Eyebrow>FAQ</Eyebrow>
        <Lines id="faq-title" lines={[<>Frequently asked <em>questions</em></>]}/>
      </div>
      <div className="faq-list">
        {faq.map(([question, answer], index) => {
          const isOpen = open === index;
          return <div className={`faq-item reveal ${isOpen ? 'open' : ''}`} key={question}>
            <h3>
              <button id={`faq-button-${index}`} aria-controls={`faq-answer-${index}`} aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : index)}>
                <span><small>0{index + 1}</small>{question}</span>
                <span className="faq-toggle" aria-hidden="true"><Plus size={18}/></span>
              </button>
            </h3>
            <div id={`faq-answer-${index}`} className="faq-panel" role="region" aria-labelledby={`faq-button-${index}`} inert={!isOpen}>
              <div><p>{answer}</p></div>
            </div>
          </div>;
        })}
      </div>
    </div>
  </section>;
}
