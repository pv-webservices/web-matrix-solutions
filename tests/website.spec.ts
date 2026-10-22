import { test, expect } from '@playwright/test';

const SERVICES = ['Website Development & Management', 'Social Media Management', 'Content Creation', 'Google My Business Management'];

test('every in-page link points to a real section', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Web Matrix Solutions/);
  const hrefs = await page.locator('a[href^="#"]').evaluateAll(links => [...new Set(links.map(link => link.getAttribute('href')))]);
  expect(hrefs.length).toBeGreaterThan(5);
  for (const href of hrefs) {
    expect(href).toMatch(/^#[a-z]+$/);
    await expect(page.locator(href!), `${href} target`).toHaveCount(1);
  }
});

test('shows exactly the four services and no prices', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.service-card h3');
  await expect(cards).toHaveText(SERVICES);
  const text = await page.locator('body').innerText();
  expect(text).not.toMatch(/₹|\$\s?\d|\bINR\b|per month|\/mo\b|pricing/i);
  for (const service of SERVICES) {
    await expect(page.getByRole('combobox', { name: 'What can we help with?' }).locator('option', { hasText: service })).toHaveCount(1);
  }
});

test('hero and navigation lead to the right sections', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText("Brands people can't scroll past.");
  await page.locator('.hero').getByRole('link', { name: 'Start your project' }).click();
  await expect(page.locator('#contact h2')).toBeInViewport();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Process' }).click();
  await expect(page.locator('#process h2')).toBeInViewport();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'FAQ' }).click();
  await expect(page.locator('#faq h2')).toBeInViewport();
});

test('FAQ opens one answer at a time', async ({ page }) => {
  await page.goto('/');
  const first = page.getByRole('button', { name: /How do I get started/ });
  const second = page.getByRole('button', { name: /manage just one service/ });
  await expect(first).toHaveAttribute('aria-expanded', 'true');
  await second.click();
  await expect(second).toHaveAttribute('aria-expanded', 'true');
  await expect(first).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByText('You can start with one service')).toBeVisible();
});

test('contact form prepares an email and the email link works', async ({ page }) => {
  await page.goto('/');
  const form = page.locator('.contact-form');
  await form.getByLabel('Your name').fill('Example Person');
  await form.getByLabel('Email address').fill('example@example.com');
  await form.getByLabel('What can we help with?').selectOption('Google My Business Management');
  await form.getByLabel('Tell us about your business').fill('We want more calls from Google.');
  await form.getByRole('button', { name: 'Prepare email' }).click();
  await expect(form.getByRole('status')).toContainText('Your email app should now be open');
  await expect(form.getByRole('link', { name: 'Open the prepared email again' })).toHaveAttribute('href', /mailto:info@webmatrixsolutions\.com\?subject=Project%20enquiry%3A%20Google%20My%20Business%20Management/);
  await expect(page.getByRole('link', { name: /info@webmatrixsolutions\.com/ }).first()).toHaveAttribute('href', 'mailto:info@webmatrixsolutions.com');
});

test('mobile menu links and escape work', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Open navigation' });
  await toggle.click();
  const menu = page.getByRole('navigation', { name: 'Mobile navigation' });
  await expect(menu).toBeVisible();
  await menu.getByRole('link', { name: 'Services' }).click();
  await expect(menu).not.toBeVisible();
  await expect(page.locator('#services h2')).toBeInViewport();
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.keyboard.press('Escape');
  await expect(menu).not.toBeVisible();
});

test.describe('with motion', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('preloader clears, WebGL scenes render and the globe reaches its outro', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/is-loaded/, { timeout: 6000 });
    await expect(page.locator('.hero-canvas')).not.toHaveClass(/is-fallback/);
    await expect(page.locator('#work')).not.toHaveClass(/is-fallback/);
    await page.evaluate(async () => {
      const work = document.querySelector<HTMLElement>('#work')!;
      const end = work.offsetTop + work.offsetHeight - window.innerHeight;
      for (let y = window.scrollY; y < end; y += 300) { window.scrollTo(0, y); await new Promise(resolve => setTimeout(resolve, 25)); }
      window.scrollTo(0, end);
    });
    await expect(page.locator('#work')).toHaveClass(/is-outro/);
    await expect(page.locator('.works-outro').getByRole('link', { name: 'Start your project' })).toBeVisible();
    expect(errors).toEqual([]);
  });
});

for (const width of [320, 375, 390, 430, 768, 1024, 1440]) {
  test(`page fits ${width}px and every image loads`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await expect(page.locator('.hero h1')).toBeVisible();
    for (const id of ['#services', '#approach', '#process', '#faq', '#contact']) {
      await expect(page.locator(`${id} h2`).first()).toBeVisible();
    }
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(resolve => setTimeout(resolve, 30)); }
    });
    await page.waitForFunction(() => [...document.images].every(img => img.complete));
    const broken = await page.evaluate(() => [...document.images].filter(img => !img.naturalWidth).map(img => img.src));
    expect(broken).toEqual([]);
  });
}
