import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));

await page.screenshot({ path: path.join(screenshotDir, 'hero-viewport.png'), clip: { x: 0, y: 0, width: 1440, height: 900 } });
await browser.close();
console.log('Hero viewport screenshot saved.');
