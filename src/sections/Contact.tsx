import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Mail, MapPin } from 'lucide-react';
import { EMAIL, services } from '../data';
import { Eyebrow, Lines } from '../components/ui';

function field(fields: FormData, name: string): string {
  return String(fields.get(name) ?? '').trim();
}

function ContactForm() {
  const [draft, setDraft] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const service = field(fields, 'service');
    const subject = encodeURIComponent(`Project enquiry: ${service}`);
    const body = encodeURIComponent(`Name: ${field(fields, 'name')}\nEmail: ${field(fields, 'email')}\nInterest: ${service}\n\n${field(fields, 'message')}`);
    const url = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setDraft(url);
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
    <label>Tell us about your business<textarea name="message" required rows={4} maxLength={3000} placeholder="What would you like to grow or improve?"/></label>
    <button className="btn btn-primary" type="submit" data-magnetic>
      <span className="btn-label"><span>Prepare email</span><span aria-hidden="true">Prepare email</span></span>
      <span className="btn-icon" aria-hidden="true"><ArrowUpRight size={16}/></span>
    </button>
    <p className="form-help">This opens your email app with your message ready. Nothing is sent until you press Send there.</p>
    {draft && <p className="form-status" role="status">Your email app should now be open with your message. <a href={draft}>Open the prepared email again</a></p>}
  </form>;
}

export default function Contact() {
  return <section className="section contact" id="contact" aria-labelledby="contact-title">
    <div className="container contact-grid">
      <div className="contact-copy">
        <Eyebrow>Contact</Eyebrow>
        <Lines id="contact-title" lines={['Have something', <em key="e">great in mind?</em>]}/>
        <p className="reveal">Tell us about your business and where you want to grow. We will reply with honest advice and a clear next step.</p>
        <div className="contact-methods reveal">
          <a className="contact-method" href={`mailto:${EMAIL}`}><span className="contact-method-icon"><Mail size={18}/></span><span><small>Email us</small>{EMAIL}</span><ArrowUpRight size={17}/></a>
          <div className="contact-method"><span className="contact-method-icon"><MapPin size={18}/></span><span><small>Working with</small>Businesses across India and beyond</span></div>
        </div>
      </div>
      <div className="form-panel reveal">
        <h3>Start a conversation</h3>
        <ContactForm/>
      </div>
    </div>
  </section>;
}
