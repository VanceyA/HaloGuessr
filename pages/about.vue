<!-- pages/about.vue -->
<template>
  <div class="page-root">
    <div aria-hidden="true" class="scanline"></div>

    <header>
      <div class="wrap head-row">
        <NuxtLink to="/" class="brand">
          <svg class="mark" viewBox="0 0 36 40" fill="none">
            <path d="M18 1.5 34.5 8.5v12.5C34.5 31 27.2 37 18 38.5 8.8 37 1.5 31 1.5 21V8.5L18 1.5Z" stroke="#4fe08a" stroke-width="1.6" fill="rgba(79,224,138,0.06)"/>
            <circle cx="18" cy="20" r="8" stroke="#6dffa4" stroke-width="1.6" fill="none"/>
            <circle cx="18" cy="20" r="2.4" fill="#6dffa4"/>
          </svg>
          <div class="logo-type"><b>HALO</b>GUESSR</div>
        </NuxtLink>
        <div class="head-right">
          <nav class="nav">
            <NuxtLink to="/">Play</NuxtLink>
            <NuxtLink to="/about" class="active">About</NuxtLink>
          </nav>
          <a href="https://ko-fi.com/haloguessr" target="_blank" rel="noopener noreferrer" class="donate">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 11.5C3 9 1 6.8 1 4.4 1 2.8 2.2 1.7 3.7 1.7c1 0 1.8.5 2.8 1.6 1-1.1 1.8-1.6 2.8-1.6C11.8 1.7 13 2.8 13 4.4c0 2.4-2 4.6-5.5 7.1Z" fill="#07120b"/></svg>
            Donate
          </a>
        </div>
        <button class="menu-btn" :class="{ open: menuOpen }" :aria-expanded="menuOpen" aria-label="Open menu" @click="menuOpen = !menuOpen">
          <span v-if="!menuOpen"></span>
          <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 1l12 12M13 1L1 13"/></svg>
        </button>
      </div>
    </header>

    <Transition name="drawer">
      <div v-if="menuOpen" class="mob-drawer">
        <NuxtLink to="/" class="mob-nav-link" @click="menuOpen = false">Play</NuxtLink>
        <NuxtLink to="/about" class="mob-nav-link active" @click="menuOpen = false">About</NuxtLink>
        <a href="https://ko-fi.com/haloguessr" target="_blank" rel="noopener noreferrer" class="mob-donate">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 11.5C3 9 1 6.8 1 4.4 1 2.8 2.2 1.7 3.7 1.7c1 0 1.8.5 2.8 1.6 1-1.1 1.8-1.6 2.8-1.6C11.8 1.7 13 2.8 13 4.4c0 2.4-2 4.6-5.5 7.1Z" fill="#07120b"/></svg>
          Donate
        </a>
      </div>
    </Transition>

    <section class="ab-hero">
      <div class="ab-glow"></div>
      <div class="ab-ring"></div>
      <div class="wrap ab-hero-inner">
        <div class="ab-eyebrow mono">// DOSSIER · HALOGUESSR</div>
        <h1 class="ab-h1">Built for fans.<br/>By a fan.</h1>
        <p class="ab-sub">A free, fan-made geography guessing game set in the Halo universe. Not affiliated with Microsoft or Halo Studios — just someone who spent too long in Blood Gulch.</p>
      </div>
    </section>

    <section class="ab-sec">
      <div class="wrap">
        <div class="seclabel">
          <h2>Origin</h2>
          <span class="idx mono">[ 01 ]</span>
          <span class="rule"></span>
        </div>
        <div class="origin-grid">
          <div class="origin-copy">
            <p>The question that started everything: drop a Halo fan into a random corner of the Covenant War with nothing but a screenshot — could they find their way home?</p>
            <p>No waypoints. No minimap. Just a skybox, a ridge line, and everything they've absorbed from years inside these worlds.</p>
            <p>HaloGuessr is that experiment turned into a game. Every round pulls a real location from the library and asks you to pin it on the overhead map — as precisely as you can. New campaigns and maps are added as time permits.</p>
          </div>
          <div class="status-table panel">
            <div class="st-head mono">// CAMPAIGN STATUS</div>
            <div v-for="g in campaigns" :key="g.id" class="st-row" :class="g.status">
              <span class="st-name">{{ g.name }}</span>
              <div class="st-bar"><div class="st-fill"></div></div>
              <span class="st-badge">{{ g.status === 'live' ? 'LIVE' : 'PENDING' }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="ab-sec">
      <div class="wrap">
        <div class="seclabel">
          <h2>Contact</h2>
          <span class="idx mono">[ 02 ]</span>
          <span class="rule"></span>
        </div>
        <div class="contact-layout">
          <div class="contact-copy">
            <p>Bug reports, map submissions, feature ideas, or just want to talk Halo — reach out on Discord.</p>
            <p class="contact-note mono">// Solo project. Response times vary.</p>
          </div>
          <a href="https://discord.gg/x5RTwAag2K" target="_blank" rel="noopener noreferrer" class="dc-card panel">
            <div class="dc-platform mono">
              <svg class="dc-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="16" height="16">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.015.045.036.059a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
              // DISCORD
            </div>
            <div class="dc-handle">Join the server</div>
            <div class="dc-action mono">Open Discord →</div>
          </a>
        </div>
      </div>
    </section>

    <footer>
      <div class="wrap foot-row">
        <div class="foot-left"><b>HALOGUESSR</b> // FAN-MADE PROJECT<br/>NOT AFFILIATED WITH OR ENDORSED BY MICROSOFT OR HALO STUDIOS.</div>
        <div class="foot-links">
          <NuxtLink to="/about">About</NuxtLink>
          <a href="https://ko-fi.com/haloguessr" target="_blank" rel="noopener noreferrer">Donate</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

useSeoMeta({
  title: 'About',
  description: 'HaloGuessr is a free, fan-made GeoGuessr-style game set in the Halo universe. Learn about the project and get in touch.',
});

const menuOpen = ref(false);
const campaigns = [
  { id: 'halo1', name: 'Halo: CE', status: 'live' },
  { id: 'halo2', name: 'Halo 2', status: 'live' },
  { id: 'halo3', name: 'Halo 3', status: 'live' },
  { id: 'halo3odst', name: 'Halo 3: ODST', status: 'pending' },
  { id: 'haloreach', name: 'Halo Reach', status: 'pending' },
  { id: 'halo4', name: 'Halo 4', status: 'pending' },
  { id: 'halo5', name: 'Halo 5', status: 'pending' },
  { id: 'infinite', name: 'Halo Infinite', status: 'pending' },
];


</script>

<style>
/* ===== Design tokens (shared) ===== */
.page-root {
  --bg: #050807;
  --panel: #0b1310;
  --panel-2: #0f1a15;
  --line: rgba(106,224,154,0.16);
  --line-strong: rgba(106,224,154,0.34);
  --green: #4fe08a;
  --green-bright: #6dffa4;
  --amber: #f2b441;
  --text: #d4e7da;
  --muted: #6f8a7a;
  --muted-2: #46594e;
}

.page-root {
  min-height: 100vh;
  background: var(--bg);
  font-family: 'Chakra Petch', sans-serif;
  color: var(--text);
  position: relative;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

.scanline {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 60;
  background: repeating-linear-gradient(0deg, rgba(0,0,0,0) 0 2px, rgba(0,0,0,0.14) 3px, rgba(0,0,0,0) 4px);
  mix-blend-mode: multiply;
  opacity: .45;
}

.mono { font-family: 'JetBrains Mono', monospace; }

.wrap {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 72px;
}

/* ===== header ===== */
header {
  position: relative;
  z-index: 5;
  border-bottom: 1px solid var(--line);
  background: rgba(5,8,7,0.7);
  backdrop-filter: blur(6px);
}
.head-row { display: flex; align-items: center; justify-content: space-between; height: 74px; }
.brand { display: flex; align-items: center; gap: 13px; text-decoration: none; }
.mark { width: 36px; height: 40px; }
.logo-type { font-weight: 700; font-size: 25px; letter-spacing: 3px; color: var(--text); }
.logo-type b { color: var(--green); }
.head-right { display: flex; align-items: center; gap: 26px; }
.nav { display: flex; gap: 24px; }
.nav a {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--muted);
  text-decoration: none;
  padding: 6px 0;
  border-bottom: 1px solid transparent;
  white-space: nowrap;
}
.nav a.active, .nav a:hover { color: var(--green); border-bottom-color: var(--green); }
.donate {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #07120b;
  background: var(--green);
  padding: 11px 18px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  clip-path: polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
  box-shadow: 0 0 22px rgba(79,224,138,0.3);
}
.donate:hover { background: var(--green-bright); }

/* mobile menu btn */
.menu-btn {
  display: none;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid var(--line);
  background: rgba(5,8,7,.6);
  color: var(--green);
  cursor: pointer;
  flex: none;
}
.menu-btn span {
  display: block;
  width: 18px;
  height: 2px;
  background: currentColor;
  box-shadow: 0 6px 0 currentColor, 0 -6px 0 currentColor;
}

.mob-drawer {
  position: fixed;
  top: 60px;
  left: 0; right: 0;
  z-index: 55;
  background: rgba(5,8,7,.97);
  border-bottom: 1px solid var(--line-strong);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  padding: 16px 18px 24px;
  gap: 4px;
}
.mob-nav-link {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--muted);
  text-decoration: none;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
}
.mob-nav-link.active { color: var(--green); }
.mob-donate {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #07120b;
  background: var(--green);
  text-decoration: none;
  padding: 16px;
  margin-top: 12px;
  clip-path: polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
}
.drawer-enter-active, .drawer-leave-active { transition: opacity .18s, transform .18s; }
.drawer-enter-from, .drawer-leave-to { opacity: 0; transform: translateY(-8px); }

