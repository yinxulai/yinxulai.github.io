<template>
  <div class="perlin-noise">
    <canvas ref="canvasRef" class="canvas" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { makeNoise3D } from 'fast-simplex-noise'
import { useCanvasRenderer } from '@hooks/use-canvas-renderer'

const noise3D = makeNoise3D()
const noiseOffset = ref<number>(0)
const canvasRef = ref<HTMLCanvasElement>()
const canvasRenderer = useCanvasRenderer(canvasRef, '2d')

canvasRenderer.setRender((ctx, { size, stop }) => {
  noiseOffset.value += 0.01
  ctx.clearRect(0, 0, size.width, size.height)
  for (let x = 0; x < size.width; x++) {
    for (let y = 0; y < size.height; y++) {
      if (x <= size.width / 2) {
        const color = Math.fround(Math.random() * 255)
        ctx.fillStyle = `rgb(${color},${color},${color})`
        ctx.fillRect(x, y, 1, 1)
      } else {
        const color = Math.fround(noise3D(x * 0.005, y * 0.005, noiseOffset.value) * 120 + 100)
        ctx.fillStyle = `rgb(${color},${color},${color})`
        ctx.fillRect(x, y, 1, 1)
      }
    }
  }
  stop()
})
</script>
<style lang="less" scoped>
.perlin-noise,
.canvas {
  width: 50rem;
  height: 16rem;
  overflow: hidden;
  border-radius: 10px;
}
</style>
