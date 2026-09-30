import { useEffect, useState, type CSSProperties } from 'react';
import { ArrowUpRight, Menu, Phone, X } from 'lucide-react';
import { navigation, PHONE, PHONE_LABEL } from '../data';
import { Action, Brand } from './ui';

const SCROLLED_OFFSET = 24;

function useActiveSection() {
  const [active, setActive] = useState('#home');
  useEffect(() => {
    const sections = navigation
      .map(([, href]) => document.querySelector<HTMLElement>(href))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting);
      if (visible.length) setActive(`#${visible[visible.length - 1].target.id}`);
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return active;
}

export default function Header({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection();

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > SCROLLED_OFFSET);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.querySelector<HTMLElement>('.mobile-nav a')?.focus();
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', escape);
    return () => { document.body.style.overflow = prior; document.removeEventListener('keydown', escape); };
  }, [menuOpen, setMenuOpen]);

  const close = () => setMenuOpen(false);

  return <>
    <header className={`site-header ${scrolled || menuOpen ? 'is-scrolled' : ''}`}>
      <div className="container header-row">
        <Brand/>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.filter(([label]) => label !== 'Contact').map(([label, href]) => <a key={label} href={href} className={active === href ? 'is-active' : ''} aria-current={active === href ? 'true' : undefined}>{label}</a>)}
        </nav>
        <Action href="#contact" variant="primary" className="header-action">Let's talk</Action>
        <button className="menu-toggle round-control" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={21}/> : <Menu size={21}/>}
        </button>
      </div>
    </header>
    {menuOpen && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">
      {navigation.map(([label, href], index) => <a key={label} href={href} onClick={close} style={{ '--i': index } as CSSProperties}>
        <span><small>0{index + 1}</small>{label}</span><ArrowUpRight/>
      </a>)}
      <a className="mobile-call" href={`tel:${PHONE}`} onClick={close} style={{ '--i': navigation.length } as CSSProperties}><span><small>Call</small>{PHONE_LABEL}</span><Phone/></a>
    </nav>}
  </>;
}
