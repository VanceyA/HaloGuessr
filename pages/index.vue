<!-- pages/index.vue -->
<template>
  <div class="page-root">
    <div aria-hidden="true" class="scanline"></div>

    <header>
      <div class="wrap head-row">
        <div class="brand">
          <svg class="mark" viewBox="0 0 36 40" fill="none">
            <path d="M18 1.5 34.5 8.5v12.5C34.5 31 27.2 37 18 38.5 8.8 37 1.5 31 1.5 21V8.5L18 1.5Z" stroke="#4fe08a" stroke-width="1.6" fill="rgba(79,224,138,0.06)"/>
            <circle cx="18" cy="20" r="8" stroke="#6dffa4" stroke-width="1.6" fill="none"/>
            <circle cx="18" cy="20" r="2.4" fill="#6dffa4"/>
          </svg>
          <div class="logo-type"><b>HALO</b>GUESSR</div>
        </div>
        <div class="head-right">
          <nav class="nav">
            <a href="#" class="active">Play</a>
          </nav>
          <a href="https://ko-fi.com/haloguessr" target="_blank" rel="noopener noreferrer" class="donate">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 11.5C3 9 1 6.8 1 4.4 1 2.8 2.2 1.7 3.7 1.7c1 0 1.8.5 2.8 1.6 1-1.1 1.8-1.6 2.8-1.6C11.8 1.7 13 2.8 13 4.4c0 2.4-2 4.6-5.5 7.1Z" fill="#07120b"/></svg>
            Donate
          </a>
        </div>
        <button class="menu-btn" aria-label="Open menu"><span></span></button>
      </div>
    </header>

    <section class="hero">
      <div class="hero-glow"></div>
      <div class="ringworld"></div>
      <div class="ringworld-2"></div>
      <div class="wrap hero-grid">
        <div class="hero-text">
          <div class="tag"><span class="dot"></span>3 Campaigns Live · 240 Drop Zones</div>
          <h1>One frame<br/>from <em>Halo</em>.<br/>Pin the spot.</h1>
          <p>We drop you somewhere in the Halo universe with a single screenshot. Study the terrain, the skybox, the architecture — then mark exactly where it was taken.</p>
        </div>

        <div class="recon">
          <div class="play-preview">
            <img
              v-if="previewScreenshot"
              :src="previewScreenshot.screenshotPath"
              class="pp-feed-img"
              alt="Halo preview"
            />
            <template v-else>
              <div class="pp-stripes"></div>
              <div class="pp-grid"></div>
              <div class="pp-reticle"><span></span></div>
              <div class="pp-ph">Drop a Halo screenshot</div>
            </template>
            <div class="pp-vig"></div>
            <div class="pp-top">
              <div class="pp-chip">Round <b>1/5</b><div class="pp-pips"><i class="cur"></i><i></i><i></i><i></i><i></i></div></div>
              <div class="pp-chip pp-score"><span class="star">★</span>Score <b>4,910</b></div>
            </div>
            <div class="pp-chip pp-game">
              <template v-if="previewScreenshot">{{ previewScreenshot.maps?.name }}</template>
              <template v-else>Halo: CE · Blood Gulch</template>
            </div>
            <div class="pp-dock">
              <div class="pp-dock-head"><span>Select Location</span><span>⤢ Expand</span></div>
              <div class="pp-map">
                <img
                  v-if="previewScreenshot?.maps?.image_path"
                  :src="previewScreenshot.maps.image_path"
                  class="pp-map-img"
                  alt="Map"
                />
                <svg v-else viewBox="0 0 300 150" preserveAspectRatio="none" style="display:block;width:100%;height:100%">
                  <defs><pattern id="ppg" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="rgba(106,224,154,.1)" stroke-width="1"/></pattern></defs>
                  <rect width="300" height="150" fill="#070d0a"/>
                  <path d="M20 82 C42 46 92 40 112 50 C150 30 212 32 242 56 C272 46 286 78 268 102 C246 126 150 130 110 116 C70 122 25 106 20 82Z" fill="#16241c" stroke="rgba(106,224,154,.42)" stroke-width="1.2"/>
                  <rect width="300" height="150" fill="url(#ppg)"/>
                  <line x1="120" y1="94" x2="166" y2="70" stroke="#f2b441" stroke-width="1.6" stroke-dasharray="5 4" opacity=".85"/>
                  <circle cx="166" cy="70" r="4.5" fill="#4fe08a" stroke="#06120b" stroke-width="1"/>
                  <path d="M120 95 l-5.5 -10 a5.5 5.5 0 1 1 11 0 z" fill="#f2b441" stroke="#06120b" stroke-width="1"/>
                  <circle cx="120" cy="79.5" r="2" fill="#06120b"/>
                </svg>
                <div v-if="previewScreenshot" class="pp-map-overlay">
                  <div class="pp-map-pin-green"></div>
                  <div class="pp-map-pin-amber"></div>
                </div>
              </div>
              <div class="pp-confirm">◎ Confirm</div>
            </div>
          </div>
        </div>

        <div class="hero-actions">
          <div class="hero-cta">
            <button class="cta-main" @click="startPresetGame(presets[0])" :disabled="isStarting">▶ Quick Play</button>
            <a href="https://ko-fi.com/haloguessr" target="_blank" rel="noopener noreferrer" class="cta-ghost">Donate</a>
          </div>
          <p v-if="startError" class="start-error-inline">{{ startError }}</p>
        </div>
      </div>
    </section>

    <section class="presets">
      <div class="wrap">
        <div class="seclabel"><h2>Deployments</h2><span class="idx mono">[ 01 ]</span><span class="rule"></span></div>
        <div class="preset-grid">
          <button class="preset panel" @click="startPresetGame(presets[0])">
            <div class="preset-top">
              <div class="picon"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 2v12l11-6L3 2Z" fill="currentColor"/></svg></div>
              <span class="pnum">01</span>
            </div>
            <h3>Quick Play</h3>
            <p>5 rounds, random locations pulled from every available Halo game.</p>
            <div class="meta"><span><b>5</b> Rounds</span><span>All Games</span></div>
          </button>
          <button class="preset panel" @click="startPresetGame(presets[1])">
            <div class="preset-top">
              <div class="picon"><svg width="20" height="14" viewBox="0 0 20 14" fill="none"><circle cx="5" cy="7" r="3.4" stroke="currentColor" stroke-width="1.6"/><circle cx="15" cy="7" r="3.4" stroke="currentColor" stroke-width="1.6"/></svg></div>
              <span class="pnum">02</span>
            </div>
            <h3>Endless</h3>
            <p>Unlimited rounds from all available games. Run your streak as far as it holds.</p>
            <div class="meta"><span><b>∞</b> Rounds</span><span>All Games</span></div>
          </button>
          <button class="preset panel" @click="startPresetGame(presets[2])">
            <div class="preset-top">
              <div class="picon amber"><svg width="16" height="16" viewBox="0 0 16 16"><rect x="1.5" y="1.5" width="13" height="13" rx="1" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="5" cy="5" r="1.3" fill="currentColor"/><circle cx="11" cy="11" r="1.3" fill="currentColor"/><circle cx="11" cy="5" r="1.3" fill="currentColor"/></svg></div>
              <span class="pnum">03</span>
            </div>
            <h3>Trilogy</h3>
            <p>Classic locations from the original trilogy — Halo: CE, Halo 2, and Halo 3.</p>
            <div class="meta"><span><b>10</b> Rounds</span><span>CE · 2 · 3</span></div>
          </button>
        </div>
      </div>
    </section>

    <section class="custom">
      <div class="wrap">
        <div class="seclabel"><h2>Custom Game</h2><span class="idx mono">[ 02 ]</span><span class="rule"></span></div>
        <div class="custom-panel panel">
          <div class="cg-grid">
            <div>
              <div class="field-label">// Number of Rounds</div>
              <div class="rounds">
                <button class="rbtn" @click="decreaseRounds" :disabled="settings.unlimited || settings.rounds <= 1">−</button>
                <div class="rval">
                  <div class="num">{{ settings.unlimited ? '∞' : String(settings.rounds).padStart(2, '0') }}</div>
                  <div class="sub">Rounds</div>
                </div>
                <button class="rbtn" @click="increaseRounds" :disabled="settings.unlimited || settings.rounds >= 50">+</button>
              </div>
              <button class="unlimited-btn" @click="toggleUnlimitedRounds">
                {{ settings.unlimited ? '↺ Set Round Limit' : '↻ Go Unlimited' }}
              </button>
              <div class="field-label" style="margin-top:30px">// Time Limit per Round</div>
              <div class="time-row">
                <div
                  v-for="time in timeLimits"
                  :key="time.value"
                  class="timeopt"
                  :class="{ on: settings.timeLimit === time.value }"
                  @click="settings.timeLimit = time.value"
                >
                  <div class="v">{{ time.display }}</div>
                  <div class="u">{{ time.unit }}</div>
                </div>
              </div>
            </div>
            <div>
              <div class="field-label">// Halo Games</div>
              <div class="games">
                <div class="game all" @click="toggleSelectAllEnabled">
                  <span>⊞ Select All Enabled</span>
                </div>
                <div
                  v-for="game in availableGames"
                  :key="game.id"
                  class="game"
                  :class="{
                    on: settings.games.includes(game.id) && !game.disabled,
                    soon: game.disabled
                  }"
                  @click="toggleGameSelection(game.id)"
                >
                  <span class="chk"></span>
                  {{ game.name }}
                  <span v-if="game.disabled" class="badge">Soon</span>
                </div>
              </div>
              <div class="games-note">// Only Halo: CE, Halo 2, and Halo 3 are currently available.</div>
            </div>
          </div>
          <div class="startbar">
            <button class="start" @click="startCustomGame" :disabled="isStarting || settings.games.length === 0">
              {{ isStarting ? '⟳ Deploying...' : '▶ Deploy Game' }}
            </button>
            <div class="start-meta">
              CONFIG: <b>{{ settings.unlimited ? '∞' : settings.rounds }} ROUNDS</b> · <b>{{ getTimeLimitLabel() }}</b><br/>
              SOURCE: {{ getSelectedGamesLabel() }}
            </div>
          </div>
          <p v-if="startError" class="start-error">{{ startError }}</p>
        </div>
      </div>
    </section>

    <footer>
      <div class="wrap foot-row">
        <div class="foot-left"><b>HALOGUESSR</b> // FAN-MADE PROJECT<br/>NOT AFFILIATED WITH OR ENDORSED BY MICROSOFT OR HALO STUDIOS.</div>
        <div class="foot-links">
          <a href="#">About</a>
          <a href="https://ko-fi.com/haloguessr" target="_blank" rel="noopener noreferrer">Donate</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isStarting = ref(false);
