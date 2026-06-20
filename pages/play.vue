<template>
  <div class="play-root" :data-state="gameState">
    <!-- CRT scanlines -->
    <div class="scanlines" aria-hidden="true"></div>

    <!-- Full-bleed recon feed -->
    <div class="feed">
      <img
        v-if="screenshot"
        :src="screenshot.screenshotPath"
        class="feed-img"
        alt=""
        @load="onScreenshotLoaded"
      />
      <div class="feed-stripes"></div>
      <div class="feed-grid"></div>
      <div class="feed-vig"></div>
      <div v-if="!screenshotLoaded" class="feed-ph">
        <div class="t">
          {{ isLoadingInitial ? '[ Establishing recon feed ]' : '[ Loading drop zone ]' }}
          <small>{{ isLoadingInitial ? 'connecting to satellite...' : 'please wait' }}</small>
        </div>
      </div>
    </div>

    <!-- Top HUD bar -->
    <div v-if="!isLoadingInitial" class="topbar">
      <div class="chip chip-brand brk">
        <svg class="mark" viewBox="0 0 36 40" fill="none">
          <path d="M18 1.5 34.5 8.5v12.5C34.5 31 27.2 37 18 38.5 8.8 37 1.5 31 1.5 21V8.5L18 1.5Z" stroke="#4fe08a" stroke-width="1.6" fill="rgba(79,224,138,0.06)"/>
          <circle cx="18" cy="20" r="8" stroke="#6dffa4" stroke-width="1.6"/>
          <circle cx="18" cy="20" r="2.4" fill="#6dffa4"/>
        </svg>
        <div class="lt"><b>HALO</b>GUESSR</div>
      </div>

      <div class="chip chip-round">
        <div class="round-lbl">
          Round&nbsp;<b>{{ sessionData.currentRound }}<template v-if="sessionData.maxRounds > 0">/{{ sessionData.maxRounds }}</template></b>
        </div>
        <div v-if="sessionData.maxRounds > 0" class="pips">
          <div
            v-for="i in sessionData.maxRounds"
            :key="i"
            class="pip"
            :class="pipClass(i)"
          ></div>
        </div>
      </div>

      <div class="chip chip-score">
        <svg class="star" width="14" height="14" viewBox="0 0 14 14">
          <path d="M7 0l1.8 4.3L13.5 5l-3.5 3 1.1 4.6L7 10.2 2.9 12.6 4 8 .5 5l4.7-.7L7 0z" fill="currentColor"/>
        </svg>
        <span class="l">Score</span>
        <span class="v">{{ totalScore.toLocaleString() }}</span>
      </div>

      <div
        v-if="roundTimeLimit > 0 && gameState === 'active'"
        class="chip chip-timer"
        :class="{ low: timeLeft <= 10 }"
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.4">
          <circle cx="6.5" cy="7" r="5.2"/>
          <path d="M6.5 4v3l2 1.4M4.6 1h3.8"/>
        </svg>
        <span class="t">{{ formattedTimeLeft }}</span>
      </div>

      <button class="exit-btn" @click="exitSession">Exit</button>
    </div>

    <!-- Game label bottom-left -->
    <div v-if="screenshot && !isLoadingInitial" class="gamelbl" :class="{ 'sheet-hidden': sheetFull }">
      <span class="ic">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="7.5" cy="7.5" r="6"/>
          <circle cx="7.5" cy="7.5" r="1.6" fill="currentColor" stroke="none"/>
          <path d="M7.5 1.5v2M7.5 11.5v2M1.5 7.5h2M11.5 7.5h2"/>
        </svg>
      </span>
      <div>
        <div class="k">Drop {{ String(sessionData.currentRound).padStart(2, '0') }}</div>
        <div class="v">{{ screenshot.maps?.name }}</div>
      </div>
    </div>

    <!-- Mobile scrim (behind bottom sheet) -->
    <div class="mob-scrim" :class="{ visible: sheetFull }" @click="sheetFull = false"></div>

    <!-- Map dock — always mounted when screenshot is available so MapCanvas can load -->
    <div
      v-if="screenshot"
      class="mapdock brk"
      :class="{
        'is-loading': dockIsLoading,
        'open': gameState === 'result',
        'sheet-full': sheetFull
      }"
    >
      <div class="handle-zone" @click="toggleSheet" @touchstart.passive="onHandleTouchStart" @touchend="onHandleTouchEnd">
        <div class="handle"></div>
      </div>
      <div class="mapdock-head">
        <h2>{{ gameState === 'result' ? 'Result' : 'Select Location' }}</h2>
        <span class="exp">hover to expand</span>
      </div>

      <div class="map-wrap">
        <!-- Processing overlay -->
        <div v-if="hasGuessed && !result && !showTimeoutOverlay" class="map-overlay">
          <div class="proc-ring"></div>
          <span class="proc-lbl">Processing</span>
        </div>
        <!-- Timeout overlay -->
        <div v-if="showTimeoutOverlay" class="map-overlay timeout-overlay">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="14" cy="15" r="11"/>
            <path d="M14 9v6l3 2M10 2h8"/>
          </svg>
          <span>TIME'S UP</span>
        </div>
        <MapCanvas
          :map-path="screenshot.maps?.image_path"
          :correct-location="result?.correctLocation"
          :disabled="hasGuessed"
          @map-loaded="onMapLoaded"
          @select="onSelect"
        />
      </div>

      <div class="mapdock-foot">
        <!-- Confirm button (guessing phase) -->
        <button
          v-if="gameState === 'active'"
          class="confirm"
          :disabled="!pendingGuess || hasGuessed"
          @click="handleConfirmGuess"
        >
          <template v-if="hasGuessed">Analyzing...</template>
          <template v-else-if="pendingGuess">Confirm Location</template>
          <template v-else>Drop a marker first</template>
        </button>

        <!-- Result bar -->
        <div v-if="gameState === 'result'" class="resultbar">
          <div class="res-row">
            <div class="res-pts">
              <div class="n">{{ result.score.toLocaleString() }}</div>
              <div class="u">Points</div>
            </div>
            <div class="res-mid">
              <div class="k">Actual</div>
              <div class="nm">{{ result.mapName }}</div>
            </div>
            <div class="res-dist">
              <div class="n">{{ accuracy.toFixed(0) }}%</div>
              <div class="u">accuracy</div>
            </div>
          </div>
          <div class="res-meter"><i :style="{ width: accuracy.toFixed(0) + '%' }"></i></div>
          <button class="next" @click="handleNextScreenshot">
            {{ isLastRound ? 'View Debrief' : 'Next Round' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Between-rounds loading overlay -->
    <div v-if="isLoadingNextLevel && !isLoadingInitial" class="round-loader">
      <div class="rl-ring"></div>
      <div class="rl-t">Loading Next Location</div>
      <div class="rl-bar"><div class="rl-fill"></div></div>
    </div>

    <!-- Summary overlay -->
    <Transition name="fade">
      <div v-if="gameState === 'summary'" class="summary">
        <div class="sum-card brk">
          <div class="sum-kick">Recon Debrief · {{ activeSession ? 'Ranked Play' : 'Quick Play' }}</div>
          <h2>Mission Complete</h2>
          <div class="sum-rank">RANK · {{ rank }}</div>
          <div class="sum-total">
            <span class="n">{{ summaryDisplayScore.toLocaleString() }}</span>
            <span class="max">/ {{ sessionData.maxRounds * 1000 }}</span>
            <span class="u">Total<br/>Points</span>
          </div>
          <div class="sum-list">
            <div v-for="round in sessionRounds" :key="round.round_number" class="sum-r">
              <span class="i">R{{ round.round_number }}</span>
              <span class="nm">{{ round.mapName || `Round ${round.round_number}` }}</span>
              <span class="p">{{ round.score.toLocaleString() }}</span>
            </div>
          </div>
          <div class="sum-cta">
            <button class="again" @click="exitSession">Play Again</button>
            <button class="home" @click="exitSession">Home</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Mod info panel (debug, Ctrl/Cmd+K) -->
    <div v-if="showModInfo && screenshot" class="mod-info">
      <div class="mod-label">Mod Info</div>
      <div class="mono">ID: {{ screenshot.id }}</div>
      <div class="mod-hint">Press {{ isMac ? '⌘' : 'Ctrl' }}+K to hide</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MapCanvas from '~/components/MapCanvas.vue'

useSeoMeta({ robots: 'noindex, nofollow' })
useHead({ title: 'Playing' })

const route = useRoute()
const router = useRouter()

// ── UI state ──────────────────────────────────────────────
const showModInfo = ref(false)
const isMac = ref(false)
const summaryDisplayScore = ref(0)
const sheetFull = ref(false)
const showTimeoutOverlay = ref(false)
let touchStartY = 0

// ── Timer ─────────────────────────────────────────────────
const { timeLeft, formattedTimeLeft, start: startTimer, stop: stopTimer } = useRoundTimer({
  onTimeout() {
    if (hasGuessed.value) return
    showTimeoutOverlay.value = true
    pendingGuess.value = null
    nextTick(() => confirmGuess())
  },
})

// ── Game session ──────────────────────────────────────────
const {
  screenshot, result, hasGuessed,
  isLoadingInitial, isLoadingNextLevel,
  dockIsLoading, screenshotLoaded, mapLoaded,
  pendingGuess, showSummary,
  activeSession, sessionData, sessionRounds, sessionComplete,
  roundTimeLimit,
  totalScore, isLastRound, accuracy, rank, gameState,
  loadSession, confirmGuess, nextScreenshot, initQuickPlay,
} = useGameSession({
  onImagesReady(limit) {
    if (limit > 0 && !hasGuessed.value && !sessionComplete.value) startTimer(limit)
  },
  onScreenshotChange() {
    stopTimer()
    showTimeoutOverlay.value = false
  },
})

// Clear timeout overlay when the API result arrives
watch(result, (v) => { if (v) showTimeoutOverlay.value = false })

// UI reactions to game state changes
watch(gameState, (state) => {
  if (state === 'summary') animateValue(summaryDisplayScore, 0, totalScore.value, 1100)
  if (state === 'result') sheetFull.value = true
  if (state === 'active') sheetFull.value = false
})

// ── Lifecycle ─────────────────────────────────────────────
onMounted(() => {
  document.body.style.overflow = 'hidden'
  const sessionId = route.query.session
  if (sessionId) loadSession(sessionId)
  else initQuickPlay()
  isMac.value = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC')
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  stopTimer()
  window.removeEventListener('keydown', handleKeyDown)
})

// ── Actions ───────────────────────────────────────────────
function handleConfirmGuess() { stopTimer(); confirmGuess() }
function handleNextScreenshot() { stopTimer(); nextScreenshot() }
function exitSession() { stopTimer(); router.push('/') }

function pipClass(i) {
  if (i < sessionData.value.currentRound) return 'done'
  if (i === sessionData.value.currentRound) return gameState.value !== 'active' ? 'done' : 'cur'
  return ''
}

function handleKeyDown(e) {
  if ((isMac.value ? e.metaKey : e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    if (screenshot.value) showModInfo.value = !showModInfo.value
  }
}

function toggleSheet() { sheetFull.value = !sheetFull.value }
function onHandleTouchStart(e) { touchStartY = e.touches[0].clientY }
function onHandleTouchEnd(e) {
  e.preventDefault()
  const dy = e.changedTouches[0].clientY - touchStartY
  if (Math.abs(dy) < 8) toggleSheet()
  else sheetFull.value = dy < 0
}

// Bridge DOM/component events to composable refs
function onScreenshotLoaded() { screenshotLoaded.value = true }
function onMapLoaded() { mapLoaded.value = true }
function onSelect(coords) { if (!hasGuessed.value) pendingGuess.value = coords }

function animateValue(target, from, to, duration) {
  const t0 = performance.now()
  target.value = from
  function step(t) {
    const k = Math.min(1, (t - t0) / duration)
    target.value = Math.round(to * (1 - Math.pow(1 - k, 3)))
    if (k < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
</script>

<style scoped>
/* ── Design tokens ──────────────────────────────────────── */
.play-root {
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

  position: fixed;
  inset: 0;
  overflow: hidden;
  font-family: 'Chakra Petch', sans-serif;
  color: var(--text);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
}

.mono { font-family: 'JetBrains Mono', monospace; }

/* ── CRT scanlines ──────────────────────────────────────── */
.scanlines {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 300;
  background: repeating-linear-gradient(
    0deg, rgba(0,0,0,0) 0 2px, rgba(0,0,0,.13) 3px, rgba(0,0,0,0) 4px
  );
  opacity: .35;
}

/* ── Corner bracket decoration ──────────────────────────── */
.brk { position: relative; }
.brk::before, .brk::after {
  content: "";
  position: absolute;
  width: 13px;
  height: 13px;
  border: 1.5px solid var(--green);
  pointer-events: none;
  z-index: 6;
  opacity: .8;
}
.brk::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
.brk::after  { bottom: -1px; right: -1px; border-left: none; border-top: none; }

/* ── Full-bleed feed ────────────────────────────────────── */
.feed {
  position: fixed;
  inset: 0;
  background: linear-gradient(165deg,#16223a,#0c1322 55%,#1a130c);
  overflow: hidden;
}
.feed-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.feed-stripes {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    135deg, rgba(255,255,255,.016) 0 11px, transparent 11px 22px
  );
}
.feed-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(120,180,150,.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120,180,150,.045) 1px, transparent 1px);
  background-size: 54px 54px;
}
.feed-vig {
  position: absolute;
  inset: 0;
  background: radial-gradient(120% 75% at 50% 38%, transparent 45%, rgba(0,0,0,.62));
}
.feed-ph {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  text-align: center;
}
.feed-ph .t {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(180,210,200,.42);
  line-height: 2.2;
}
.feed-ph .t small {
  display: block;
  font-size: 11px;
  letter-spacing: 1.5px;
  color: rgba(180,210,200,.26);
}

/* ── Top HUD bar ────────────────────────────────────────── */
.topbar {
  position: fixed;
  top: 18px;
  left: 18px;
  right: 18px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  z-index: 40;
}

.chip {
  background: rgba(5,8,7,.74);
  border: 1px solid var(--line);
  backdrop-filter: blur(6px);
}

.chip-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 15px;
}
.chip-brand .mark { width: 24px; height: 27px; }
.chip-brand .lt { font-weight: 700; font-size: 15px; letter-spacing: 2px; }
.chip-brand .lt b { color: var(--green); }

.chip-round {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 11px 16px;
}
.round-lbl {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--muted);
  white-space: nowrap;
}
.round-lbl b { color: var(--text); font-size: 13px; }

.pips { display: flex; gap: 5px; }
.pip { width: 22px; height: 5px; background: var(--line); }
.pip.done { background: var(--green); }
.pip.cur  { background: var(--amber); box-shadow: 0 0 8px var(--amber); }

.chip-score {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 11px 16px;
}
.chip-score .star { color: var(--amber); }
.chip-score .l {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--muted);
}
.chip-score .v {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 17px;
  color: var(--green-bright);
}

.chip-timer {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 11px 15px;
  color: var(--text);
}
.chip-timer .t {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 1px;
}
.chip-timer.low .t { color: var(--amber); }

.exit-btn {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--muted);
  background: rgba(5,8,7,.74);
  border: 1px solid var(--line);
  padding: 12px 15px;
  cursor: pointer;
  backdrop-filter: blur(6px);
}
.exit-btn:hover { color: var(--amber); border-color: rgba(242,180,65,.4); }

