import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
const S = 'C:\\Users\\P02665\\AppData\\Local\\Temp\\ai-chat-shots';
mkdirSync(S, { recursive: true });

const b = await chromium.launch({ headless: true });

for (const [label, vw, vh] of [['desktop', 1440, 900], ['tablet', 768, 1024], ['mobile', 390, 844]]) {
  const p = await b.newPage();
  await p.setViewportSize({ width: vw, height: vh });
  await p.goto('http://localhost:4201', { waitUntil: 'networkidle' });

  // Open sidebar on smaller screens
  const openBtn = p.locator('button[aria-label="Open sidebar"]');
  if (await openBtn.isVisible()) { await openBtn.click(); await p.waitForTimeout(350); }

  await p.locator('.user-trigger').click();
  await p.waitForTimeout(450);
  await p.screenshot({ path: `${S}\\menu-fix-${label}.png` });

  // Measure
  const panel = await p.locator('.mat-mdc-menu-panel').first().boundingBox();
  const trigger = await p.locator('.user-trigger').boundingBox();
  console.log(`${label} — trigger w=${trigger?.width?.toFixed(0)} | panel w=${panel?.width?.toFixed(0)} x=${panel?.x?.toFixed(0)} y=${panel?.y?.toFixed(0)}`);
  await p.close();
}

await b.close();
console.log('done');