const startError = ref(null);

const previewScreenshot = ref({
  screenshotPath: 'https://3qsaoqq5emn9nlet.public.blob.vercel-storage.com/screenshots/6UcoKDxPNAULPZdLcOF9c_image_2025-04-24_111129050.png',
  maps: {
    name: 'Halo: CE · Wizard',
    image_path: 'https://3qsaoqq5emn9nlet.public.blob.vercel-storage.com/maps/6UcoKDxPNAULPZdLcOF9c_2118066301_preview_Wizard%20Overhead%20Map.png',
  },
});

const availableGames = ref([
  { id: 'halo1', name: 'Halo: CE', disabled: false },
  { id: 'halo2', name: 'Halo 2', disabled: false },
  { id: 'halo3', name: 'Halo 3', disabled: false },
  { id: 'halo3odst', name: 'Halo 3: ODST', disabled: true },
  { id: 'haloreach', name: 'Halo Reach', disabled: true },
  { id: 'halo4', name: 'Halo 4', disabled: true },
  { id: 'halo5', name: 'Halo 5', disabled: true },
  { id: 'infinite', name: 'Halo Infinite', disabled: true },
]);

const timeLimits = ref([
  { value: 30, display: '30', unit: 'Sec' },
  { value: 60, display: '60', unit: 'Sec' },
  { value: 90, display: '90', unit: 'Sec' },
  { value: 0, display: '∞', unit: 'None' },
]);