/* ── Game label (bottom-left) ───────────────────────────── */
.gamelbl {
  position: fixed;
  left: 18px;
  bottom: 18px;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 11px;
  background: rgba(5,8,7,.74);
  border: 1px solid var(--line);
  padding: 11px 15px;
  backdrop-filter: blur(6px);
}
.gamelbl .ic { color: var(--green); }
.gamelbl .k {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--muted);
}
.gamelbl .v { font-size: 14px; font-weight: 700; letter-spacing: .5px; }

/* ── Map dock (bottom-right) ────────────────────────────── */
.mapdock {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 50;
  width: 360px;
  background: rgba(5,8,7,.88);
  border: 1px solid var(--line-strong);
  backdrop-filter: blur(8px);
  box-shadow: 0 14px 50px rgba(0,0,0,.5);
  transition: width .28s cubic-bezier(.2,.8,.2,1), opacity .25s;
}
.mapdock.is-loading {
  opacity: 0;
  pointer-events: none;
}
.mapdock:hover, .mapdock.open { width: 560px; }

.mapdock-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 14px;
  border-bottom: 1px solid var(--line);
}
.mapdock-head h2 {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--green);
}
.mapdock-head .exp {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 1px;
  color: var(--muted-2);
}

.map-wrap {
  position: relative;
  height: 200px;
  overflow: hidden;
  transition: height .28s cubic-bezier(.2,.8,.2,1);
}
.mapdock:hover .map-wrap, .mapdock.open .map-wrap { height: 360px; }

