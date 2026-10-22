import {
  Globe2, MessagesSquare, Clapperboard, MapPin,
  Compass, Smartphone, MousePointerClick, TrendingUp,
  Users, Eye, Puzzle, KeyRound, Target,
} from 'lucide-react';

export const EMAIL = 'info@webmatrixsolutions.com';

export const navigation = [
  ['Services', '#services'], ['Work', '#work'], ['Approach', '#approach'], ['Process', '#process'], ['FAQ', '#faq'],
] as const;

/** Generated images live in /assets/gen; earlier project images in /assets. */
export const gen = (name: string) => `/assets/gen/${name}.webp`;
export const asset = (name: string) => `/assets/${name}.webp`;

/** Generated, fictional website concepts shown in the showcase and the works sphere. */
export const sites = [
  'site-cafe', 'site-realty', 'site-fitness', 'site-skincare', 'site-dental', 'site-travel', 'site-fashion', 'site-restaurant',
  'site-architecture', 'site-jewellery', 'site-education', 'site-organic', 'site-yoga', 'site-auto', 'site-interiors', 'site-tech',
] as const;

export const services = [
  {
    name: 'Website Development & Management', short: 'Websites', icon: Globe2, image: gen('service-web-orange'),
    description: 'Fast, beautiful websites designed to turn visitors into enquiries, then kept secure, updated and improving every month.',
    features: ['Custom design and development', 'Mobile-first and lightning fast', 'SEO-ready structure', 'Hosting, updates and ongoing care'],
  },
  {
    name: 'Social Media Management', short: 'Social', icon: MessagesSquare, image: gen('social-feed-orange'),
    description: 'A consistent, recognisable presence across your channels, planned, published and nurtured so your audience keeps coming back.',
    features: ['Channel strategy and content calendar', 'Posting and scheduling', 'Community and inbox care', 'Monthly performance reports'],
  },
  {
    name: 'Content Creation', short: 'Content', icon: Clapperboard, image: asset('work-portrait'),
    description: 'Scroll-stopping photos, reels, graphics and copy that tell your story clearly and make your brand look as good as it is.',
    features: ['Reels and short-form video', 'Product and brand photography', 'Graphics and carousels', 'Captions and website copy'],
  },
  {
    name: 'Google My Business Management', short: 'Google', icon: MapPin, image: null,
    description: 'Show up when nearby customers search. We keep your Google Business Profile complete, active and working for you.',
    features: ['Profile setup and optimisation', 'Weekly posts and photo updates', 'Review monitoring and replies', 'Local search visibility'],
  },
] as const;

export const marquee = ['Website Development', 'Website Management', 'Social Media', 'Content Creation', 'Reels & Photography', 'Google My Business', 'Local SEO', 'Brand Presence'] as const;

export const statement = 'We help ambitious businesses look sharper, show up everywhere and turn attention into enquiries, with one team handling your website, socials, content and Google presence.';

export const approach = [
  { title: 'Discovery First', icon: Compass, text: 'We start by understanding your goals, your customers and your voice, so everything we make has a clear job to do.', image: asset('approach-orb') },
  { title: 'Mobile-First Design', icon: Smartphone, text: 'Most of your customers meet you on a phone. Every page, post and profile is designed for that screen first.', image: asset('work-mobile-orange') },
  { title: 'Conversion-Driven', icon: MousePointerClick, text: 'Beautiful is the baseline. We shape journeys that make the next step obvious: call, visit, book or buy.', image: null },
  { title: 'Consistent Growth', icon: TrendingUp, text: 'We review what is working every month and keep refining, so your presence gets stronger over time.', image: null },
] as const;

export const steps = [
  { word: 'Listen', text: 'A focused conversation about your business, your customers and what success looks like for you.' },
  { word: 'Plan', text: 'A clear roadmap for your website, channels and content, with priorities and timelines agreed up front.' },
  { word: 'Create', text: 'We design, build, shoot and write, sharing progress at every checkpoint so nothing is a surprise.' },
  { word: 'Grow', text: 'We publish, manage and measure, then keep improving what brings in the most enquiries.' },
] as const;

export const promises = [
  { icon: Users, title: 'One team, every channel', text: 'Website, socials, content and Google handled together, so your brand looks and sounds the same everywhere.' },
  { icon: Eye, title: 'Clarity at every step', text: 'Agreed scope, visible progress and plain-language reporting. You always know what is happening next.' },
  { icon: Puzzle, title: 'Built around you', text: 'No copy-paste templates. Everything is shaped around your customers and how your business actually works.' },
  { icon: KeyRound, title: 'Yours to keep', text: 'Your website, accounts and content stay in your name. We manage them; you own them.' },
  { icon: Target, title: 'Focused on outcomes', text: 'We track the things that matter to you, like calls, visits and enquiries, not vanity numbers.' },
] as const;

export const faq = [
  ['How do I get started with Web Matrix Solutions?', 'Send us a message. We will set up a short conversation about your goals, look at your current website and channels, and recommend a clear plan.'],
  ['Can you manage just one service, like social media?', 'Yes. You can start with one service, such as Google My Business or social media, and add more whenever it makes sense for you.'],
  ['Do you create the content, or do we need to supply it?', 'We can do both. Our team plans and produces photos, reels, graphics and copy, and we are happy to work with material you already have.'],
  ['Will my website work well on phones?', 'Every website we build is designed mobile-first, tested across screen sizes and tuned for speed.'],
  ['What does website management include?', 'Hosting support, security and software updates, backups, content changes and regular checks to keep the site fast and working.'],
  ['Do you work with businesses outside your city?', 'Yes. We work with businesses across India and beyond, with calls and shared progress updates throughout.'],
] as const;
