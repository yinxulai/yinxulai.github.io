<template>
  <span>{{ fps }} fps/s</span>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'

const fps = ref<string>('0')
const isUnmounted = ref<boolean>(false)
const recentTimeList = ref<number[]>([])

const computedFPS = () => {
  if (isUnmounted.value) return
  if (recentTimeList.value.length === 10) {
    const average = recentTimeList.value.reduce((acc, t) => acc + t, 0) / 10
    fps.value = (1000 / average).toFixed(2)
  }

  setTimeout(computedFPS, 500)
}

const onFrame = (last = Date.now()) => {
  if (isUnmounted.value) return

  const now = Date.now()
  if (recentTimeList.value.length >= 10) {
    recentTimeList.value.shift()
  }

  recentTimeList.value.push(now - last)
  requestAnimationFrame(() => onFrame(now))
}

onMounted(() => {
  isUnmounted.value = false
  computedFPS()
  onFrame()
})

onUnmounted(() => {
  isUnmounted.value = true
})
</script>