/* ===== shared section label ===== */
.seclabel { display: flex; align-items: center; gap: 14px; margin: 0 0 22px; }
.seclabel h2 {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--green);
  white-space: nowrap;
}
.seclabel .idx { color: var(--muted-2); }
.seclabel .rule { flex: 1; height: 1px; background: linear-gradient(90deg, var(--line-strong), transparent); }

/* shared panel */
.panel {
  position: relative;
  background: var(--panel);
  border: 1px solid var(--line);
}
.panel::before, .panel::after {
  content: "";
  position: absolute;
  width: 14px; height: 14px;
  border: 1.5px solid var(--green);
  opacity: .8;
  pointer-events: none;
}
.panel::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
.panel::after { bottom: -1px; right: -1px; border-left: none; border-top: none; }

/* ===== about hero ===== */
.ab-hero {
  position: relative;
  overflow: hidden;
  padding: 80px 0 64px;
}
.ab-glow {
  position: absolute;
  left: 50%; top: -80px;
  width: 700px; height: 400px;
  transform: translateX(-50%);
  background: radial-gradient(60% 60% at 50% 50%, rgba(79,224,138,0.1), transparent 70%);
  pointer-events: none;
  z-index: 0;
}
.ab-ring {
  position: absolute;
  left: 50%; top: 200px;
  width: 2800px; height: 2800px;
  transform: translateX(-50%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  border-top: 1px solid rgba(79,224,138,0.3);
  box-shadow: 0 -1px 60px rgba(79,224,138,0.12);
}
.ab-hero-inner { position: relative; z-index: 2; }
.ab-eyebrow {
  font-size: 11px;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--green);
  margin-bottom: 28px;
}
.ab-h1 {
  font-size: 58px;
  line-height: 1.02;
  font-weight: 700;
  letter-spacing: -0.3px;
  max-width: 520px;
}
.ab-sub {
  margin-top: 22px;
  font-size: 16px;
  line-height: 1.65;
  color: var(--muted);
  max-width: 520px;
}

