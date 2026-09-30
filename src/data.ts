import {
  Globe2, Workflow, Sparkles, MessagesSquare, MapPin, ShoppingBag,
  Search, Route, Rocket, ChartNoAxesCombined,
  Layers, Eye, Puzzle, KeyRound, Target,
} from 'lucide-react';

export const EMAIL = 'info@webmatrixsolutions.com';
export const PHONE = '+918920847457';
export const PHONE_LABEL = '+91 89208 47457';

export const navigation = [
  ['Home', '#home'], ['Services', '#services'], ['About', '#about'], ['Process', '#process'],
  ['Work', '#work'], ['Insights', '#insights'], ['Contact', '#contact'],
] as const;

export const heroStats = [
  { value: 6, pad: true, suffix: '', label: 'Core services' },
  { value: 4, pad: true, suffix: '', label: 'Step process' },
  { value: 1, pad: true, suffix: '', label: 'Connected team' },
  { value: 100, pad: false, suffix: '%', label: 'Tailored scope' },
] as const;

export const heroScreenWords = ['Ideas', 'Strategy', 'Websites', 'Growth'] as const;

export const services = [
  { name: 'Website Development', icon: Globe2, color: 'violet', description: 'Fast, expressive websites designed to turn interest into action.', detail: 'We plan, design and build responsive websites around the real decisions your visitors need to make. Clear journeys, accessible interfaces and search ready foundations are built in from the start.', features: ['Responsive design and development', 'Performance and search foundations', 'Content management and integrations'] },
  { name: 'Custom CRM', icon: Workflow, color: 'coral', description: 'A connected home for leads, relationships and daily work.', detail: 'We map how your team actually works, then shape a CRM that makes customer information, follow ups and reporting easier to use.', features: ['Tailored pipelines and dashboards', 'Lead and customer management', 'Workflow and tool integrations'] },
  { name: 'AI Automation', icon: Sparkles, color: 'magenta', description: 'Useful automation for the repetitive parts of your business.', detail: 'We find focused opportunities for AI and build practical workflows with clear review points and human oversight.', features: ['Workflow discovery and design', 'AI assistants and integrations', 'Monitoring and human handoffs'] },
  { name: 'Social Media Management', icon: MessagesSquare, color: 'cyan', description: 'A distinct voice and a more consistent presence online.', detail: 'Strategy, content planning and community care work together to make your channels feel like one brand.', features: ['Channel strategy and calendars', 'Content and community management', 'Performance reporting'] },
  { name: 'Google Business Profile', icon: MapPin, color: 'pink', description: 'Make it easier for nearby customers to find and choose you.', detail: 'We help keep your Google Business Profile accurate, active and useful through local content and review workflows.', features: ['Profile and local visibility setup', 'Posts and update workflows', 'Review monitoring'] },
  { name: 'Shopify Development', icon: ShoppingBag, color: 'teal', description: 'A storefront that feels like your brand and shops with ease.', detail: 'We build thoughtful Shopify experiences with a clear product journey and a foundation your team can manage.', features: ['Storefront and theme design', 'Catalog and checkout setup', 'Apps, analytics and integrations'] },
] as const;

export const aboutStatement = 'Web Matrix Solutions is a digital studio for businesses that want more than a pretty website. We bring strategy, design, development and automation together so every touchpoint works harder for your growth.';

export const principles = [
  { number: '01', title: 'Clarity before complexity', text: 'The strongest digital experience makes the next step obvious. We keep the message, structure and interface focused on what your audience needs.' },
  { number: '02', title: 'Design with purpose', text: 'Every interaction should earn its place. We use visual craft to make your brand distinctive and your website easier to use.' },
  { number: '03', title: 'Build for what comes next', text: 'Your tools should support your team as you grow. We make considered technical choices and leave room to evolve.' },
] as const;

