// Motion-enabled visual QA: scrolls through the page like a visitor and captures
// each scene (including mid-pin states). Usage: node scripts/scroll-qa.mjs [width] [height]
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
await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
await page.waitForTimeout(2600);

const glide = target => page.evaluate(async y => {
  const step = 260;
  let current = window.scrollY;
  while (Math.abs(current - y) > step) {
    current += current < y ? step : -step;
    window.scrollTo(0, current);
    await new Promise(resolve => setTimeout(resolve, 40));
  }
  window.scrollTo(0, y);
}, target);

const top = selector => page.evaluate(sel => {
  const element = document.querySelector(sel);
  if (!element) return null;
  const spacer = element.closest('.pin-spacer') ?? element;
  return spacer.getBoundingClientRect().top + window.scrollY;
}, selector);

const shots = [
  ['01-hero', '#home', 0],
  ['02-services', '#services', 0],
  ['03-about', '#about', 0.25],
  ['04-about-stack', '#about', 0.6],
  ['05-process', '#process', 0],
  ['06-process-mid', '#process', 0.55],
  ['07-work', '#work', 0],
  ['08-work-mid', '#work', 0.5],
  ['09-work-end', '#work', 0.92],
  ['10-commitments', '.commitments-section', 0],
  ['11-cta', '.cta-section', -0.1],
  ['12-insights', '#insights', 0],
  ['13-faq', '#faq', 0],
  ['14-contact', '#contact', 0],
  ['15-footer', '.footer', 0],
];

for (const [name, selector, fraction] of shots) {
  const start = await top(selector);
  if (start === null) { errors.push(`missing ${selector}`); continue; }
  const span = await page.evaluate(sel => {
    const element = document.querySelector(sel);
    const spacer = element?.closest('.pin-spacer') ?? element;
    return spacer ? spacer.getBoundingClientRect().height : 0;
  }, selector);
  await glide(Math.max(0, Math.round(start + span * fraction)));
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `qa/scroll/${width}-${name}.png` });
}

const report = await page.evaluate(() => ({
  overflow: document.documentElement.scrollWidth - window.innerWidth,
  hiddenReveals: [...document.querySelectorAll('.reveal')].filter(el => Number(getComputedStyle(el).opacity) < 0.99).length,
  brokenImages: [...document.images].filter(img => img.complete && !img.naturalWidth).map(img => img.src),
  counters: [...document.querySelectorAll('.count')].map(el => el.textContent),
}));
console.log(JSON.stringify({ width, ...report, errors }, null, 2));
await browser.close();
