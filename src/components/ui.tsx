import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';

export const LOGO_MARK = '/brand/wms-mark.png';
export const LOGO_FULL = '/brand/wms-logo.png';

export function Brand({ full = false }: { full?: boolean }) {
  return <a className={`brand ${full ? 'brand-full' : ''}`} href="#home" aria-label="Web Matrix Solutions home">
    <img src={full ? LOGO_FULL : LOGO_MARK} alt="WMS, Web Matrix Solutions" width={full ? 640 : 480} height={full ? 297 : 163}/>
  </a>;
}

interface ActionProps {
  children: ReactNode;
  href: string;
  variant?: 'primary' | 'ghost';
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
}

/** Pill link with a rolling label and a magnetic pull (see lib/interactions). */
export function Action({ children, href, variant = 'ghost', icon, className = '', onClick }: ActionProps) {
  return <a className={`btn btn-${variant} ${className}`} href={href} onClick={onClick} data-magnetic>
    <span className="btn-label"><span>{children}</span><span aria-hidden="true">{children}</span></span>
    <span className="btn-icon" aria-hidden="true">{icon ?? <ArrowUpRight size={16}/>}</span>
  </a>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow"><span aria-hidden="true">[</span>{children}<span aria-hidden="true">]</span></p>;
}

/** Heading lines that rise out of a mask when scrolled into view. */
export function Lines({ lines, as: Tag = 'h2', className = '', id }: { lines: ReactNode[]; as?: 'h1' | 'h2' | 'h3'; className?: string; id?: string }) {
  return <Tag className={`split ${className}`} id={id}>
    {lines.map((line, index) => <span className="line" key={index}><span className="line-inner">{line}</span>{' '}</span>)}
  </Tag>;
}
