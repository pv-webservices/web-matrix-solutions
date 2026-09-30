import type { CSSProperties } from 'react';
import { ArrowDown, Play } from 'lucide-react';
import { heroScreenWords, heroStats } from '../data';
import { Action, image } from './ui';

const delay = (seconds: number) => ({ '--d': `${seconds}s` }) as CSSProperties;

function ScrollBadge() {
  return <a className="scroll-badge hero-in" style={delay(1.1)} href="#services" aria-label="Scroll to services">
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <defs><path id="badge-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0"/></defs>
      <text><textPath href="#badge-circle">SCROLL TO EXPLORE · SCROLL TO EXPLORE ·</textPath></text>
    </svg>
    <ArrowDown size={18}/>
  </a>;
}

export default function Hero() {
  return <section className="hero" id="home">
    <div className="hero-media" aria-hidden="true">
      <img className="hero-bg" src={image('hero-environment')} width="1344" height="752" fetchPriority="high" alt=""/>
      <div className="hero-overlay"/>
      <span className="hero-aurora"/>
    </div>

    <div className="container hero-grid">
      <div className="hero-copy">
        <p className="eyebrow hero-in" style={delay(0.1)}><span aria-hidden="true"/>STRATEGY · DESIGN · TECHNOLOGY</p>
        <h1>
          <span className="hero-line"><span className="hero-in" style={delay(0.2)}>Make your next</span></span>
          <span className="hero-line"><em className="hero-in" style={delay(0.35)}>move matter.</em></span>
        </h1>
        <p className="hero-lead hero-in" style={delay(0.5)}>Websites, custom CRM, AI automation and growth marketing, all in one partner to help your business scale faster and smarter.</p>
        <div className="hero-actions hero-in" style={delay(0.65)}>
          <Action href="#contact" variant="primary">Start a project</Action>
          <Action href="#work" icon={<Play size={14}/>}>Explore our work</Action>
        </div>
      </div>

      <div className="hero-art">
        <div className="hero-device hero-in" style={delay(0.3)}>
          <img src={image('hero-device')} width="1536" height="1024" fetchPriority="high" alt="Black glass laptop glowing with violet and magenta light, resting above dark rocks"/>
          <div className="hero-screen" aria-hidden="true">
            {heroScreenWords.map((word, index) => <span key={word} style={{ '--w': index } as CSSProperties}>{word}</span>)}
          </div>
          <span className="hero-tag" aria-hidden="true">Your next chapter<br/>starts here</span>
        </div>
      </div>
    </div>

    <div className="container hero-bottom">
      <dl className="hero-stats hero-in" style={delay(0.85)}>
        {heroStats.map(stat => <div key={stat.label}>
          <dt>{stat.label}</dt>
          <dd><span className="count" data-count={stat.value} data-pad={stat.pad ? '2' : '0'}>{stat.pad ? String(stat.value).padStart(2, '0') : stat.value}</span>{stat.suffix}</dd>
        </div>)}
      </dl>
      <ScrollBadge/>
    </div>
  </section>;
}
