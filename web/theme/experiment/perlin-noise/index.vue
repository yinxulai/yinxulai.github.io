<template>
  <div class="perlin-noise">
    <canvas ref="canvasRef" class="canvas" />
  </div>
</template>
<script lang="ts" setup>
import { useNoise } from './use-noise'
import { ref, watch, computed } from 'vue'

const canvasRef = ref<HTMLCanvasElement>()

const canvasContext = computed(() => {
  if (canvasRef.value == null) return null
  return canvasRef.value.getContext('2d')
})

const resetSize = (canvas: HTMLCanvasElement) => {
  if (canvas == null) return
  const clientRect = canvas.getBoundingClientRect()
  canvas.height = clientRect.height / 6
  canvas.width = clientRect.width / 6
}

const drawFrame = (canvas: HTMLCanvasElement) => {
  const offscreen = new OffscreenCanvas(canvas.width, canvas.height)
  const offscreenContext = offscreen.getContext('2d')
  if (offscreenContext == null) return

  if (canvasContext.value == null) return
  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      // const gray = useNoise(x, 255, 255)
      const gray = (Math.random() * 255) | 0
      const color = `rgb(${gray},${gray},${gray})`
      offscreenContext.fillStyle = color
      offscreenContext.fillRect(x, y, 1, 1)
    }
  }

  requestAnimationFrame(() => drawFrame(canvas))
  canvasContext.value.drawImage(offscreen, 0, 0, canvas.width, canvas.height)
}

watch(
  () => canvasRef.value,
  () => {
    if (canvasRef.value != null) {
      drawFrame(canvasRef.value)
    }
  }
)

watch(
  () => canvasRef.value,
  () => {
    if (canvasRef.value != null) {
      resetSize(canvasRef.value)
    }
  }
)
</script>
<style lang="less" scoped>
.perlin-noise,
.canvas {
  width: 40rem;
  height: 24rem;
  overflow: hidden;
  background: white;
  border-radius: 10px;
}
</style>
