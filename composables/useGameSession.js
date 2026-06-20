import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

export function useGameSession({ onImagesReady, onScreenshotChange } = {}) {
  const router = useRouter()

  const screenshot = ref(null)
  const result = ref(null)
  const score = ref(0)
  const hasGuessed = ref(false)
  const isLoadingInitial = ref(true)
  const isLoadingNextLevel = ref(false)
  const screenshotLoaded = ref(false)
  const mapLoaded = ref(false)
  const pendingGuess = ref(null)
  const showSummary = ref(false)

  const activeSession = ref(null)
  const sessionData = ref({ currentRound: 0, maxRounds: 5, totalScore: 0 })
  const sessionRounds = ref([])
  const sessionComplete = ref(false)
  const sessionSettings = ref(null)
  const roundTimeLimit = ref(0)

  const imagesLoaded = computed(() => screenshotLoaded.value && mapLoaded.value)
  const dockIsLoading = computed(() => isLoadingInitial.value || !imagesLoaded.value)

  const totalScore = computed(() =>
    activeSession.value ? sessionData.value.totalScore : score.value
  )

  const isLastRound = computed(() => {
    const max = sessionData.value.maxRounds
    return max > 0 && sessionData.value.currentRound >= max
  })

  // Uses power of 2, matching the server-side scoring curve in guess.post.js
  const accuracy = computed(() => {
    if (!result.value?.correctLocation || !pendingGuess.value) return 0
    const dx = pendingGuess.value.x - result.value.correctLocation.x
    const dy = pendingGuess.value.y - result.value.correctLocation.y
    const distance = Math.hypot(dx, dy)
    const perfectRadius = 3
    const maxDistance = 50
    if (distance <= perfectRadius) return 100
    if (distance > maxDistance) return 0
    return Math.max(0, 100 * (1 - Math.pow((distance - perfectRadius) / (maxDistance - perfectRadius), 2)))
  })

  const RANKS = [
    { threshold: 0.85, name: 'MASTER CHIEF', flavor: 'Finish the fight. You always do.', cls: 'chief' },
    { threshold: 0.60, name: 'SPARTAN-II',   flavor: 'Enhanced. Battle-hardened. Lethal.', cls: 'spartan' },
    { threshold: 0.35, name: 'ODST TROOPER', flavor: 'Hell dropped in. Good work.', cls: 'odst' },
    { threshold: 0,    name: 'FIELD SCOUT',  flavor: 'The battlefield awaits, soldier.', cls: 'scout' },
  ]

  const rank = computed(() => {
    const pct = totalScore.value / (sessionData.value.maxRounds * 1000)
    return RANKS.find(r => pct > r.threshold) ?? RANKS[RANKS.length - 1]
  })

  const gameState = computed(() => {
    if (showSummary.value) return 'summary'
    if (!screenshot.value || isLoadingInitial.value) return 'loading'
    if (result.value) return 'result'
    return 'active'
  })

  watch(screenshot, () => {
    screenshotLoaded.value = false
    mapLoaded.value = false
    pendingGuess.value = null
    result.value = null
    onScreenshotChange?.()
  })

  watch(imagesLoaded, (loaded) => {
    if (loaded) {
      isLoadingNextLevel.value = false
      isLoadingInitial.value = false
      onImagesReady?.(roundTimeLimit.value)
    }
  })

  async function loadSession(sessionId) {
    activeSession.value = sessionId
    isLoadingInitial.value = true
    sessionComplete.value = false
    try {
      const res = await fetch(`/api/sessions/${sessionId}`)
      const data = await res.json()
      if (data.error) { router.push('/'); return }
      sessionSettings.value = data.settings
      sessionData.value = {
        currentRound: data.currentRound,
        maxRounds: data.maxRounds,
        totalScore: data.totalScore,
      }
      sessionRounds.value = data.rounds || []
      roundTimeLimit.value = parseInt(data.settings?.timeLimit, 10) || 0
      if (data.isComplete) {
        sessionComplete.value = true
        showSummary.value = true
        isLoadingInitial.value = false
      } else {
        await fetchScreenshot(sessionId)
      }
    } catch {
      router.push('/')
      isLoadingInitial.value = false
    }
  }

  async function fetchScreenshot(sessionId = null) {
    if (!isLoadingInitial.value) isLoadingNextLevel.value = true
    hasGuessed.value = false
    screenshotLoaded.value = false
    mapLoaded.value = false
    try {
      const endpoint = sessionId
        ? `/api/levels/random?sessionId=${sessionId}`
        : '/api/levels/random'
      const res = await fetch(endpoint)
      const data = await res.json()
      if (data.error) {
        isLoadingInitial.value = false
        isLoadingNextLevel.value = false
        if (sessionId && data.sessionComplete) { showSummary.value = true; return }
        if (!sessionId && sessionData.value.currentRound > 0) {
          sessionComplete.value = true
          sessionData.value.totalScore = score.value
          showSummary.value = true
        } else { router.push('/') }
        return
      }
      screenshot.value = data
      if (data.sessionData) {
        roundTimeLimit.value = parseInt(data.sessionData.timeLimit, 10) || 0
        if (sessionId) {
          sessionData.value.currentRound = data.sessionData.currentRound
          sessionData.value.maxRounds = data.sessionData.maxRounds
        } else {
          sessionData.value.currentRound++
        }
      } else {
        roundTimeLimit.value = 0
        if (!sessionId) sessionData.value.currentRound++
      }
    } catch {
      isLoadingInitial.value = false
      isLoadingNextLevel.value = false
      router.push('/')
    }
  }

  async function confirmGuess() {
    if (hasGuessed.value) return
    hasGuessed.value = true
    try {
      const body = { id: screenshot.value.id, guess: pendingGuess.value }
      if (activeSession.value) body.sessionId = activeSession.value
      const res = await fetch('/api/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.error) { hasGuessed.value = false; return }
      result.value = data
      const roundEntry = {
        round_number: sessionData.value.currentRound,
        score: data.score,
        level_id: screenshot.value.id,
        mapName: screenshot.value.maps?.name || data.mapName || '',
      }
      if (activeSession.value && data.sessionData) {
        sessionData.value = {
          currentRound: data.sessionData.currentRound,
          maxRounds: data.sessionData.maxRounds,
          totalScore: data.sessionData.totalScore,
        }
        sessionRounds.value.push(roundEntry)
        if (data.sessionData.isComplete) sessionComplete.value = true
      } else if (!activeSession.value) {
        score.value += data.score
        sessionRounds.value.push(roundEntry)
        if (sessionData.value.currentRound >= sessionData.value.maxRounds) {
          sessionComplete.value = true
          sessionData.value.totalScore = score.value
        }
      }
    } catch { hasGuessed.value = false }
  }

  function nextScreenshot() {
    if (sessionComplete.value) { showSummary.value = true; return }
    result.value = null
    pendingGuess.value = null
    fetchScreenshot(activeSession.value)
  }

  function initQuickPlay() {
    sessionData.value = { currentRound: 0, maxRounds: 5, totalScore: 0 }
    sessionRounds.value = []
    score.value = 0
    sessionComplete.value = false
    showSummary.value = false
    roundTimeLimit.value = 0
    fetchScreenshot()
  }

  return {
    screenshot, result, hasGuessed,
    isLoadingInitial, isLoadingNextLevel,
    screenshotLoaded, mapLoaded, imagesLoaded, dockIsLoading,
    pendingGuess, showSummary,
    activeSession, sessionData, sessionRounds, sessionComplete, sessionSettings,
    roundTimeLimit,
    totalScore, isLastRound, accuracy, rank, gameState,
    loadSession, fetchScreenshot, confirmGuess, nextScreenshot, initQuickPlay,
  }
}
