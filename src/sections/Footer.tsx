import { ArrowUp, Mail } from 'lucide-react';
import { EMAIL, navigation, services } from '../data';
import { Action, Brand } from '../components/ui';

const WORDMARK = 'webmatrix';

export default function Footer({ inert }: { inert: boolean }) {
  return <footer className="footer" inert={inert}>
    <div className="container footer-top">
      <div className="footer-brand">
        <Brand full/>
        <p>Websites, social media, content and Google presence. One team, built to help your business be found, followed and chosen.</p>
        <Action href="#contact" variant="primary">Start a project</Action>
      </div>
      <div className="footer-column">
        <h3>Explore</h3>
        {navigation.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
        <a href="#contact">Contact</a>
      </div>
      <div className="footer-column">
        <h3>Services</h3>
        {services.map(service => <a key={service.name} href="#services">{service.name}</a>)}
      </div>
      <div className="footer-column">
        <h3>Say hello</h3>
        <a className="footer-contact" href={`mailto:${EMAIL}`}><Mail size={15}/>{EMAIL}</a>
      </div>
    </div>
    <div className="footer-wordmark" aria-hidden="true">
      {WORDMARK.split('').map((letter, index) => <span key={index}>{letter}</span>)}
    </div>
    <div className="container footer-bottom">
      <span>© {new Date().getFullYear()} Web Matrix Solutions. All rights reserved.</span>
      <span>We build. You grow.</span>
      <a href="#home" className="back-top">Back to top <ArrowUp size={14}/></a>
    </div>
  </footer>;
}
