
import { onMounted, onUnmounted, ref } from 'vue'

export function useFPS() {
  const fps = ref<string>('0')
  const frameRequest = ref<number>(0)
  const recentTimeList = ref<number[]>([])

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
    if (__VUEPRESS_SSR__) return
    onFrame()
    computedFPS()
  })
  
  onUnmounted(() => {
    if (__VUEPRESS_SSR__) return
    cancelAnimationFrame(frameRequest.value)
  })

  return fps
}