/* Map overlays */
.map-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: rgba(5,8,7,.75);
  backdrop-filter: blur(3px);
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--green);
}
.timeout-overlay { color: var(--amber); }

.proc-ring {
  width: 28px;
  height: 28px;
  border: 2px solid var(--line);
  border-top-color: var(--green);
  border-radius: 50%;
  animation: spin .8s linear infinite;
}
.proc-lbl { color: var(--green); }

/* ── Map dock footer ────────────────────────────────────── */
.mapdock-foot { padding: 12px 14px; border-top: 1px solid var(--line); }

.confirm {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
  font-family: inherit;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #06120b;
  background: var(--green);
  border: none;
  padding: 14px;
  cursor: pointer;
  clip-path: polygon(11px 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%,0 11px);
  box-shadow: 0 0 22px rgba(79,224,138,.3);
  transition: background .15s;
}
.confirm:hover:not(:disabled) { background: var(--green-bright); }
.confirm:disabled {
  background: var(--panel-2);
  color: var(--muted-2);
  box-shadow: none;
  cursor: not-allowed;
  clip-path: none;
  border: 1px dashed var(--line-strong);
}

/* Result bar */
.resultbar {}
.res-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 11px;
}
.res-pts .n {
  font-family: 'JetBrains Mono', monospace;
  font-size: 26px;
  font-weight: 700;
  color: var(--green-bright);
  line-height: 1;
}
.res-pts .u {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--muted);
  margin-top: 3px;
}
.res-mid { text-align: center; font-family: 'JetBrains Mono', monospace; }
.res-mid .nm { font-size: 12px; font-weight: 700; color: var(--text); }
.res-mid .k { font-size: 8px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--green); }
.res-dist { text-align: right; font-family: 'JetBrains Mono', monospace; }
.res-dist .n { font-size: 18px; font-weight: 700; color: var(--amber); }
.res-dist .u { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); }

