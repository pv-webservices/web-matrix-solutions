# Nexora — digital agency website

React + TypeScript + Vite implementation of the supplied dark agency reference. All sections are included, with the six requested services in a responsive three-column/two-row grid. GSAP and ScrollTrigger provide restrained entrances, parallax and timeline motion; reduced-motion uses the fully visible static layout.

## Run

```sh
npm install
npm run dev
npm run build
npm run preview
```

## Verify

With the development server running on port 5173:

```sh
npm test
node scripts/visual-qa.mjs
```

The browser tests cover services, project dialogs, focus restoration, FAQ, testimonial controls and swipe, mobile navigation, draft download, email preferences, journal and sitemap. The visual QA script captures the requested seven viewport widths plus 320px, verifies image loading, and writes a side-by-side reference comparison in `qa/`.

## Assets

Nine separate raster assets were generated through Magnific MCP using GPT 2, 1K, high quality. They are served locally as optimized WebP files (about 402 KB total). No video is used. Model and creation provenance is recorded in `public/assets/provenance.json`. Inter variable Latin is self-hosted; its OFL license is included in `public/fonts/`.

## Before public launch

The reference brand name, metrics, projects and testimonials are retained as illustrative reference content. Replace or verify them before public publication. The website uses Nexora to match the supplied reference, despite the workspace folder name.

No business contact address, social profiles, booking URL or submission backend was supplied. Contact controls open a validated form that saves a local project draft and supports downloading it. The email field saves a local preference. Both explicitly state that nothing was submitted. Connect those flows to approved endpoints, add verified social and booking links, and replace the preview legal text before public launch.

Deploy the `dist/` directory to a static host after running `npm run build`. Nothing has been deployed by this implementation.

## Visual refinements

The technology strip uses locally hosted monochrome SVG logos from Simple Icons, with a seamless marquee and pause/resume control. Reduced-motion keeps the list static and horizontally scrollable. Desktop section padding is 80px (65px tablet, 55px mobile); the hero heading uses staggered letter reveals and a single gradient sweep.
