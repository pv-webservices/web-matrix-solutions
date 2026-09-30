import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { EMAIL, PHONE, PHONE_LABEL, services } from '../data';
import { Eyebrow } from './ui';

function field(fields: FormData, name: string): string {
  return String(fields.get(name) ?? '').trim();
}

function ContactForm() {
  const [status, setStatus] = useState('');
  const [draft, setDraft] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const service = field(fields, 'service');
    const subject = encodeURIComponent(`Project enquiry: ${service}`);
    const body = encodeURIComponent(`Name: ${field(fields, 'name')}\nEmail: ${field(fields, 'email')}\nInterest: ${service}\n\n${field(fields, 'message')}`);
    const url = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setDraft(url);
    setStatus('Your email app should open with your message ready to send. Please review and send it there.');
    window.location.href = url;
  }

  return <form className="contact-form" onSubmit={submit}>
    <div className="field-pair">
      <label>Your name<input name="name" autoComplete="name" required maxLength={100} placeholder="Your name"/></label>
      <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com"/></label>
    </div>
    <label>What can we help with?
      <select name="service" defaultValue="A new project">
        <option>A new project</option>
        {services.map(service => <option key={service.name}>{service.name}</option>)}
      </select>
    </label>
    <label>Tell us about the project<textarea name="message" required rows={4} maxLength={3000} placeholder="What are you looking to build or improve?"/></label>
    <button className="btn btn-primary submit-action" type="submit"><span className="btn-label">Prepare email</span><span className="btn-icon" aria-hidden="true"><ArrowUpRight size={16}/></span></button>
    <p className="form-help">This opens your email app. Your message is sent only when you choose Send there.</p>
    {status && <p className="form-status" role="status">{status} {draft && <a href={draft}>Open the prepared email again</a>}</p>}
  </form>;
}

export default function Contact() {
  return <section className="section contact-section" id="contact">
    <div className="container contact-grid">
      <div className="contact-copy reveal">
        <Eyebrow>CONTACT</Eyebrow>
        <h2>Have something<br/><span className="text-gradient">great in mind?</span></h2>
        <p>Tell us what you want to build, improve or connect. We'll take it from there.</p>
        <div className="contact-methods">
          <a className="contact-method tilt-card" href={`mailto:${EMAIL}`}><span className="contact-method-icon"><Mail size={18}/></span><span><small>Email us</small>{EMAIL}</span><ArrowUpRight size={17}/></a>
          <a className="contact-method tilt-card" href={`tel:${PHONE}`}><span className="contact-method-icon"><Phone size={18}/></span><span><small>Call us</small>{PHONE_LABEL}</span><ArrowUpRight size={17}/></a>
          <div className="contact-method is-static"><span className="contact-method-icon"><MapPin size={18}/></span><span><small>Working with</small>Businesses across India and beyond</span></div>
        </div>
      </div>
      <div className="form-panel reveal">
        <p className="form-panel-heading">START A CONVERSATION</p>
        <h3>Let's hear your idea.</h3>
        <ContactForm/>
      </div>
    </div>
  </section>;
}
