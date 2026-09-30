import { useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { insights, projects, services } from './data';
import { useSiteMotion } from './motion';
import TechnologyBar from './TechnologyBar';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Process from './components/Process';
import Work from './components/Work';
import Commitments from './components/Commitments';
import CallToAction from './components/CallToAction';
import Insights from './components/Insights';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { Action, DetailDialog, image, type Detail } from './components/ui';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [detail, setDetail] = useState<Detail>(null);
  const root = useRef<HTMLDivElement>(null);
  useSiteMotion(root);

  const close = () => setDetail(null);

  function showService(index: number) {
    const service = services[index];
    setDetail({
      eyebrow: 'WHAT WE DO',
      title: service.name,
      body: <>
        <p>{service.detail}</p>
        <ul className="detail-list">{service.features.map(feature => <li key={feature}><Check size={16}/>{feature}</li>)}</ul>
        <Action href="#contact" onClick={close} variant="primary">Talk about this service</Action>
      </>,
    });
  }

  function showProject(index: number) {
    const project = projects[index];
    setDetail({
      eyebrow: `CREATIVE CONCEPT · ${project.category.toUpperCase()}`,
      title: project.name,
      body: <>
        <img className="detail-image" src={image(project.image)} alt={project.description}/>
        <p>{project.description}</p>
        <p>{project.approach}</p>
        <p className="detail-note">This visual is an illustrative concept, not a published client case study.</p>
        <Action href="#contact" onClick={close} variant="primary">Discuss a similar project</Action>
      </>,
    });
  }

  function showInsight(index: number) {
    const item = insights[index];
    setDetail({
      eyebrow: `${item.category.toUpperCase()} · ${item.read.toUpperCase()}`,
      title: item.title,
      body: <>
        <img className="detail-image" src={image(item.image)} style={{ objectPosition: item.position }} alt=""/>
        <p>{item.text}</p>
        <Action href="#contact" onClick={close} variant="primary">Let's talk about your goals</Action>
      </>,
    });
  }

  return <div ref={root}>
    <a className="skip-link" href="#services">Skip to content</a>
    <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
    <main inert={menuOpen}>
      <Hero/>
      <TechnologyBar/>
      <Services onSelect={showService}/>
      <About/>
      <Process/>
      <Work onSelect={showProject}/>
      <Commitments/>
      <CallToAction/>
      <Insights onSelect={showInsight}/>
      <Faq/>
      <Contact/>
    </main>
    <Footer inert={menuOpen} onService={showService}/>
    <DetailDialog detail={detail} close={close}/>
  </div>;
}

export default App;
