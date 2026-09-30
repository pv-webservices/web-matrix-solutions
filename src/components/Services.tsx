import { ArrowRight } from 'lucide-react';
import { services } from '../data';
import { Action, SectionIntro } from './ui';

interface ServicesProps {
  onSelect: (index: number) => void;
}

export default function Services({ onSelect }: ServicesProps) {
  return <section className="section services-section" id="services">
    <div className="container">
      <SectionIntro
        eyebrow="SERVICES"
        title={<>Everything you need<br/>to grow <span className="text-gradient">under one roof.</span></>}
        description="From your first impression to the systems behind it, we help you attract, engage and convert your audience."
        action={<Action href="#contact">Discuss your project</Action>}
      />
      <div className="service-grid">
        {services.map((service, index) => <article className={`service-card tilt-card reveal ${service.color}`} key={service.name}>
          <span className="card-spotlight" aria-hidden="true"/>
          <div className="service-top">
            <span className="service-icon"><service.icon size={22} strokeWidth={1.8}/></span>
            <span className="service-number">0{index + 1}</span>
          </div>
          <h3>{service.name}</h3>
          <p>{service.description}</p>
          <button className="card-link" onClick={() => onSelect(index)} aria-label={`Learn more about ${service.name}`}>
            Learn more <ArrowRight size={16}/>
          </button>
        </article>)}
      </div>
    </div>
  </section>;
}
