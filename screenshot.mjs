import { createRequire } from 'module';
import { readdir, mkdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const require = createRequire('file:///C:/Users/ccher/AppData/Local/Temp/puppeteer-test/package.json');
const puppeteer = require('puppeteer');

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

const screenshotsDir = join(__dirname, 'temporary screenshots');
await mkdir(screenshotsDir, { recursive: true });

const files = await readdir(screenshotsDir);
const nums = files
  .map(f => f.match(/^screenshot-(\d+)/))
  .filter(Boolean)
  .map(m => parseInt(m[1]));
const next = nums.length ? Math.max(...nums) + 1 : 1;

const filename = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
const outputPath = join(screenshotsDir, filename);

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0' });
await page.screenshot({ path: outputPath, fullPage: true });
await browser.close();

console.log(`Saved: ${outputPath}`);
