import { useState } from 'react';
import { useSiteMotion } from './lib/motion';
import { useInteractions } from './lib/interactions';
import Header from './components/Header';
import Hero from './sections/Hero';
import Showcase from './sections/Showcase';
import Statement from './sections/Statement';
import Services from './sections/Services';
import Marquee from './sections/Marquee';
import Works from './sections/Works';
import Approach from './sections/Approach';
import Method from './sections/Method';
import WhyUs from './sections/WhyUs';
import Faq from './sections/Faq';
import Cta from './sections/Cta';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import { LOGO_MARK } from './components/ui';

const PRELOADER_TILES = 60;

/** Logo wipe, tagline, then a wave of tiles that flash orange and collapse (lib/motion). */
function Preloader() {
  return <div className="preloader" aria-hidden="true">
    <div className="preloader-tiles">{Array.from({ length: PRELOADER_TILES }, (_, index) => <i key={index}/>)}</div>
    <div className="preloader-brand">
      <div className="preloader-mark"><img src={LOGO_MARK} alt="" width="480" height="163"/><span className="preloader-sweep"/></div>
      <p className="preloader-tagline"><span><span>We build.</span></span> <span><span>You <em>grow.</em></span></span></p>
    </div>
  </div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  useSiteMotion();
  useInteractions();

  return <>
    <Preloader/>
    <a className="skip-link" href="#services">Skip to content</a>
    <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
    <main inert={menuOpen}>
      <Hero/>
      <Showcase/>
      <Statement/>
      <Services/>
      <Marquee/>
      <Works/>
      <Approach/>
      <Method/>
      <WhyUs/>
      <Faq/>
      <Cta/>
      <Contact/>
    </main>
    <Footer inert={menuOpen}/>
    <div className="cursor-ring" aria-hidden="true"/>
  </>;
}

export default App;