const enabledGameIds = computed(() =>
  availableGames.value.filter((g) => !g.disabled).map((g) => g.id)
);

const presets = ref([
  {
    id: 'quickplay',
    name: 'Quick Play',
    settings: { rounds: 5, games: ['halo1', 'halo2', 'halo3'], timeLimit: 0, unlimited: false },
  },
  {
    id: 'endless',
    name: 'Endless',
    settings: { rounds: 5, games: ['halo1', 'halo2', 'halo3'], timeLimit: 0, unlimited: true },
  },
  {
    id: 'trilogy',
    name: 'Trilogy',
    settings: { rounds: 10, games: ['halo1', 'halo2', 'halo3'], timeLimit: 0, unlimited: false },
  },
]);

const settings = ref({
  rounds: 5,
  games: [...enabledGameIds.value],
  timeLimit: 60,
  unlimited: false,
});

const areAllEnabledSelected = computed(() =>
  enabledGameIds.value.length > 0 &&
  enabledGameIds.value.every((id) => settings.value.games.includes(id)) &&
  settings.value.games.length === enabledGameIds.value.length
);

const increaseRounds = () => {
  if (!settings.value.unlimited && settings.value.rounds < 50) settings.value.rounds++;
};

const decreaseRounds = () => {
  if (!settings.value.unlimited && settings.value.rounds > 1) settings.value.rounds--;
};

