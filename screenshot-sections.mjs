import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 1500));

// Scroll whole page to trigger animations
const totalHeight = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y <= totalHeight; y += 400) {
  await page.evaluate(s => window.scrollTo(0, s), y);
  await new Promise(r => setTimeout(r, 60));
}
await new Promise(r => setTimeout(r, 500));

// Screenshot Principles section
const prinBox = await page.evaluate(() => {
  const el = document.querySelector('#principles');
  const r = el.getBoundingClientRect();
  return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height };
});
await page.evaluate(s => window.scrollTo(0, s), prinBox.y - 40);
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: path.join(dir, 'principles-icons.png'), clip: { x: 0, y: prinBox.y - 40, width: 1440, height: Math.min(prinBox.height + 80, 1000) } });

// Screenshot Vertical Integration section
const diffBox = await page.evaluate(() => {
  const el = document.querySelector('.diff-grid');
  const r = el.getBoundingClientRect();
  return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height };
});
await page.evaluate(s => window.scrollTo(0, s), diffBox.y - 60);
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: path.join(dir, 'vert-integration.png'), clip: { x: 0, y: diffBox.y - 60, width: 1440, height: diffBox.height + 120 } });

await browser.close();
console.log('Screenshots saved.');
