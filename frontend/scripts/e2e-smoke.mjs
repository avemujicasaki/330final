/**
 * Browser smoke test — run with backend + `npm run dev` already up.
 * Usage: node scripts/e2e-smoke.mjs
 */
import { chromium } from 'playwright';

const BASE = process.env.E2E_BASE || 'http://127.0.0.1:5173';
const email = process.env.E2E_EMAIL || `e2e_${Date.now()}@university.edu`;
const password = 'demo1';

const results = [];

async function step(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
    console.log(`PASS: ${name}`);
  } catch (err) {
    results.push({ name, ok: false, error: err.message });
    console.error(`FAIL: ${name} — ${err.message}`);
    throw err;
  }
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 800 });
const consoleErrors = [];
page.on('pageerror', (e) => consoleErrors.push(e.message));
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});

try {
  await step('Home page loads', async () => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: /One meal decision/i }).waitFor({ timeout: 8000 });
  });

  await step('Plans load from API', async () => {
    await page.getByRole('button', { name: /Find My Weekly Plan/i }).click();
    await page.waitForURL('**/plans');
    await page.getByText(/fresh meal plans today/i).waitFor();
    await page.getByText(/Could not load plans/).count().then((n) => {
      if (n > 0) throw new Error('Plans API failed on UI');
    });
    await page.locator('.meal-card.clickable').first().waitFor({ timeout: 10000 });
    const count = await page.locator('.meal-card.clickable').count();
    if (count < 3) throw new Error(`Expected 3 plans, saw ${count}`);
  });

  await step('Cook detail loads from API', async () => {
    await page.locator('.meal-card.clickable').first().click();
    await page.waitForURL('**/cook/**');
    await page.getByRole('heading', { level: 2, name: /Menu for the Week/i }).waitFor({ timeout: 10000 });
    await page.getByRole('button', { name: /Order/i }).first().waitFor();
  });

  await step('Add meal to cart (localStorage)', async () => {
    await page.getByRole('button', { name: /Order/i }).first().click();
    await page.getByRole('button', { name: /Add to Cart/i }).click();
    await page.getByRole('button', { name: /Cart/i }).click();
    await page.waitForURL('**/cart');
    await page.getByText(/Checkout/i).waitFor();
  });

  await step('Sign up via API', async () => {
    await page.goto(`${BASE}/login`);
    await page.waitForURL('**/login');
    await page.getByRole('button', { name: /Sign up/i }).click();
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill(password);
    await page.getByLabel(/Full name/i).fill('E2E User');
    await page.getByRole('button', { name: /^Sign up$/i }).click();
    await page.waitForURL(/\/(cart|plans|confirm)/, { timeout: 15000 });
  });

  await step('Meal checkout via API', async () => {
    await page.goto(`${BASE}/cart`);
    await page.getByRole('button', { name: /Checkout/i }).click();
    await page.waitForURL('**/cart/checkout');
    await page.locator('input[placeholder*="4242"]').fill('4242424242424242');
    await page.locator('input[placeholder="MM/YY"]').fill('12/28');
    await page.locator('input[placeholder="123"]').fill('123');
    await page.getByRole('button', { name: /Confirm & Pay/i }).click();
    await page.waitForURL('**/order-success/**', { timeout: 15000 });
    await page.getByRole('heading', { name: /Order confirmed/i }).waitFor({ timeout: 8000 });
  });

  await step('Weekly subscription via API', async () => {
    await page.getByRole('button', { name: /Find a Plan/i }).click();
    await page.waitForURL('**/plans');
    await page.locator('.meal-card.clickable').first().click();
    await page.getByRole('button', { name: /Reserve Weekly Plan/i }).click();
    await page.waitForURL('**/confirm');
    await page.locator('input[placeholder*="4242"]').fill('4242424242424242');
    await page.locator('input[placeholder="MM/YY"]').fill('12/28');
    await page.locator('input[placeholder="123"]').fill('123');
    await page.getByRole('button', { name: /Confirm Weekly Plan/i }).click();
    await page.waitForURL('**/success/**', { timeout: 15000 });
    await page.getByRole('heading', { name: /all set/i }).waitFor({ timeout: 8000 });
  });

  await step('My Orders shows subscription', async () => {
    await page.getByRole('button', { name: /My Orders/i }).click();
    await page.waitForURL('**/subscriptions');
    await page.getByText(/Weekly subscriptions/i).waitFor();
    await page.getByRole('button', { name: /Skip Next Week/i }).first().waitFor({ timeout: 8000 });
    await page.getByRole('button', { name: /Skip Next Week/i }).first().click();
    await page.getByText(/skipped/i).waitFor({ timeout: 8000 }).catch(async () => {
      await page.getByText(/Past subscriptions/i).waitFor({ timeout: 5000 });
    });
  });

  await step('Become a cook application', async () => {
    await page.getByRole('button', { name: /Become a Cook/i }).click();
    await page.waitForURL('**/become-cook');
    await page.locator('.auth-form input').nth(0).fill('E2E Cook');
    await page.locator('input[type="email"]').fill(`cook_${Date.now()}@university.edu`);
    await page.locator('.auth-form input').nth(2).fill('Thai comfort food');
    await page.locator('.auth-form input').nth(3).fill('Library Plaza');
    await page.getByRole('button', { name: /Submit Application/i }).click();
    await page.getByText(/Application submitted/i).waitFor({ timeout: 10000 });
  });

  if (consoleErrors.length) {
    console.warn('Browser console errors:', consoleErrors.slice(0, 5));
  }

  console.log('\n--- All UI smoke tests passed ---');
  console.log(`Test account: ${email} / ${password}`);
} catch (err) {
  console.error('\n--- UI smoke test failed ---');
  process.exitCode = 1;
} finally {
  await browser.close();
}