const toggleUnlimitedRounds = () => {
  settings.value.unlimited = !settings.value.unlimited;
  if (!settings.value.unlimited && settings.value.rounds < 1) settings.value.rounds = 1;
};

const toggleGameSelection = (gameId) => {
  const game = availableGames.value.find((g) => g.id === gameId);
  if (!game || game.disabled) return;
  const index = settings.value.games.indexOf(gameId);
  if (index > -1) settings.value.games.splice(index, 1);
  else settings.value.games.push(gameId);
};

const toggleSelectAllEnabled = () => {
  if (areAllEnabledSelected.value) settings.value.games = [];
  else settings.value.games = [...enabledGameIds.value];
};

const getTimeLimitLabel = () => {
  if (settings.value.timeLimit === 0) return 'NO LIMIT';
  return `${settings.value.timeLimit}s`;
};

const gameLabels = { halo1: 'CE', halo2: 'HALO 2', halo3: 'HALO 3' };
const getSelectedGamesLabel = () => {
  const active = settings.value.games.filter((id) => enabledGameIds.value.includes(id));
  if (!active.length) return 'NONE';
  return active.map((id) => gameLabels[id] || id.toUpperCase()).join(' · ');
};

const startGame = async (gameSettings) => {
  isStarting.value = true;
  startError.value = null;
  if (!gameSettings?.games?.length) {
    startError.value = 'Please select at least one game.';
    isStarting.value = false;
    return;
  }
  try {
    const payload = { ...gameSettings, rounds: gameSettings.unlimited ? 0 : gameSettings.rounds };
    delete payload.unlimited;
    const response = await fetch('/api/sessions/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (data.error || !data.sessionId) {
      startError.value = data.error || 'Failed to create game session.';
      return;
    }
    router.push(`/play?session=${data.sessionId}`);
  } catch {
    startError.value = 'An unexpected error occurred.';
  } finally {
    isStarting.value = false;
  }
};

const startPresetGame = (preset) => {
  const enabledPresetGames = preset.settings.games.filter((id) => enabledGameIds.value.includes(id));
  if (!enabledPresetGames.length) {
    startError.value = `The preset "${preset.name}" has no enabled games.`;
    return;
  }
  startGame({ ...preset.settings, games: enabledPresetGames });
};

const startCustomGame = () => {
  const enabledCustomGames = settings.value.games.filter((id) => enabledGameIds.value.includes(id));
  if (!enabledCustomGames.length) {
    startError.value = 'Please select at least one enabled game.';
    return;
  }
  startGame({ ...settings.value, games: enabledCustomGames });
};
</script>

<style>
/* ===== Design tokens ===== */
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

/* scanline overlay */
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

/* ===== layout ===== */
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
.brand { display: flex; align-items: center; gap: 13px; }
.mark { width: 36px; height: 40px; }
.logo-type { font-weight: 700; font-size: 25px; letter-spacing: 3px; }
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

