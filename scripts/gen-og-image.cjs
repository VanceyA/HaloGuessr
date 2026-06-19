const { chromium } = require('playwright');
const path = require('path');

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      background: #050807;
      font-family: 'Chakra Petch', sans-serif;
      color: #d4e7da;
      position: relative;
    }
    body::before {
      content: "";
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(0deg, rgba(0,0,0,0) 0 2px, rgba(0,0,0,0.14) 3px, rgba(0,0,0,0) 4px);
      z-index: 10;
      pointer-events: none;
    }
    .ring {
      position: absolute;
      left: 50%;
      bottom: -2160px;
      width: 2800px;
      height: 2800px;
      transform: translateX(-50%);
      border-radius: 50%;
      border-top: 2px solid rgba(79,224,138,0.72);
      box-shadow: 0 -2px 80px rgba(79,224,138,0.28), inset 0 8px 140px rgba(79,224,138,0.06);
    }
    .glow {
      position: absolute;
      left: 50%;
      top: -80px;
      width: 1000px;
      height: 500px;
      transform: translateX(-50%);
      background: radial-gradient(60% 60% at 50% 50%, rgba(79,224,138,0.13), transparent 70%);
      pointer-events: none;
    }
    .content {
      position: relative;
      z-index: 2;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 90px;
    }
    .tag {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #4fe08a;
      border: 1px solid rgba(106,224,154,0.34);
      padding: 8px 16px;
      margin-bottom: 28px;
      background: rgba(5,8,7,0.5);
      width: fit-content;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4fe08a;
      box-shadow: 0 0 10px #4fe08a;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 20px;
    }
    .logo-type {
      font-size: 80px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #d4e7da;
      line-height: 1;
    }
    .logo-type b { color: #4fe08a; }
    .tagline {
      font-size: 26px;
      font-weight: 400;
      color: #6f8a7a;
      letter-spacing: 0.5px;
      line-height: 1.45;
    }
    .tagline em {
      font-style: normal;
      color: #4fe08a;
      text-shadow: 0 0 28px rgba(79,224,138,0.4);
    }
    .stats {
      display: flex;
      align-items: center;
      gap: 36px;
      margin-top: 44px;
    }
    .stat { font-family: 'JetBrains Mono', monospace; }
    .stat-val {
      font-size: 38px;
      font-weight: 700;
      color: #6dffa4;
      line-height: 1;
      letter-spacing: 1px;
    }
    .stat-label {
      font-size: 11px;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: #46594e;
      margin-top: 5px;
    }
    .divider {
      width: 1px;
      height: 52px;
      background: rgba(106,224,154,0.2);
    }
    .corner {
      position: absolute;
      width: 26px;
      height: 26px;
      border: 2px solid #4fe08a;
      opacity: 0.85;
    }
    .corner-tl { top: 22px; left: 22px; border-right: none; border-bottom: none; }
    .corner-tr { top: 22px; right: 22px; border-left: none; border-bottom: none; }
    .corner-bl { bottom: 22px; left: 22px; border-right: none; border-top: none; }
    .corner-br { bottom: 22px; right: 22px; border-left: none; border-top: none; }
    .bottom-line {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent 0%, rgba(79,224,138,0.8) 30%, rgba(79,224,138,1) 50%, rgba(79,224,138,0.8) 70%, transparent 100%);
    }
  </style>
</head>
<body>
  <div class="glow"></div>
  <div class="ring"></div>
  <div class="corner corner-tl"></div>
  <div class="corner corner-tr"></div>
  <div class="corner corner-bl"></div>
  <div class="corner corner-br"></div>
  <div class="bottom-line"></div>
  <div class="content">
    <div class="tag"><div class="dot"></div>Fan-Made &middot; Free to Play</div>
    <div class="brand">
      <svg width="58" height="65" viewBox="0 0 36 40" fill="none">
        <path d="M18 1.5 34.5 8.5v12.5C34.5 31 27.2 37 18 38.5 8.8 37 1.5 31 1.5 21V8.5L18 1.5Z" stroke="#4fe08a" stroke-width="1.6" fill="rgba(79,224,138,0.06)"/>
        <circle cx="18" cy="20" r="8" stroke="#6dffa4" stroke-width="1.6" fill="none"/>
        <circle cx="18" cy="20" r="2.4" fill="#6dffa4"/>
      </svg>
      <div class="logo-type"><b>HALO</b>GUESSR</div>
    </div>
    <div class="tagline">One frame from <em>Halo</em>. Pin the spot.</div>
    <div class="stats">
      <div class="stat">
        <div class="stat-val">3</div>
        <div class="stat-label">Campaigns</div>
      </div>
      <div class="divider"></div>
      <div class="stat">
        <div class="stat-val">240</div>
        <div class="stat-label">Drop Zones</div>
      </div>
      <div class="divider"></div>
      <div class="stat">
        <div class="stat-val">CE &middot; 2 &middot; 3</div>
        <div class="stat-label">Games Available</div>
      </div>
    </div>
  </div>
</body>
</html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(html, { waitUntil: 'networkidle' });
  // Wait for fonts to paint
  await page.waitForTimeout(800);
  const out = path.join(__dirname, '../public/og-image.png');
  await page.screenshot({ path: out, type: 'png' });
  await browser.close();
  console.log('OG image saved to', out);
})();