export const steps = [
  { name: 'Discover', icon: Search, text: 'Understand your goals, audience and opportunity.', detail: 'A working session gives us the context to define the problem and the outcomes that matter.' },
  { name: 'Plan', icon: Route, text: 'Turn insight into a focused, tailored roadmap.', detail: 'Scope, priorities, milestones and success measures are clear before production begins.' },
  { name: 'Create', icon: Rocket, text: 'Design, build and refine with you in the loop.', detail: 'Regular checkpoints keep the work aligned while the site, system or campaign takes shape.' },
  { name: 'Grow', icon: ChartNoAxesCombined, text: 'Measure, learn and improve what matters.', detail: 'After launch, we review the experience and identify the next improvements with the most value.' },
] as const;

export const projects = [
  { name: 'The editorial launch', image: 'work-portrait', category: 'Social presence', description: 'An expressive visual direction for a fashion led brand.', approach: 'Creative direction, social templates and a content system that stays coherent from launch onward.' },
  { name: 'A sharper digital story', image: 'work-device', category: 'Web experience', description: 'A product story told through a focused, premium interface.', approach: 'Positioning, responsive page design and a concise path from first impression to enquiry.' },
  { name: 'Built to be remembered', image: 'work-architecture', category: 'Brand campaign', description: 'Architectural imagery gives a campaign its own visual language.', approach: 'Campaign concept, visual art direction and a flexible content plan across channels.' },
  { name: 'A clearer path to action', image: 'work-mobile', category: 'Mobile journey', description: 'A mobile first journey that keeps the next step in sight.', approach: 'Landing page structure, readable content and a direct conversion path.' },
] as const;

export const commitments = [
  { icon: Layers, title: 'One partner, fewer handoffs', text: 'Strategy, design, development and automation sit with one team, so nothing gets lost between vendors.' },
  { icon: Eye, title: 'Clarity at every checkpoint', text: 'You see the scope, milestones and progress before and during the work. No guesswork about what happens next.' },
  { icon: Puzzle, title: 'Built around your business', text: 'No fixed templates. Every website, CRM or workflow is shaped around how your customers and team actually work.' },
  { icon: KeyRound, title: 'Made to be managed', text: 'We hand over systems your team can update with confidence, with guidance whenever you need it.' },
  { icon: Target, title: 'Measured by what matters', text: 'We agree on the outcomes that count and review the experience after launch to find the next improvement.' },
] as const;

export const insights = [
  { title: 'Make your website easier to choose', image: 'work-mobile', position: 'center 35%', category: 'Web strategy', read: '2 min read', text: 'Start with the questions customers ask before they contact you. Give each page one clear job, explain the value in plain language and make the next step visible on a phone. A focused path helps visitors move from curiosity to confidence.' },
  { title: 'Where automation should begin', image: 'hero-device', position: '70% 40%', category: 'Operations', read: '2 min read', text: 'Choose one repetitive task with a clear owner and a measurable outcome. Map the inputs, add a review point and test the workflow before expanding it. Useful automation gives people more time for the work that needs their judgment.' },
  { title: 'A more connected customer journey', image: 'hero-environment', position: '62% center', category: 'Growth', read: '2 min read', text: 'A contact form, CRM and follow up process should feel like one system. Agree on who owns each enquiry, keep the information you need in one place and make it simple to respond promptly.' },
] as const;

export const faq = [
  ['What can Web Matrix Solutions help with?', 'We work across websites, custom CRM systems, AI automation, social media, Google Business Profile and Shopify development. We can focus on one service or plan a connected project.'],
  ['How does a project begin?', 'We begin with a conversation about your goals, audience and current setup. Then we recommend a clear scope, milestones and next steps.'],
  ['Can you work with our existing tools?', 'Yes. We look at what is already working and identify where a website, CRM, store or automation should connect with it.'],
  ['How long does a project take?', 'Timing depends on the scope and the material available. We agree on a realistic schedule and review points before work begins.'],
  ['Do you offer a custom plan?', 'Yes. The work is shaped around your priorities rather than a fixed package. You can start with a focused project and grow from there.'],
] as const;
