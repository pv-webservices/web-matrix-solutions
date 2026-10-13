import type { CSSProperties } from 'react';
import { Check, Clock, MapPin, Navigation, Phone, Star } from 'lucide-react';
import { services } from '../data';
import { Action, Eyebrow, Lines } from '../components/ui';

/** Illustrative Google Business listing for a fictional cafe, built in HTML instead of an image. */
function ListingMock() {
  return <div className="listing" aria-hidden="true">
    <div className="listing-map"><span className="listing-pin"><MapPin size={22}/></span><span className="listing-ripple"/></div>
    <div className="listing-card">
      <strong>Brew Theory Coffee</strong>
      <span className="listing-rating">4.9 <span className="stars">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={12}/>)}</span> (312)</span>
      <span className="listing-meta">Coffee shop · <Clock size={12}/> Open now</span>
      <div className="listing-actions"><span><Navigation size={14}/>Directions</span><span><Phone size={14}/>Call</span></div>
      <div className="listing-post"><span>New post</span>Autumn menu is here. Come try the cinnamon cold brew.</div>
    </div>
  </div>;
}

export default function Services() {
  return <section className="services" id="services" aria-labelledby="services-title">
    <div className="container services-head">
      <Eyebrow>Services</Eyebrow>
      <Lines id="services-title" lines={['Four ways we', <><em>grow</em> your brand.</>]}/>
      <p className="reveal">Pick one or bring them together. Every service is run by the same team, so your brand looks and sounds like itself everywhere.</p>
    </div>
    <div className="container services-stack">
      {services.map((service, index) => {
        const Icon = service.icon;
        return <article className="service-card" key={service.name} style={{ '--i': index } as CSSProperties}>
          <div className="service-info">
            <div className="service-top"><span className="service-icon"><Icon size={20}/></span><span className="service-num">0{index + 1} / 0{services.length}</span></div>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <ul>{service.features.map(feature => <li key={feature}><Check size={15}/>{feature}</li>)}</ul>
            <Action href="#contact" variant="primary">Talk to us about this</Action>
          </div>
          <div className="service-media">
            {service.image ? <img src={service.image} alt="" loading="lazy"/> : <ListingMock/>}
          </div>
        </article>;
      })}
    </div>
  </section>;
}