/* ===== shared section wrapper ===== */
.ab-sec { padding: 64px 0 0; }

/* ===== origin ===== */
.origin-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}
.origin-copy p {
  font-size: 16px;
  line-height: 1.7;
  color: var(--muted);
  margin-bottom: 18px;
}
.origin-copy p:last-child { margin-bottom: 0; }

/* campaign status table */
.status-table { padding: 0; overflow: hidden; }
.st-head {
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--muted-2);
  padding: 14px 20px;
  border-bottom: 1px solid var(--line);
}
.st-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 14px;
  padding: 13px 20px;
  border-bottom: 1px solid var(--line);
}
.st-row:last-child { border-bottom: none; }
.st-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.5px;
  color: var(--muted);
  white-space: nowrap;
}
.st-row.live .st-name { color: var(--text); }
.st-bar {
  width: 80px;
  height: 3px;
  background: rgba(106,224,154,0.1);
  border: 1px solid var(--line);
}
.st-fill {
  height: 100%;
  background: var(--green);
  width: 0%;
  box-shadow: 0 0 8px rgba(79,224,138,0.6);
}
.st-row.live .st-fill { width: 100%; }
.st-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--muted-2);
  border: 1px solid var(--line);
  padding: 3px 7px;
  white-space: nowrap;
}
.st-row.live .st-badge {
  color: var(--green);
  border-color: rgba(79,224,138,0.4);
  background: rgba(79,224,138,0.08);
}

