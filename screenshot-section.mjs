import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });
const outPath = path.join(screenshotDir, 'screenshot-glow-section.png');

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox','--disable-gpu'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));
await page.evaluate(() => { const el = document.querySelector('.glow-sec'); if (el) el.scrollIntoView({ behavior: 'instant' }); });
await new Promise(r => setTimeout(r, 2500));
const el = await page.$('.glow-sec');
if (el) { await el.screenshot({ path: outPath }); console.log('Saved: ' + outPath); }
await browser.close();
