import { useState } from 'react';
import { Pause, Play } from 'lucide-react';

const technologies = [
  ['Vercel', 'vercel'], ['Hostinger', 'hostinger'], ['LangGraph', 'langgraph'],
  ['Next.js', 'nextdotjs'], ['React', 'react'], ['Shopify', 'shopify'],
  ['n8n', 'n8n'], ['Supabase', 'supabase'],
];

export default function TechnologyBar() {
  const [paused, setPaused] = useState(false);
  return <section className="container technology-section reveal" aria-label="Technologies we use">
    <div className="technology-heading">
      <p className="eyebrow"><span aria-hidden="true"/>TECHNOLOGIES WE BUILD WITH</p>
      <button className="technology-pause circle-button" aria-label={paused ? 'Resume technology bar' : 'Pause technology bar'} aria-pressed={paused} onClick={() => setPaused(!paused)}>
        {paused ? <Play size={13}/> : <Pause size={13}/>}
      </button>
    </div>
    <div className={`technology-window ${paused ? 'is-paused' : ''}`}>
      <div className="technology-track">
        {[0, 1].map(copy => <div className="technology-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
          {technologies.map(([name, slug]) => <span className="technology-logo" key={slug}>
            <img src={`/assets/logos/${slug}.svg`} width="30" height="30" alt=""/>
            <span>{name}</span>
          </span>)}
        </div>)}
      </div>
    </div>
  </section>;
}
