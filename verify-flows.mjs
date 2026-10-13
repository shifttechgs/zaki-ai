import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

const BASE = 'http://localhost:4200';
const SS = 'verify-screenshots';
await mkdir(SS, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.setDefaultTimeout(10000);

let passed = 0, failed = 0;
const results = [];

async function step(label, fn) {
  try {
    await fn();
    console.log(`  ✅  ${label}`);
    results.push({ ok: true, label });
    passed++;
  } catch (e) {
    console.log(`  ❌  ${label}`);
    console.log(`       ${e.message.split('\n')[0]}`);
    results.push({ ok: false, label, err: e.message.split('\n')[0] });
    failed++;
  }
}

// ── Helper: clear localStorage so each flow starts fresh ──────────────────
async function clearAuth() {
  await page.evaluate(() => localStorage.removeItem('zaki_user'));
}

// ══════════════════════════════════════════════════════════════════════════
// 1. Sign-in page loads with demo box visible
// ══════════════════════════════════════════════════════════════════════════
console.log('\n[1] Sign-in page loads with demo credentials box');
await page.goto(`${BASE}/auth/sign-in`);
await step('Page title visible', async () => {
  await page.waitForSelector('h1', { timeout: 8000 });
  const title = await page.textContent('h1');
  if (!title.includes('Sign in')) throw new Error(`Got: "${title}"`);
});
await step('Demo box visible', async () => {
  await page.waitForSelector('.demo-box', { timeout: 5000 });
});
await step('Student credential visible', async () => {
  const text = await page.textContent('.demo-box');
  if (!text.includes('student@demo.com')) throw new Error('student cred missing');
});
await step('Parent credential visible', async () => {
  const text = await page.textContent('.demo-box');
  if (!text.includes('parent@demo.com')) throw new Error('parent cred missing');
});
await page.screenshot({ path: `${SS}/1-sign-in-page.png` });

// ══════════════════════════════════════════════════════════════════════════
// 2. Student login → /dashboard/student
// ══════════════════════════════════════════════════════════════════════════
console.log('\n[2] Student sign-in → student dashboard');
await clearAuth();
await page.goto(`${BASE}/auth/sign-in`);
await step('Fill email', async () => {
  await page.fill('input[type="email"]', 'student@demo.com');
});
await step('Fill password', async () => {
  await page.fill('input[type="password"]', 'demo123');
});
await step('Submit and redirect to /dashboard/student', async () => {
  await page.click('button[type="submit"]');
  await page.waitForURL(`${BASE}/dashboard/student`, { timeout: 8000 });
});
await step('Student dashboard heading visible', async () => {
  const h1 = await page.textContent('h1');
  if (!h1.toLowerCase().includes('alex') && !h1.toLowerCase().includes('morning') && !h1.toLowerCase().includes('student'))
    throw new Error(`Got: "${h1}"`);
});
await step('Sidebar shows student nav items', async () => {
  const nav = await page.textContent('.nav, .sidebar-nav, aside nav, [class*="nav"]');
  if (!nav.includes('Dashboard') && !nav.includes('Classes') && !nav.includes('Assignments'))
    throw new Error('Student nav items not found');
});
await page.screenshot({ path: `${SS}/2-student-dashboard.png` });

// ══════════════════════════════════════════════════════════════════════════
// 3. Parent login → /dashboard/parent
// ══════════════════════════════════════════════════════════════════════════
console.log('\n[3] Parent sign-in → parent dashboard');
await clearAuth();
await page.goto(`${BASE}/auth/sign-in`);
await step('Fill parent email', async () => {
  await page.fill('input[type="email"]', 'parent@demo.com');
});
await step('Fill parent password', async () => {
  await page.fill('input[type="password"]', 'demo123');
});
await step('Submit and redirect to /dashboard/parent', async () => {
  await page.click('button[type="submit"]');
  await page.waitForURL(`${BASE}/dashboard/parent`, { timeout: 8000 });
});
await step('Parent dashboard heading visible', async () => {
  const h1 = await page.textContent('h1');
  if (!h1.toLowerCase().includes('parent') && !h1.toLowerCase().includes('overview') && !h1.toLowerCase().includes('sarah'))
    throw new Error(`Got: "${h1}"`);
});
await step('Sidebar shows parent nav items', async () => {
  const nav = await page.textContent('.nav, .sidebar-nav, aside nav, [class*="nav"]');
  if (!nav.includes('Overview') && !nav.includes('Children') && !nav.includes('Attendance'))
    throw new Error('Parent nav items not found');
});
await page.screenshot({ path: `${SS}/3-parent-dashboard.png` });

// ══════════════════════════════════════════════════════════════════════════
// 4. Unauthenticated → /dashboard/student redirects to sign-in
// ══════════════════════════════════════════════════════════════════════════
console.log('\n[4] Unauthenticated access to /dashboard/student → redirect to sign-in');
await clearAuth();
await page.goto(`${BASE}/dashboard/student`);
await step('Redirected to /auth/sign-in', async () => {
  await page.waitForURL(`${BASE}/auth/sign-in`, { timeout: 8000 });
});
await step('Sign-in form is present', async () => {
  await page.waitForSelector('input[type="email"]', { timeout: 5000 });
});
await page.screenshot({ path: `${SS}/4-guard-redirect.png` });

// ══════════════════════════════════════════════════════════════════════════
// 5. Logout → /ai-chat
// ══════════════════════════════════════════════════════════════════════════
console.log('\n[5] Logout → /ai-chat');
// Log back in as student first
await page.goto(`${BASE}/auth/sign-in`);
await page.fill('input[type="email"]', 'student@demo.com');
await page.fill('input[type="password"]', 'demo123');
await page.click('button[type="submit"]');
await page.waitForURL(`${BASE}/dashboard/student`, { timeout: 8000 });

await step('Logout button is visible in sidebar', async () => {
  const btn = await page.$('[aria-label="Log out"], .logout-btn, button[aria-label*="logout"], button[aria-label*="Log"]');
  if (!btn) throw new Error('Logout button not found');
});
await step('Click logout and land on /ai-chat', async () => {
  const btn = await page.$('[aria-label="Log out"], .logout-btn');
  await btn.click();
  await page.waitForURL(`${BASE}/ai-chat`, { timeout: 8000 });
});
await step('localStorage cleared after logout', async () => {
  const stored = await page.evaluate(() => localStorage.getItem('zaki_user'));
  if (stored !== null) throw new Error('zaki_user still in localStorage');
});
await page.screenshot({ path: `${SS}/5-after-logout.png` });

// ══════════════════════════════════════════════════════════════════════════
// Summary
// ══════════════════════════════════════════════════════════════════════════
await browser.close();
console.log(`\n${'─'.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.log('\nFailed steps:');
  results.filter(r => !r.ok).forEach(r => console.log(`  ❌ ${r.label}: ${r.err}`));
}
console.log(`Screenshots saved to ./${SS}/`);
process.exit(failed > 0 ? 1 : 0);
