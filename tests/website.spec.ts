import { test, expect } from '@playwright/test';

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

test('hero actions and navigation redirect to the right sections', async ({ page }) => {
  await page.goto('/');
  await page.locator('.hero').getByRole('link', { name: 'Start a project' }).click();
  await expect(page).toHaveURL(/#contact$/);
  await page.goto('/');
  await page.locator('.hero').getByRole('link', { name: 'Explore our work' }).click();
  await expect(page).toHaveURL(/#work$/);
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Process' }).click();
  await expect(page).toHaveURL(/#process$/);
  await expect(page.locator('#process h2')).toBeInViewport();
});

test('service details open and lead to contact', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.service-card')).toHaveCount(6);
  await page.getByRole('button', { name: 'Learn more about Website Development' }).click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'Website Development' })).toBeVisible();
  await page.getByRole('dialog').getByRole('link', { name: 'Talk about this service' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page).toHaveURL(/#contact$/);
});

test('work concepts, commitments slideshow, insights and FAQ work', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('button.work-card')).toHaveCount(4);
  await page.getByRole('button', { name: 'Explore The editorial launch concept' }).click();
  await expect(page.getByRole('dialog').getByText('illustrative concept')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();

  const rail = page.getByRole('region', { name: 'Our commitments' });
  await page.getByRole('button', { name: 'Next commitment' }).click();
  await expect.poll(() => rail.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Show Clarity at every checkpoint' }).click();
  await expect(page.getByRole('button', { name: 'Show Clarity at every checkpoint' })).toHaveAttribute('aria-pressed', 'true');

  await page.getByRole('button', { name: /Make your website easier to choose/ }).click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'Make your website easier to choose' })).toBeVisible();
  await page.keyboard.press('Escape');

  const question = page.getByRole('button', { name: /How does a project begin/ });
  await question.click();
  await expect(question).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText('We begin with a conversation about your goals')).toBeVisible();
});

test('contact form prepares a real email and direct contact links work', async ({ page }) => {
  await page.goto('/');
  const form = page.locator('.contact-form');
  await form.getByLabel('Your name').fill('Example Person');
  await form.getByLabel('Email address').fill('example@example.com');
  await form.getByLabel('What can we help with?').selectOption('Shopify Development');
  await form.getByLabel('Tell us about the project').fill('We need a new storefront.');
  await form.getByRole('button', { name: 'Prepare email' }).click();
  await expect(form.getByRole('status')).toContainText('Your email app should open');
  await expect(form.getByRole('link', { name: 'Open the prepared email again' })).toHaveAttribute('href', /mailto:info@webmatrixsolutions\.com\?subject=Project%20enquiry%3A%20Shopify%20Development/);
  await expect(page.getByRole('link', { name: 'info@webmatrixsolutions.com' }).first()).toHaveAttribute('href', 'mailto:info@webmatrixsolutions.com');
  await expect(page.getByRole('link', { name: '+91 89208 47457' }).first()).toHaveAttribute('href', 'tel:+918920847457');
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
  await expect(page).toHaveURL(/#services$/);
  await toggle.click();
  await page.keyboard.press('Escape');
  await expect(menu).not.toBeVisible();
});

for (const width of [320, 375, 390, 430, 768, 1024, 1440]) {
  test(`page fits ${width}px and every image loads`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await expect(page.locator('.hero h1')).toBeVisible();
    for (const id of ['#services', '#about', '#process', '#work', '#insights', '#faq', '#contact']) {
      await expect(page.locator(`${id} h2`).first()).toBeVisible();
    }
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(resolve => setTimeout(resolve, 30)); }
      for (const rail of document.querySelectorAll<HTMLElement>('.work-rail, .commitment-rail')) {
        rail.scrollIntoView();
        for (let x = 0; x <= rail.scrollWidth; x += 250) { rail.scrollLeft = x; await new Promise(resolve => setTimeout(resolve, 30)); }
      }
    });
    await page.waitForFunction(() => [...document.images].every(img => img.complete));
    expect(await page.evaluate(() => [...document.images].filter(img => !img.naturalWidth).length)).toBe(0);
  });
}
