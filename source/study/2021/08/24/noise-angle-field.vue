<template>
  <div class="noise-angle-field">
    <canvas ref="canvasRef" class="canvas" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { makeNoise3D } from 'fast-simplex-noise'
import { useCanvasRenderer } from '@hooks/use-canvas-renderer'

const gridSize = 20
const lineLength = 10
const canvasPadding = 20
const noise3D = makeNoise3D()
const noiseOffset = ref<number>(0)
const canvasRef = ref<HTMLCanvasElement>()
const canvasRenderer = useCanvasRenderer(canvasRef, '2d')

canvasRenderer.onRender((ctx, { size }) => {
  noiseOffset.value += 0.01
  ctx.clearRect(0, 0, size.width, size.height)
  for (let x = canvasPadding; x < size.width - canvasPadding; x += gridSize) {
    for (let y = canvasPadding; y < size.height - canvasPadding; y += gridSize) {
      const angle = noise3D(x * 0.0005, y * 0.0005, noiseOffset.value) * 5
      const toX = x + Math.cos(angle) * lineLength
      const toY = y + Math.sin(angle) * lineLength
      ctx.strokeStyle = '#ffffff'
      ctx.lineCap = 'round'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(toX, toY)
      ctx.stroke()
    }
  }
})
</script>
<style lang="less" scoped>
.noise-angle-field {
  .canvas {
    width: 50rem;
    height: 16rem;
    overflow: hidden;
    border-radius: 10px;
  }
}
</style>
