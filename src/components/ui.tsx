import { useEffect, useRef, type ReactNode } from 'react';
import { ArrowUpRight, X } from 'lucide-react';

export const image = (name: string) => `/assets/${name}.webp`;

export function Brand() {
  return <a className="brand" href="#home" aria-label="Web Matrix Solutions home">
    <span className="brand-symbol" aria-hidden="true"><i/><i/><i/><i/></span>
    <span>web<span className="brand-accent">matrix</span><small>SOLUTIONS</small></span>
  </a>;
}

type ActionProps = {
  children: ReactNode;
  href: string;
  variant?: 'primary' | 'ghost';
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
};

export function Action({ children, href, variant = 'ghost', icon, className = '', onClick }: ActionProps) {
  return <a className={`btn btn-${variant} ${className}`} href={href} onClick={onClick}>
    <span className="btn-label">{children}</span>
    <span className="btn-icon" aria-hidden="true">{icon ?? <ArrowUpRight size={16}/>}</span>
  </a>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow"><span aria-hidden="true"/>{children}</p>;
}

export function SectionIntro({ eyebrow, title, description, action }: { eyebrow: string; title: ReactNode; description?: string; action?: ReactNode }) {
  return <div className="section-intro">
    <div className="reveal"><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2></div>
    {(description || action) && <div className="section-intro-aside reveal">{description && <p>{description}</p>}{action}</div>}
  </div>;
}

export type Detail = { eyebrow: string; title: string; body: ReactNode } | null;

export function DetailDialog({ detail, close }: { detail: Detail; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!detail) return;
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, [detail]);
  return <dialog ref={ref} className="detail-dialog" onCancel={close} onClick={event => { if (event.target === event.currentTarget) close(); }}>
    <div className="detail-inner">
      <button className="round-control dialog-close" aria-label="Close details" onClick={close}><X size={20}/></button>
      {detail && <><Eyebrow>{detail.eyebrow}</Eyebrow><h2>{detail.title}</h2>{detail.body}</>}
    </div>
  </dialog>;
}