/* ===== hero ===== */
.hero { position: relative; overflow: hidden; padding: 82px 0 68px; }
.ringworld {
  position: absolute;
  left: 50%;
  top: 230px;
  width: 3200px;
  height: 3200px;
  transform: translateX(-50%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  border-top: 2px solid rgba(79,224,138,0.72);
  box-shadow: 0 -2px 80px rgba(79,224,138,0.28), inset 0 8px 140px rgba(79,224,138,0.06);
}
.ringworld::before {
  content: "";
  position: absolute;
  left: 0; right: 0; top: 0;
  height: 86px;
  border-radius: 50%;
  background: linear-gradient(180deg, rgba(79,224,138,0.16), rgba(79,224,138,0));
  -webkit-mask: radial-gradient(circle, transparent 1598px, #000 1600px);
          mask: radial-gradient(circle, transparent 1598px, #000 1600px);
}
.ringworld-2 {
  position: absolute;
  left: 50%; top: 250px;
  width: 3200px; height: 3200px;
  transform: translateX(-50%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  border-top: 1px dashed rgba(79,224,138,0.22);
}
.hero-glow {
  position: absolute;
  left: 50%; top: -120px;
  width: 900px; height: 520px;
  transform: translateX(-50%);
  background: radial-gradient(60% 60% at 50% 50%, rgba(79,224,138,0.12), transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.hero-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 0.92fr;
  grid-template-rows: auto auto;
  grid-template-areas: "text preview" "actions preview";
  column-gap: 48px;
  row-gap: 0;
  align-items: start;
}
.hero-text { grid-area: text; }
.recon { grid-area: preview; align-self: center; }
.hero-actions { grid-area: actions; padding-top: 34px; }

.tag {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--green);
  border: 1px solid var(--line-strong);
  padding: 7px 13px;
  margin-bottom: 32px;
  background: rgba(5,8,7,0.5);
}
.dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 10px var(--green);
}
.hero h1 { font-size: 68px; line-height: 0.98; font-weight: 700; letter-spacing: -0.5px; }
.hero h1 em { font-style: normal; color: var(--green); text-shadow: 0 0 30px rgba(79,224,138,0.45); }
.hero p { margin-top: 26px; font-size: 17px; line-height: 1.6; color: var(--muted); max-width: 430px; }
.hero-cta { margin-top: 34px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.cta-main {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
  font-family: 'Chakra Petch', sans-serif;
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #06120b;
  background: var(--green);
  border: none;
  padding: 16px 30px;
  cursor: pointer;
  clip-path: polygon(11px 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%,0 11px);
  box-shadow: 0 0 28px rgba(79,224,138,0.35);
}
.cta-main:hover:not(:disabled) { background: var(--green-bright); }
.cta-main:disabled { opacity: 0.6; cursor: not-allowed; }
.cta-ghost {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--muted);
  background: transparent;
  border: 1px solid var(--line-strong);
  padding: 16px 20px;
  cursor: pointer;
}
.cta-ghost:hover { color: var(--green); border-color: var(--green); }
.start-error-inline {
  margin-top: 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #ff5b5b;
}

/* play preview */
.recon { position: relative; }
.play-preview {
  position: relative;
  aspect-ratio: 16/10;
  border: 1px solid var(--line-strong);
  overflow: hidden;
  background: linear-gradient(165deg,#16223a,#0c1322 58%,#1a130c);
}
.play-preview::before, .play-preview::after {
  content: "";
  position: absolute;
  width: 16px; height: 16px;
  border: 1.5px solid var(--green);
  z-index: 6;
  pointer-events: none;
}
.play-preview::before { top: 0; left: 0; border-right: none; border-bottom: none; }
.play-preview::after { bottom: 0; right: 0; border-left: none; border-top: none; }

.pp-feed-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.pp-stripes {
  position: absolute; inset: 0;
  background: repeating-linear-gradient(135deg,rgba(255,255,255,.018) 0 9px,transparent 9px 18px);
}
.pp-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(120,180,150,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(120,180,150,.05) 1px,transparent 1px);
  background-size: 40px 40px;
}
.pp-vig {
  position: absolute; inset: 0;
  background: radial-gradient(120% 78% at 50% 36%,transparent 46%,rgba(0,0,0,.62));
  pointer-events: none;
  z-index: 2;
}
.pp-reticle {
  position: absolute;
  left: 40%; top: 42%;
  width: 26px; height: 26px;
  transform: translate(-50%,-50%);
  opacity: .7;
  z-index: 3;
}
.pp-reticle::before, .pp-reticle::after {
  content: "";
  position: absolute;
  background: rgba(150,220,255,.8);
}
.pp-reticle::before { left: 50%; top: 0; width: 2px; height: 8px; transform: translateX(-50%); box-shadow: 0 18px 0 rgba(150,220,255,.8); }
.pp-reticle::after { top: 50%; left: 0; height: 2px; width: 8px; transform: translateY(-50%); box-shadow: 18px 0 0 rgba(150,220,255,.8); }
.pp-reticle span {
  position: absolute;
  left: 50%; top: 50%;
  width: 12px; height: 12px;
  transform: translate(-50%,-50%);
  border: 1.5px solid rgba(150,220,255,.8);
  border-radius: 50%;
}
.pp-ph {
  position: absolute;
  left: 0; right: 0;
  top: 38%;
  transform: translateY(-50%);
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(180,210,200,.4);
  z-index: 3;
}
.pp-top {
  position: absolute;
  top: 12px; left: 12px; right: 12px;
  display: flex;
  gap: 8px;
  align-items: flex-start;
  pointer-events: none;
  z-index: 4;
}
.pp-chip {
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(5,8,7,.76);
  border: 1px solid var(--line);
  backdrop-filter: blur(4px);
  padding: 6px 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--muted);
  white-space: nowrap;
}
.pp-chip b { color: var(--text); font-size: 11px; }
.pp-pips { display: flex; gap: 3px; }
.pp-pips i { width: 12px; height: 4px; background: var(--line); font-style: normal; display: block; }
.pp-pips i.cur { background: var(--amber); box-shadow: 0 0 6px var(--amber); }
.pp-pips i.done { background: var(--green); }
.pp-score { margin-left: auto; }
.pp-score .star { color: var(--amber); font-size: 11px; }
.pp-game {
  position: absolute;
  left: 12px; bottom: 12px;
  pointer-events: none;
  z-index: 4;
}
.pp-game b { color: var(--green); }
.pp-dock {
  position: absolute;
  right: 12px; bottom: 12px;
  width: 50%;
  max-width: 230px;
  background: rgba(5,8,7,.92);
  border: 1px solid var(--line-strong);
  box-shadow: 0 12px 34px rgba(0,0,0,.55);
  z-index: 4;
}
.pp-dock-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 10px;
  border-bottom: 1px solid var(--line);
  font-family: 'JetBrains Mono', monospace;
  font-size: 8.5px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--green);
}
.pp-map {
  position: relative;
  height: 92px;
  background: #070d0a;
  overflow: hidden;
}
.pp-map-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  opacity: 0.75;
}
.pp-map-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.pp-map-pin-green {
  position: absolute;
  left: 55%; top: 45%;
  width: 9px; height: 9px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 10px var(--green);
  transform: translate(-50%,-50%);
}
.pp-map-pin-amber {
  position: absolute;
  left: 30%; top: 65%;
  width: 0; height: 0;
  transform: translate(-50%, 0);
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 9px solid var(--amber);
  filter: drop-shadow(0 0 4px var(--amber));
}
.pp-confirm {
  margin: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #06120b;
  background: var(--green);
  padding: 8px;
  clip-path: polygon(7px 0,100% 0,100% calc(100% - 7px),calc(100% - 7px) 100%,0 100%,0 7px);
}