/* ===== contact ===== */
.contact-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: center;
}
.contact-copy p {
  font-size: 16px;
  line-height: 1.7;
  color: var(--muted);
  margin-bottom: 14px;
}
.contact-copy p:last-child { margin-bottom: 0; }
.contact-note {
  font-size: 11px !important;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--muted-2) !important;
}

/* discord card */
.dc-card {
  cursor: pointer;
  padding: 28px 28px 24px;
  text-align: left;
  font-family: 'Chakra Petch', sans-serif;
  color: var(--text);
  background: var(--panel);
  border: 1px solid var(--line);
  width: 100%;
  transition: border-color .15s, background .15s, box-shadow .15s;
}
.dc-card:hover {
  border-color: var(--line-strong);
  background: var(--panel-2);
  box-shadow: 0 0 28px rgba(79,224,138,0.1);
}
.dc-platform {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--muted-2);
  margin-bottom: 14px;
}
.dc-icon { flex: none; color: var(--muted); }
.dc-handle {
  font-family: 'JetBrains Mono', monospace;
  font-size: 28px;
  font-weight: 700;
  color: var(--green-bright);
  letter-spacing: 1px;
  text-shadow: 0 0 24px rgba(109,255,164,0.3);
  margin-bottom: 16px;
}
.dc-action {
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--muted-2);
  transition: color .15s;
}
.dc-card:hover .dc-action { color: var(--muted); }

/* ===== footer ===== */
footer { margin-top: 80px; border-top: 1px solid var(--line); padding: 28px 0 40px; }
.foot-row { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.foot-left { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 1px; color: var(--muted-2); line-height: 1.8; }
.foot-left b { color: var(--muted); }
.foot-links { display: flex; gap: 22px; }
.foot-links a {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--muted);
  text-decoration: none;
}
.foot-links a:hover { color: var(--green); }

/* ===== responsive ===== */
@media (max-width: 900px) {
  .wrap { padding: 0 18px; }
  header {
    position: sticky;
    top: 0;
    z-index: 60;
    backdrop-filter: blur(8px);
    background: rgba(5,8,7,.92);
    padding-top: env(safe-area-inset-top, 0px);
  }
  .head-row { height: 60px; }
  .head-right { display: none; }
  .menu-btn { display: grid; }

  .ab-hero { padding: 40px 0 36px; }
  .ab-h1 { font-size: 36px; }
  .ab-sub { font-size: 14px; }

  .ab-sec { padding: 40px 0 0; }
  .origin-grid { grid-template-columns: 1fr; }
  .contact-layout { grid-template-columns: 1fr; }

  .st-bar { width: 50px; }

  footer { margin-top: 48px; padding: 24px 0 calc(24px + env(safe-area-inset-bottom, 20px)); }
  .foot-row { flex-direction: column; gap: 16px; }
  .foot-links { flex-wrap: wrap; gap: 12px; }
}
</style>
