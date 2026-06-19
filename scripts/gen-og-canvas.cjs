const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const W = 1200, H = 630;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// ── helpers ──────────────────────────────────────────────────────────────────

function hex(h, a = 1) {
  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// ── background ───────────────────────────────────────────────────────────────

ctx.fillStyle = '#050807';
ctx.fillRect(0, 0, W, H);

// ── green radial glow at top ──────────────────────────────────────────────────

const glow = ctx.createRadialGradient(W / 2, -60, 0, W / 2, -60, 540);
glow.addColorStop(0, 'rgba(79,224,138,0.14)');
glow.addColorStop(1, 'rgba(79,224,138,0)');
ctx.fillStyle = glow;
ctx.fillRect(0, 0, W, H);

// ── ringworld arc (large circle, most of it below the frame) ─────────────────

const ringCX = W / 2;
const ringCY = H + 1820;
const ringR = 2200;
ctx.save();
ctx.beginPath();
ctx.arc(ringCX, ringCY, ringR, 0, Math.PI * 2);
ctx.strokeStyle = 'rgba(79,224,138,0.72)';
ctx.lineWidth = 2;
ctx.shadowColor = 'rgba(79,224,138,0.5)';
ctx.shadowBlur = 60;
ctx.stroke();
ctx.restore();

// second dashed ring slightly larger
ctx.save();
ctx.setLineDash([12, 10]);
ctx.beginPath();
ctx.arc(ringCX, ringCY + 30, ringR + 20, 0, Math.PI * 2);
ctx.strokeStyle = 'rgba(79,224,138,0.18)';
ctx.lineWidth = 1;
ctx.stroke();
ctx.restore();

// ── scanline overlay ──────────────────────────────────────────────────────────

for (let y = 0; y < H; y += 4) {
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(0, y + 2, W, 1);
}

// ── corner brackets ───────────────────────────────────────────────────────────

function corner(x, y, dx, dy) {
  const len = 28;
  ctx.beginPath();
  ctx.moveTo(x + dx * len, y);
  ctx.lineTo(x, y);
  ctx.lineTo(x, y + dy * len);
  ctx.strokeStyle = 'rgba(79,224,138,0.85)';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = 'rgba(79,224,138,0.4)';
  ctx.shadowBlur = 6;
  ctx.stroke();
}

ctx.save();
corner(22, 22, 1, 1);
corner(W - 22, 22, -1, 1);
corner(22, H - 22, 1, -1);
corner(W - 22, H - 22, -1, -1);
ctx.restore();

// ── bottom accent line ────────────────────────────────────────────────────────

const bottomLine = ctx.createLinearGradient(0, 0, W, 0);
bottomLine.addColorStop(0, 'rgba(79,224,138,0)');
bottomLine.addColorStop(0.3, 'rgba(79,224,138,0.9)');
bottomLine.addColorStop(0.5, '#4fe08a');
bottomLine.addColorStop(0.7, 'rgba(79,224,138,0.9)');
bottomLine.addColorStop(1, 'rgba(79,224,138,0)');
ctx.fillStyle = bottomLine;
ctx.fillRect(0, H - 3, W, 3);

// ── left-side vertical accent ─────────────────────────────────────────────────

const leftLine = ctx.createLinearGradient(0, 0, 0, H);
leftLine.addColorStop(0, 'rgba(79,224,138,0)');
leftLine.addColorStop(0.5, 'rgba(79,224,138,0.3)');
leftLine.addColorStop(1, 'rgba(79,224,138,0)');
ctx.fillStyle = leftLine;
ctx.fillRect(0, 0, 2, H);

// ── content: tag pill ─────────────────────────────────────────────────────────

const padX = 90;
let y = 168;

// tag background
const tagW = 310, tagH = 34;
ctx.fillStyle = 'rgba(5,8,7,0.6)';
ctx.strokeStyle = 'rgba(106,224,154,0.34)';
ctx.lineWidth = 1;
ctx.fillRect(padX, y, tagW, tagH);
ctx.strokeRect(padX, y, tagW, tagH);

// green dot
ctx.beginPath();
ctx.arc(padX + 16, y + tagH / 2, 5, 0, Math.PI * 2);
ctx.fillStyle = '#4fe08a';
ctx.shadowColor = '#4fe08a';
ctx.shadowBlur = 10;
ctx.fill();
ctx.shadowBlur = 0;

// tag text
ctx.font = '700 12px "JetBrains Mono", "Courier New", monospace';
ctx.fillStyle = '#4fe08a';
ctx.letterSpacing = '3px';
ctx.fillText('FAN-MADE  ·  FREE TO PLAY', padX + 30, y + tagH / 2 + 4.5);

// ── shield SVG mark (drawn as paths) ─────────────────────────────────────────

y += tagH + 28;

function drawShield(cx, cy, scale) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // outer shield
  ctx.beginPath();
  ctx.moveTo(0, -19.5);
  ctx.lineTo(16.5, -13);
  ctx.lineTo(16.5, -0.5);
  ctx.bezierCurveTo(16.5, 10.5, 10, 17, 0, 18.5);
  ctx.bezierCurveTo(-10, 17, -16.5, 10.5, -16.5, -0.5);
  ctx.lineTo(-16.5, -13);
  ctx.closePath();
  ctx.strokeStyle = '#4fe08a';
  ctx.lineWidth = 1.5 / scale;
  ctx.fillStyle = 'rgba(79,224,138,0.06)';
  ctx.shadowColor = 'rgba(79,224,138,0.4)';
  ctx.shadowBlur = 8 / scale;
  ctx.fill();
  ctx.stroke();

  // outer ring
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.strokeStyle = '#6dffa4';
  ctx.lineWidth = 1.5 / scale;
  ctx.shadowColor = 'rgba(109,255,164,0.5)';
  ctx.shadowBlur = 6 / scale;
  ctx.stroke();

  // center dot
  ctx.beginPath();
  ctx.arc(0, 0, 2.4, 0, Math.PI * 2);
  ctx.fillStyle = '#6dffa4';
  ctx.shadowColor = '#6dffa4';
  ctx.shadowBlur = 8 / scale;
  ctx.fill();

  ctx.restore();
}

