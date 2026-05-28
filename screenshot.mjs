import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, 'temporary screenshots');

if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] ? `-${process.argv[3]}` : '';

// Auto-increment filename
let n = 1;
while (fs.existsSync(path.join(screenshotDir, `screenshot-${n}${label}.png`))) n++;
const outPath = path.join(screenshotDir, `screenshot-${n}${label}.png`);

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1000));

// Scroll through entire page to trigger all IntersectionObserver reveal animations
const totalHeight = await page.evaluate(() => document.body.scrollHeight);
const step = 400;
for (let y = 0; y <= totalHeight; y += step) {
  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
  await new Promise(r => setTimeout(r, 80));
}
// Scroll back to top
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise(r => setTimeout(r, 800));

await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Screenshot saved: ${outPath}`);
