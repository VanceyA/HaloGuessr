import { ref, computed } from 'vue'

export function useRoundTimer({ onTimeout }) {
  const timeLeft = ref(0)
  let intervalId = null

  const formattedTimeLeft = computed(() => {
    const m = Math.floor(timeLeft.value / 60)
    const s = timeLeft.value % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  })

  function start(limit) {
    stop()
    if (limit <= 0) return
    timeLeft.value = limit
    intervalId = setInterval(() => {
      timeLeft.value--
      if (timeLeft.value <= 0) {
        stop()
        onTimeout()
      }
    }, 1000)
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  return { timeLeft, formattedTimeLeft, start, stop }
}