drawShield(padX + 34, y + 32, 1.9);

// ── HALOGUESSR wordmark ───────────────────────────────────────────────────────

ctx.save();
ctx.font = '700 78px "Chakra Petch", "Arial", sans-serif';
ctx.fillStyle = '#4fe08a';
ctx.shadowColor = 'rgba(79,224,138,0.4)';
ctx.shadowBlur = 20;
ctx.fillText('HALO', padX + 80, y + 56);
ctx.shadowBlur = 0;

ctx.fillStyle = '#d4e7da';
const haloW = ctx.measureText('HALO').width;
ctx.fillText('GUESSR', padX + 80 + haloW + 4, y + 56);
ctx.restore();

// ── tagline ───────────────────────────────────────────────────────────────────

y += 84;

ctx.font = '400 26px "Chakra Petch", "Arial", sans-serif';
ctx.fillStyle = '#6f8a7a';

// measure "One frame from " then draw "Halo" in green, then ". Pin the spot."
const pre = 'One frame from ';
const highlight = 'Halo';
const post = '. Pin the spot.';

ctx.fillText(pre, padX, y);
const preW = ctx.measureText(pre).width;

ctx.save();
ctx.fillStyle = '#4fe08a';
ctx.shadowColor = 'rgba(79,224,138,0.4)';
ctx.shadowBlur = 18;
ctx.fillText(highlight, padX + preW, y);
const hW = ctx.measureText(highlight).width;
ctx.restore();

ctx.fillStyle = '#6f8a7a';
ctx.fillText(post, padX + preW + hW, y);

// ── stats row ─────────────────────────────────────────────────────────────────

y += 60;

const stats = [
  { val: '3', label: 'CAMPAIGNS' },
  { val: '240', label: 'DROP ZONES' },
  { val: 'CE · 2 · 3', label: 'GAMES AVAILABLE' },
];

let sx = padX;
stats.forEach((s, i) => {
  if (i > 0) {
    // divider
    const divX = sx;
    ctx.beginPath();
    ctx.moveTo(divX, y - 38);
    ctx.lineTo(divX, y + 20);
    ctx.strokeStyle = 'rgba(106,224,154,0.22)';
    ctx.lineWidth = 1;
    ctx.stroke();
    sx += 28;
  }

  ctx.font = '700 36px "JetBrains Mono", "Courier New", monospace';
  ctx.fillStyle = '#6dffa4';
  ctx.shadowColor = 'rgba(109,255,164,0.3)';
  ctx.shadowBlur = 10;
  ctx.fillText(s.val, sx, y);
  const valW = ctx.measureText(s.val).width;
  ctx.shadowBlur = 0;

  ctx.font = '400 11px "JetBrains Mono", "Courier New", monospace';
  ctx.fillStyle = '#46594e';
  ctx.fillText(s.label, sx, y + 22);
  const labelW = ctx.measureText(s.label).width;

  sx += Math.max(valW, labelW) + 28;
});

// ── output ────────────────────────────────────────────────────────────────────

const out = path.join(__dirname, '../public/og-image.png');
const buf = canvas.toBuffer('image/png');
fs.writeFileSync(out, buf);
console.log('OG image written to', out, `(${(buf.length / 1024).toFixed(0)} KB)`);
