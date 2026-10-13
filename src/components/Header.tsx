import { useEffect, useState, type CSSProperties } from 'react';
import { ArrowUpRight, Menu, Phone, X } from 'lucide-react';
import { navigation, PHONE, PHONE_LABEL } from '../data';
import { Action, Brand } from './ui';

const SCROLLED_OFFSET = 24;

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > SCROLLED_OFFSET);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return scrolled;
}

interface HeaderProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export default function Header({ menuOpen, setMenuOpen }: HeaderProps) {
  const scrolled = useScrolled();

  useEffect(() => {
    if (!menuOpen) return;
    document.documentElement.classList.add('menu-open');
    document.querySelector<HTMLElement>('.mobile-nav a')?.focus();
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', escape);
    return () => { document.documentElement.classList.remove('menu-open'); document.removeEventListener('keydown', escape); };
  }, [menuOpen, setMenuOpen]);

  const close = () => setMenuOpen(false);

  return <>
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header-bar">
        <Brand/>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
        </nav>
        <Action href="#contact" variant="primary" className="header-action">Let's talk</Action>
        <button className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </div>
    </header>
    {menuOpen && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">
      {[...navigation, ['Contact', '#contact'] as const].map(([label, href], index) => <a key={label} href={href} onClick={close} style={{ '--i': index } as CSSProperties}>
        <span><small>0{index + 1}</small>{label}</span><ArrowUpRight/>
      </a>)}
      <a className="mobile-call" href={`tel:${PHONE}`} onClick={close} style={{ '--i': navigation.length + 1 } as CSSProperties}><span><small>Call</small>{PHONE_LABEL}</span><Phone/></a>
    </nav>}
  </>;
}
