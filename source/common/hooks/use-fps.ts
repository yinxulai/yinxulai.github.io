
import { onMounted, onUnmounted, createRef } from 'airx'

export function useFPS() {
  const fps = createRef<string>('0')
  const frameRequest = createRef<number>(0)
  const recentTimeList = createRef<number[]>([])

  const computedFPS = () => {
    if (recentTimeList.value.length === 10) {
      const average = recentTimeList.value.reduce((acc, t) => acc + t, 0) / 10
      fps.value = (1000 / average).toFixed(2)
    }

    setTimeout(computedFPS, 500)
  }

  const onFrame = (last = Date.now()) => {
    const now = Date.now()
    if (recentTimeList.value.length >= 10) {
      recentTimeList.value.shift()
    }

    recentTimeList.value.push(now - last)
    frameRequest.value = requestAnimationFrame(() => onFrame(now))
  }

  onMounted(() => {
    onFrame()
    computedFPS()
  })
  
  onUnmounted(() => {
    cancelAnimationFrame(frameRequest.value)
  })

  return fps
}
