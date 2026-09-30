# Web Matrix Solutions website

A responsive, single-page business website built with React, TypeScript and Vite. The supplied homepage image in `public/` informed the dark visual direction. The site now uses the Web Matrix Solutions brand and the verified contact details provided for this project.

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
```

The Playwright tests cover every in-page link, hero and navigation redirects, service and concept details, the commitments slideshow, insights, FAQ, the contact form, mobile navigation, and layout plus image loading at seven viewport widths.

## Structure

`src/App.tsx` composes the page from `src/components/` (Header, Hero, Services, About, Process, Work, Commitments, CallToAction, Insights, Faq, Contact, Footer). Copy lives in `src/data.ts`; styles are split under `src/styles/` and imported by `src/styles.css`. All scroll motion lives in `src/motion.ts`.

Page order follows the supplied homepage reference: hero with stats, technology strip, services, about, process, work, commitments slideshow, call to action, insights, FAQ, contact and footer. Every in-page link is covered by a test that checks its target section exists.

## Images and motion

The page uses the nine existing 1K WebP images in `public/assets/` (creation metadata in `public/assets/provenance.json`). There are no placeholders and no videos. An attempt to generate extra images with Google Nano Banana 2 through Magnific failed because the connected Magnific account had no usable credit wallet; the layout does not depend on them.

Motion uses GSAP ScrollTrigger:

- Hero: staggered entrance, floating laptop, cycling words on the screen, background zoom and parallax on scroll, animated counters and a rotating scroll badge.
- About: words light up as you scroll, next to sticky stacked principle cards.
- Process: pinned on desktop; the timeline fills and steps activate as you scroll while the sphere rotates. On phones it becomes a vertical timeline.
- Work: a pinned horizontal slideshow on desktop with image parallax. On touch screens it is a swipeable rail.
- Commitments: an auto-advancing slideshow with arrows, dots, keyboard and swipe. It pauses on hover, focus or touch.
- Call to action: zoom reveal. Insights images zoom as they enter.
- Cards tilt and follow the cursor with a spotlight on hover. On touch they lift and glow when pressed.
- Buttons use flowing color-changing gradients (no shine sweep).

Pinned scenes only run on screens at least 900 px wide and 680 px tall. People who prefer reduced motion get a static layout.

Visual QA with motion enabled: `node scripts/scroll-qa.mjs 1440 900` (or any width and height) saves scene screenshots to `qa/scroll/`.

## Contact behavior

The contact form prepares an email to `info@webmatrixsolutions.com` in the visitor's email app. The visitor must review and send it there. Direct email and telephone links are also available. No submission service or customer database is involved.

The work gallery is explicitly identified as creative concepts. It does not claim those visuals are published client projects or attach unverified results to them.