/* ===== section label ===== */
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
}
.panel::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
.panel::after { bottom: -1px; right: -1px; border-left: none; border-top: none; }

/* ===== presets ===== */
.presets { padding: 64px 0 0; }
.preset-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
.preset {
  padding: 22px 22px 24px;
  cursor: pointer;
  transition: background .15s, transform .15s;
  text-align: left;
  font-family: 'Chakra Petch', sans-serif;
  color: var(--text);
}
.preset:hover { background: var(--panel-2); transform: translateY(-2px); }
.preset-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.picon {
  width: 42px; height: 42px;
  display: grid;
  place-items: center;
  border: 1px solid var(--line-strong);
  color: var(--green);
}
.picon.amber { color: var(--amber); border-color: rgba(242,180,65,0.4); }
.pnum { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 1px; color: var(--muted-2); }
.preset h3 { font-size: 22px; font-weight: 700; letter-spacing: 0.3px; margin-bottom: 8px; }
.preset p { font-size: 14px; line-height: 1.55; color: var(--muted); }
.preset .meta {
  margin-top: 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--muted-2);
  display: flex;
  justify-content: space-between;
  border-top: 1px solid var(--line);
  padding-top: 12px;
}
.preset .meta b { color: var(--green); }

/* ===== custom game ===== */
.custom { padding: 64px 0 0; }
.custom-panel { padding: 32px; }
.cg-grid { display: grid; grid-template-columns: 0.95fr 1.05fr; gap: 36px; }
.field-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 14px;
}
.rounds { display: flex; align-items: stretch; border: 1px solid var(--line); }
.rbtn {
  width: 62px;
  flex: none;
  display: grid;
  place-items: center;
  font-size: 28px;
  color: var(--green);
  background: var(--panel-2);
  cursor: pointer;
  border: none;
  font-family: inherit;
}
.rbtn:hover:not(:disabled) { background: rgba(79,224,138,0.12); }
.rbtn:disabled { opacity: 0.3; cursor: not-allowed; }
.rval { flex: 1; display: grid; place-items: center; padding: 16px 0; }
.rval .num { font-family: 'JetBrains Mono', monospace; font-size: 42px; font-weight: 700; color: var(--green-bright); line-height: 1; }
.rval .sub { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-top: 6px; }
.unlimited-btn {
  margin-top: 12px;
  width: 100%;
  border: 1px dashed var(--line-strong);
  background: transparent;
  color: var(--muted);
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 13px;
  cursor: pointer;
}
.unlimited-btn:hover { color: var(--green); border-color: var(--green); }
.time-row { display: flex; gap: 10px; flex-wrap: wrap; }
.timeopt {
  flex: 1;
  min-width: 60px;
  text-align: center;
  padding: 14px 8px;
  border: 1px solid var(--line);
  background: var(--panel-2);
  cursor: pointer;
}
.timeopt .v { font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 700; }
.timeopt .u { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-top: 4px; }
.timeopt.on { border-color: var(--green); background: rgba(79,224,138,0.1); }
.timeopt.on .v { color: var(--green-bright); }
.timeopt:hover:not(.on) { border-color: var(--line-strong); }
.games { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.game {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 13px 15px;
  border: 1px solid var(--line);
  background: var(--panel-2);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
}
.game .chk {
  width: 16px; height: 16px;
  flex: none;
  border: 1px solid var(--line-strong);
  display: grid;
  place-items: center;
}
.game.on { border-color: var(--line-strong); background: rgba(79,224,138,0.08); }
.game.on .chk { background: var(--green); border-color: var(--green); }
.game.on .chk::after {
  content: "";
  width: 5px; height: 9px;
  border: solid #07120b;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) translate(-1px,-1px);
}
.game.all {
  grid-column: 1 / -1;
  justify-content: center;
  border-style: dashed;
  color: var(--green);
  text-transform: uppercase;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 1.5px;
}
.game.soon { color: var(--muted-2); cursor: not-allowed; background: transparent; }
.game.soon .chk { border-color: var(--muted-2); }
.game.soon .badge {
  margin-left: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--amber);
  border: 1px solid rgba(242,180,65,0.3);
  padding: 2px 6px;
}
.games-note { margin-top: 14px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--muted-2); }
.startbar { margin: 28px 0 0; display: flex; align-items: center; gap: 20px; }
.start {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  font-family: 'Chakra Petch', sans-serif;
  font-weight: 700;
  font-size: 22px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #06120b;
  background: var(--green);
  border: none;
  padding: 24px;
  cursor: pointer;
  clip-path: polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px);
  box-shadow: 0 0 30px rgba(79,224,138,0.4);
}
.start:hover:not(:disabled) { background: var(--green-bright); }
.start:disabled { opacity: 0.5; cursor: not-allowed; }
.start-meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--muted);
  text-align: right;
  line-height: 1.8;
  white-space: nowrap;
}
.start-meta b { color: var(--green); }
.start-error {
  margin-top: 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #ff5b5b;
  letter-spacing: 1px;
}

