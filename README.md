# Web Matrix Solutions website

A single-page, motion-rich agency website built with React, TypeScript, Vite, GSAP, Lenis and three.js. The design draws on three references: visuvate.com (floating nav, WebGL works globe, tilted screenshot wall, approach bento), marcuslorenzet.com (giant type with inline image chips, word-by-word text fill, pinned statement with sweeping cards, floating-image CTA) and studiors.be (serif-italic pairing, pinned "Method" steps, light/dark section flips, giant footer wordmark).

The site presents four services only, with no prices: Website Development & Management, Social Media Management, Content Creation and Google My Business Management.

## Run

```sh
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`.

## Verify

```sh
npm run build
npm test
node scripts/scroll-qa.mjs 1440 900   # needs the dev server; saves scene screenshots to qa/scroll/
node scripts/qa-sheet.mjs 1440        # tiles them into qa/sheet-1440.jpg
```

Tests run with reduced motion by default (static layout) plus one motion test that checks the preloader, both WebGL scenes and the globe's outro.

## Structure

- `src/App.tsx` composes the page: Hero, Showcase, Statement, Services, Marquee, Works, Approach, Method, WhyUs, Faq, Cta, Contact, Footer (`src/sections/`).
- `src/data.ts` holds all copy.
- `src/lib/motion.ts` sets up Lenis smooth scroll and every GSAP ScrollTrigger scene. `src/lib/interactions.ts` adds the cursor ring, magnetic buttons and card tilt (mouse only).
- `src/webgl/` contains the hero aurora (plain WebGL, loads with the page) and the works globe (three.js, lazy-loaded when the section mounts). Shaders live in `shaders.ts`.
- Styles are in `src/styles/`.

Pinned scenes use CSS `position: sticky` with scroll progress from ScrollTrigger, so they work at every screen size. With reduced motion, the preloader is skipped and pinned scenes become ordinary sections. If WebGL is unavailable, the hero shows a CSS gradient and the works section shows an image grid.

## Images

`public/assets/gen/` holds 18 images generated with OpenAI `gpt-image-2` by `scripts/generate-images.mjs` (prompts in `scripts/image-prompts.mjs`, record in `public/assets/gen/provenance.json`): 16 website concepts for fictional brands, a social media phone and a website device scene. The script reads `OPENAI_API_KEY` from `.env` (git-ignored) and only generates images that are missing.

The works globe and showcase are labelled as concept designs, not client projects. The Google My Business card is an HTML illustration of a fictional listing. Content Creation and two approach cards reuse earlier images from `public/assets/`.

## Contact behaviour

The contact form opens the visitor's email app with a message to `info@webmatrixsolutions.com` ready to send. Nothing is sent until the visitor presses Send there. Direct email and phone links are also available.
