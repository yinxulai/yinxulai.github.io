<template>
  <div class="noise-line-afterimage">
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
  const { width, height } = size
  const maxLineLength = Math.min(width, height) / 2
  const lineAngle = noise3D(0, 0, noiseOffset.value) * 4
  const centerPointX = noise3D(0, 0, noiseOffset.value + 10) * (width * 0.1) + width / 2
  const centerPointY = noise3D(0, 0, noiseOffset.value + 100) * (height * 0.1) + height / 2
  const lineLength = noise3D(0, 0, noiseOffset.value + 1000) * maxLineLength + maxLineLength

  const reversedLineAngle = (lineAngle + 180) % 360
  const formX = centerPointX + Math.cos(reversedLineAngle) * lineLength
  const formY = centerPointY + Math.sin(reversedLineAngle) * lineLength
  const toX = centerPointX + Math.cos(lineAngle) * lineLength
  const toY = centerPointY + Math.sin(lineAngle) * lineLength

  ctx.fillStyle = 'rgba(0,0,0,0.1)'
  ctx.fillRect(0, 0, width, height)

  ctx.strokeStyle = '#ffffff'
  ctx.lineCap = 'round'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(formX, formY)
  ctx.lineTo(toX, toY)
  ctx.stroke()
})
</script>
<style lang="less" scoped>
.noise-line-afterimage,
.canvas {
  width: 50rem;
  height: 16rem;
  overflow: hidden;
  border-radius: 10px;
}
</style>