/* ===== footer ===== */
footer { margin-top: 60px; border-top: 1px solid var(--line); padding: 28px 0 40px; }
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

/* ── Hamburger button (mobile only) ── */
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

  .hero { padding: 32px 0 28px; }
  .hero-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    grid-template-areas: "text" "preview" "actions";
    column-gap: 0;
    row-gap: 24px;
  }
  .recon { align-self: auto; }
  .hero-actions { padding-top: 0; }
  .hero h1 { font-size: 40px; }
  .hero p { font-size: 14px; }
  .hero-cta { flex-direction: column; gap: 10px; }
  .cta-main { width: 100%; justify-content: center; font-size: 18px; padding: 18px; }
  .cta-ghost { width: 100%; font-size: 11px; padding: 14px; }

  .presets { padding: 34px 0 0; }
  .preset-grid { grid-template-columns: 1fr; gap: 12px; }
  .preset { padding: 18px 18px 20px; }
  .preset h3 { font-size: 20px; }
  .cg-grid { grid-template-columns: 1fr; }
  .custom { padding: 38px 0 0; }
  .foot-row { flex-direction: column; gap: 16px; }
  .foot-links { flex-wrap: wrap; gap: 12px; }
  footer { margin-top: 38px; padding: 24px 0 calc(24px + env(safe-area-inset-bottom, 20px)); }
}
</style>