.res-meter {
  height: 6px;
  background: var(--panel-2);
  border: 1px solid var(--line);
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;
}
.res-meter i {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  background: linear-gradient(90deg, var(--amber), var(--green));
  transition: width 1s cubic-bezier(.2,.8,.2,1);
}

.next {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
  font-family: inherit;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #06120b;
  background: var(--amber);
  border: none;
  padding: 13px;
  cursor: pointer;
  clip-path: polygon(11px 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%,0 11px);
  box-shadow: 0 0 22px rgba(242,180,65,.28);
}
.next:hover { filter: brightness(1.08); }

/* ── Between-rounds loader ──────────────────────────────── */
.round-loader {
  position: fixed;
  inset: 0;
  z-index: 120;
  background: rgba(5,8,7,.82);
  backdrop-filter: blur(6px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
.rl-ring {
  width: 56px;
  height: 56px;
  border: 2.5px solid var(--line);
  border-top-color: var(--green);
  border-radius: 50%;
  animation: spin .9s linear infinite;
}
.rl-t {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--green);
}
.rl-bar {
  width: 160px;
  height: 3px;
  background: var(--line);
  overflow: hidden;
}
.rl-fill {
  height: 100%;
  background: var(--green);
  animation: pulse-bar 1.2s ease-in-out infinite;
}

/* ── Summary overlay ────────────────────────────────────── */
.summary {
  position: fixed;
  inset: 0;
  z-index: 120;
  background: rgba(5,8,7,.93);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.sum-card {
  width: 640px;
  max-width: 100%;
  max-height: calc(100vh - 80px);
  overflow: hidden auto;
  scrollbar-width: none;
  background: var(--panel);
  border: 1px solid var(--line-strong);
  padding: 34px 38px 32px;
}
.sum-card::-webkit-scrollbar { display: none; }
.sum-kick {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--green);
  margin-bottom: 8px;
}
.sum-card h2 { font-size: 34px; font-weight: 700; letter-spacing: .5px; margin-bottom: 4px; }
.sum-rank {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--amber);
  margin-bottom: 24px;
}
.sum-total {
  display: flex;
  align-items: baseline;
  gap: 12px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: 18px 0;
  margin-bottom: 18px;
}
.sum-total .n {
  font-family: 'JetBrains Mono', monospace;
  font-size: 48px;
  font-weight: 700;
  color: var(--green-bright);
  line-height: 1;
}
.sum-total .max {
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  color: var(--muted);
}
.sum-total .u {
  margin-left: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--muted);
  text-align: right;
  line-height: 1.7;
}
.sum-list { display: flex; flex-direction: column; gap: 7px; margin-bottom: 26px; }
.sum-r {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 14px;
  padding: 10px 13px;
  background: var(--panel-2);
  border: 1px solid var(--line);
}
.sum-r .i { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--muted); }
.sum-r .nm { font-size: 14px; font-weight: 600; }
.sum-r .p { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 700; color: var(--green-bright); }

