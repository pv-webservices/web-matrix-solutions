// Motion-enabled visual QA: scrolls through the page like a visitor and captures each
// scene, including points inside the pinned sections. Needs `npm run dev` running.
// Usage: node scripts/scroll-qa.mjs [width] [height]
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';

const width = Number(process.argv[2] ?? 1440);
const height = Number(process.argv[3] ?? 900);
const mobile = width < 768;
await fs.mkdir('qa/scroll', { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'no-preference', hasTouch: mobile, isMobile: mobile });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3200);

const glide = target => page.evaluate(async y => {
  const step = 240;
  let current = window.scrollY;
  while (Math.abs(current - y) > step) {
    current += current < y ? step : -step;
    window.scrollTo(0, current);
    await new Promise(resolve => setTimeout(resolve, 30));
  }
  window.scrollTo(0, y);
}, target);

/** Scroll position at `fraction` of the way through a section (0 = its top at the viewport top). */
const at = (selector, fraction) => page.evaluate(([sel, f]) => {
  const element = document.querySelector(sel);
  const top = element.getBoundingClientRect().top + window.scrollY;
  return top + Math.max(0, element.offsetHeight - window.innerHeight) * f;
}, [selector, fraction]);

const shots = [
  ['01-hero', '.hero', 0], ['02-showcase-start', '.showcase', 0.05], ['03-showcase-end', '.showcase', 0.9],
  ['04-statement', '.statement', 0.35], ['05-services', '#services', 0.0], ['06-services-stack', '.services-stack', 0.55],
  ['07-marquee', '.marquee', 0], ['08-works-in', '#work', 0.08], ['09-works-mid', '#work', 0.45], ['10-works-end', '#work', 0.97],
  ['11-approach', '#approach', 0.1], ['12-method', '#process', 0.1], ['13-method-late', '#process', 0.8],
  ['14-why', '.promise', 0.3], ['15-why-late', '.promise', 0.7], ['16-faq', '#faq', 0], ['17-cta', '.cta', 0.3],
  ['18-contact', '#contact', 0], ['19-footer', '.footer', 1],
];

for (const [name, selector, fraction] of shots) {
  await glide(await at(selector, fraction));
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `qa/scroll/${width}-${name}.jpg`, type: 'jpeg', quality: 60, timeout: 90000 });
}

const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
console.log(JSON.stringify({ width, height, overflow, errors }, null, 2));
await browser.close();
