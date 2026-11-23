/**
 * Rasterises the brand mark into the PNG icons browsers still need, and
 * renders the Open Graph share card. Uses the pre-installed Chromium via
 * Playwright, so the output uses the real self-hosted typefaces.
 *
 * Run: npm run icons
 */
import { launchChromium } from './chromium.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
import { site } from '../site.config.js';

const logoB64 = readFileSync('public/assets/images/logo/abce-logo.png').toString('base64');
const interB64 = readFileSync('public/assets/fonts/inter-latin-var.woff2').toString('base64');
const soraB64 = readFileSync('public/assets/fonts/sora-latin-var.woff2').toString('base64');

const heroB64 = readFileSync('public/assets/images/hero-industrial.jpg').toString('base64');

const FONTS = `
@font-face{font-family:'Inter';src:url(data:font/woff2;base64,${interB64}) format('woff2-variations');font-weight:400 700;}
@font-face{font-family:'Sora';src:url(data:font/woff2;base64,${soraB64}) format('woff2-variations');font-weight:400 700;}`;

const ICONS = [
  { file: 'public/favicon-32.png', size: 32 },
  { file: 'public/apple-touch-icon.png', size: 180, pad: true },
  { file: 'public/icon-512.png', size: 512, pad: true },
];

const browser = await launchChromium();
try {
  /* ---------------------------------------------------------- app icons */
  for (const { file, size, pad } of ICONS) {
    const page = await browser.newPage({
      viewport: { width: size, height: size },
      deviceScaleFactor: 1,
    });
    await page.setContent(
      `<!doctype html><meta charset="utf-8">
       <style>
         /* The supplied logo is letterboxed into a square on its own
            background colour. It is never cropped, stretched or recoloured. */
         html,body{margin:0;width:${size}px;height:${size}px;background:#ECF4F6}
         div{width:100%;height:100%;display:grid;place-items:center;padding:${pad ? Math.round(size * 0.04) : 0}px;box-sizing:border-box}
         img{max-width:100%;max-height:100%;display:block}
       </style>
       <div><img src="data:image/png;base64,${logoB64}" alt=""></div>`,
      { waitUntil: 'load' },
    );
    await page.screenshot({ path: file, type: 'png' });
    await page.close();
    console.log(`icon  ${file} (${size}x${size})`);
  }

  /* ------------------------------------------------- Open Graph card */
  const og = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await og.setContent(
    `<!doctype html><meta charset="utf-8">
     <style>
       ${FONTS}
       *{box-sizing:border-box;margin:0}
       body{width:1200px;height:630px;position:relative;overflow:hidden;
            background:#061527;font-family:'Inter',sans-serif;color:#fff}
       .shot{position:absolute;inset:0;background:url(data:image/jpeg;base64,${heroB64}) center/cover}
       .scrim{position:absolute;inset:0;background:
         linear-gradient(100deg,rgba(6,21,39,.97) 0%,rgba(6,21,39,.86) 52%,rgba(11,37,69,.6) 100%)}
       .grid{position:absolute;inset:0;opacity:.45;
         background-image:linear-gradient(to right,rgba(0,184,212,.18) 1px,transparent 1px),
                          linear-gradient(to bottom,rgba(0,184,212,.12) 1px,transparent 1px);
         background-size:84px 84px;
         -webkit-mask-image:radial-gradient(120% 90% at 16% 72%,#000 8%,transparent 70%)}
       .wrap{position:relative;height:100%;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between}
       .top{display:flex;align-items:center;gap:20px}
       .top img.logo{height:118px;width:auto;display:block;background:#ECF4F6;border-radius:4px}
       h1{font-family:'Sora',sans-serif;font-size:67px;font-weight:700;line-height:1.02;letter-spacing:-.032em;max-width:17ch}
       .rule{width:150px;height:3px;background:linear-gradient(to right,#00B8D4,rgba(0,184,212,0));margin:26px 0 22px}
       p{font-size:22px;line-height:1.45;color:rgba(255,255,255,.88);max-width:46ch}
       .foot{display:flex;align-items:center;gap:16px;font-size:17px;color:rgba(255,255,255,.72)}
       .dot{width:5px;height:5px;background:#00B8D4}
       .reg{position:absolute;top:56px;right:64px;width:30px;height:30px;
            border-top:3px solid #00B8D4;border-right:3px solid #00B8D4}
     </style>
     <div class="shot"></div><div class="scrim"></div><div class="grid"></div><div class="reg"></div>
     <div class="wrap">
       <div class="top">
         <img class="logo" src="data:image/png;base64,${logoB64}" alt="">
       </div>
       <div>
         <h1>Engineering Confidence. Delivering Excellence.</h1>
         <div class="rule"></div>
         <p>Procurement, industrial supply and integrated logistics for high-criticality industries.</p>
       </div>
       <div class="foot">
         <span>Energy</span><span class="dot"></span>
         <span>Oil &amp; Gas</span><span class="dot"></span>
         <span>Mining</span><span class="dot"></span>
         <span>Processing</span><span class="dot"></span>
         <span>Industrial</span><span class="dot"></span>
         <span>Construction</span>
       </div>
     </div>`,
    { waitUntil: 'load' },
  );
  await og.evaluate(() => document.fonts.ready);
  writeFileSync(
    'public/assets/images/og-default.jpg',
    await og.screenshot({ type: 'jpeg', quality: 88 }),
  );
  await og.close();
  console.log('og    public/assets/images/og-default.jpg (1200x630)');
  console.log(`\nShare card origin: ${site.url}/assets/images/og-default.jpg`);
} finally {
  await browser.close();
}
