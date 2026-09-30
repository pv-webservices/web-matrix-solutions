import { ArrowUp, Mail, Phone } from 'lucide-react';
import { EMAIL, navigation, PHONE, PHONE_LABEL, services } from '../data';
import { Action, Brand } from './ui';

interface FooterProps {
  inert: boolean;
  onService: (index: number) => void;
}

export default function Footer({ inert, onService }: FooterProps) {
  return <footer className="footer" inert={inert}>
    <div className="container footer-top">
      <div className="footer-brand">
        <Brand/>
        <p>Strategy, design and technology. All in one place, built to move businesses forward.</p>
        <Action href="#contact" variant="primary">Start a project</Action>
      </div>
      <div className="footer-column">
        <h3>Quick links</h3>
        {navigation.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
        <a href="#faq">FAQ</a>
      </div>
      <div className="footer-column">
        <h3>Services</h3>
        {services.map((service, index) => <button key={service.name} onClick={() => onService(index)}>{service.name}</button>)}
      </div>
      <div className="footer-column">
        <h3>Let's connect</h3>
        <a className="footer-contact" href={`mailto:${EMAIL}`}><Mail size={15}/>{EMAIL}</a>
        <a className="footer-contact" href={`tel:${PHONE}`}><Phone size={15}/>{PHONE_LABEL}</a>
      </div>
    </div>
    <div className="container footer-bottom">
      <span>© {new Date().getFullYear()} Web Matrix Solutions. All rights reserved.</span>
      <span>Designed to impress. Built to perform.</span>
      <a href="#home" className="back-top">Back to top <ArrowUp size={14}/></a>
    </div>
  </footer>;
}
