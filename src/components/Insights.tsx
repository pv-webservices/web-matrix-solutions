import { ArrowUpRight } from 'lucide-react';
import { insights } from '../data';
import { image, SectionIntro } from './ui';

interface InsightsProps {
  onSelect: (index: number) => void;
}

export default function Insights({ onSelect }: InsightsProps) {
  return <section className="section insights-section" id="insights">
    <div className="container">
      <SectionIntro
        eyebrow="INSIGHTS"
        title={<>Useful thinking for<br/><span className="text-gradient">what comes next.</span></>}
        description="Practical ideas on websites, systems and sustainable digital growth."
      />
      <div className="insight-grid">
        {insights.map((item, index) => <button className="insight-card tilt-card reveal" key={item.title} onClick={() => onSelect(index)}>
          <span className="insight-media">
            <img src={image(item.image)} style={{ objectPosition: item.position }} loading="lazy" width="640" height="400" alt=""/>
            <span className="insight-tag">{item.category}</span>
          </span>
          <span className="insight-body">
            <strong className="insight-title">{item.title}</strong>
            <span className="insight-meta">{item.read}<span className="insight-arrow"><ArrowUpRight size={17}/></span></span>
          </span>
        </button>)}
      </div>
    </div>
  </section>;
}