.sum-cta { display: flex; gap: 12px; }
.sum-cta button {
  flex: 1;
  font-family: inherit;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 15px;
  cursor: pointer;
  border: none;
  clip-path: polygon(11px 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%,0 11px);
}
.sum-cta .again {
  color: #06120b;
  background: var(--green);
  box-shadow: 0 0 22px rgba(79,224,138,.3);
}
.sum-cta .again:hover { background: var(--green-bright); }
.sum-cta .home {
  color: var(--muted);
  background: transparent;
  border: 1px solid var(--line-strong);
  clip-path: none;
}
.sum-cta .home:hover { color: var(--green); border-color: var(--green); }

/* ── Mod info panel ─────────────────────────────────────── */
.mod-info {
  position: fixed;
  bottom: 4px;
  left: 4px;
  background: rgba(5,8,7,.9);
  color: var(--green);
  padding: 10px 14px;
  z-index: 200;
  border: 1px solid var(--line-strong);
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
}
.mod-label { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
.mod-hint { font-size: 9px; color: var(--muted-2); margin-top: 6px; }

/* ── Transitions ────────────────────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: opacity .35s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── Keyframes ──────────────────────────────────────────── */
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse-bar {
  0%, 100% { width: 20%; transform: translateX(0); }
  50% { width: 60%; transform: translateX(100px); }
}

/* ── Mobile scrim ───────────────────────────────────────── */
.mob-scrim {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 48;
  background: rgba(5,8,7,.5);
  backdrop-filter: blur(2px);
  opacity: 0;
  pointer-events: none;
  transition: opacity .28s;
}

/* ── Bottom sheet handle (mobile) ───────────────────────── */
.handle-zone {
  display: none;
  padding: 10px 0 4px;
  justify-content: center;
  cursor: grab;
  touch-action: none;
}
.handle {
  width: 42px;
  height: 5px;
  border-radius: 3px;
  background: var(--line-strong);
}

/* ── Sheet-hidden game label ────────────────────────────── */
.gamelbl.sheet-hidden {
  opacity: 0;
  pointer-events: none;
}

/* ── Mobile ─────────────────────────────────────────────── */
@media (max-width: 640px) {
  /* Safe area top for notch */
  .topbar {
    top: max(10px, env(safe-area-inset-top));
    left: 10px;
    right: 10px;
    gap: 6px;
  }
  .chip-brand { display: none; }
  .pips { display: none; }

  .chip-round { padding: 9px 11px; gap: 7px; }
  .round-lbl { font-size: 9px; }
  .round-lbl b { font-size: 11px; }

  .chip-score { padding: 9px 11px; gap: 6px; }
  .chip-score .l { display: none; }
  .chip-score .v { font-size: 14px; }

  .chip-timer { padding: 9px 10px; gap: 6px; }
  .chip-timer .t { font-size: 13px; }

  .exit-btn { padding: 9px 12px; font-size: 10px; letter-spacing: 1px; }

  /* Game label: bottom-left, fades when sheet is full */
  .gamelbl {
    bottom: calc(120px + env(safe-area-inset-bottom, 0px));
    transition: opacity .2s;
  }

  /* Mobile scrim */
  .mob-scrim { display: block; }
  .mob-scrim.visible { opacity: 1; pointer-events: auto; }

  /* Show drag handle */
  .handle-zone { display: flex; }

  /* Map dock: full-width bottom sheet */
  .mapdock {
    left: 0;
    right: 0;
    bottom: 0;
    width: auto;
    border-left: none;
    border-right: none;
    border-bottom: none;
    transition: opacity .25s;
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
  /* Disable hover-expand on touch */
  .mapdock:hover { width: auto; }
  .mapdock-head .exp { display: none; }
  .map-wrap { height: 180px; }
  .mapdock:hover .map-wrap { height: 180px; }
  .mapdock.open .map-wrap,
  .mapdock.sheet-full .map-wrap { height: 280px; }

  .mapdock-foot { padding: 10px 12px; }
  .confirm { font-size: 14px; padding: 13px; letter-spacing: 1.5px; }
  .next { font-size: 14px; padding: 12px; letter-spacing: 1.5px; }

  .res-pts .n { font-size: 22px; }
  .res-dist .n { font-size: 15px; }

  /* Summary: full-screen, compact */
  .summary { padding: 0; align-items: stretch; }
  .sum-card {
    width: 100%;
    max-height: 100dvh;
    padding: 22px 18px calc(18px + env(safe-area-inset-bottom, 0px));
    border: none;
  }
  .sum-kick { font-size: 10px; margin-bottom: 6px; }
  .sum-card h2 { font-size: 26px; }
  .sum-rank { font-size: 11px; margin-bottom: 14px; }
  .sum-total { padding: 12px 0; margin-bottom: 14px; }
  .sum-total .n { font-size: 40px; }
  .sum-total .max { font-size: 13px; }
  .sum-list { gap: 5px; margin-bottom: 16px; }
  .sum-r { padding: 9px 11px; gap: 10px; }
  .sum-r .nm { font-size: 13px; }
  .sum-r .p { font-size: 14px; }
  .sum-cta button { font-size: 13px; padding: 13px; }
}
</style>
