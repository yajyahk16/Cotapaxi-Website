import puppeteer from 'puppeteer';
import fs from 'fs';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox','--disable-gpu'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));

const section = await page.$('#process');
await page.evaluate(e => e.scrollIntoView(), section);
await new Promise(r => setTimeout(r, 800));

const panels = await page.$$('.proc-panel');
for (let i = 0; i < panels.length; i++) {
  await panels[i].click();
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: `temporary screenshots/panel-${i+1}.png` });
}

await browser.close();
console.log('done');
