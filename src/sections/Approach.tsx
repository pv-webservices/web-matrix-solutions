import { BellRing, MousePointer2 } from 'lucide-react';
import { approach } from '../data';
import { Eyebrow, Lines } from '../components/ui';

/** Animated booking flow: a cursor taps "Book a table" and enquiries stack up. */
function ConversionMock() {
  return <div className="conv" aria-hidden="true">
    <div className="conv-page">
      <span className="conv-bar"/><span className="conv-bar short"/>
      <span className="conv-button">Book a table</span>
      <MousePointer2 className="conv-cursor" size={22}/>
    </div>
    <div className="conv-toasts">
      {['New booking · Table for 4', 'New enquiry · Website form', 'Call from Google · 2 min'].map(text => <span key={text}><BellRing size={13}/>{text}</span>)}
    </div>
  </div>;
}

/** Growth line that draws itself when the card comes into view. */
function GrowthMock() {
  return <svg className="growth" viewBox="0 0 320 160" aria-hidden="true">
    <defs>
      <linearGradient id="growth-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3d7bff" stopOpacity=".45"/><stop offset="1" stopColor="#3d7bff" stopOpacity="0"/></linearGradient>
    </defs>
    {[40, 80, 120].map(y => <line key={y} x1="0" x2="320" y1={y} y2={y} className="growth-grid"/>)}
    <path className="growth-area" d="M0 140 C40 132 60 120 90 118 S140 96 170 90 S230 54 260 44 S300 22 320 14 L320 160 L0 160Z" fill="url(#growth-fill)"/>
    <path className="growth-line" d="M0 140 C40 132 60 120 90 118 S140 96 170 90 S230 54 260 44 S300 22 320 14" pathLength="1"/>
    <circle className="growth-dot" cx="320" cy="14" r="5"/>
  </svg>;
}

export default function Approach() {
  return <section className="section approach" id="approach" aria-labelledby="approach-title">
    <div className="container">
      <div className="section-head">
        <Eyebrow>How we think</Eyebrow>
        <Lines id="approach-title" lines={[<>Our <em>approach</em></>]}/>
      </div>
      <div className="bento">
        {approach.map(({ title, text, icon: Icon, image }, index) => <article className={`bento-card b${index + 1} reveal`} key={title} data-tilt>
          <div className="bento-copy">
            <span className="bento-icon"><Icon size={18}/></span>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
          <div className="bento-visual">
            {image ? <img src={image} alt="" loading="lazy"/> : index === 2 ? <ConversionMock/> : <GrowthMock/>}
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
