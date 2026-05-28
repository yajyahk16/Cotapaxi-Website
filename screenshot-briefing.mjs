import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox','--disable-gpu'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));

const section = await page.$('#process');
await page.evaluate(e => e.scrollIntoView(), section);
await new Promise(r => setTimeout(r, 600));

const panels = await page.$$('.proc-panel');
await panels[0].click();
await new Promise(r => setTimeout(r, 700));
await page.screenshot({ path: 'temporary screenshots/briefing-check.png' });

await browser.close();
console.log('done');
