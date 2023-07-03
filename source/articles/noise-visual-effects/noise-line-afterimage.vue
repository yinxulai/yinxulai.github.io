<template>
  <div class="noise-line-afterimage">
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

canvasRenderer.onRender(({ context, size }) => {
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

  context.fillStyle = 'rgba(0,0,0,0.1)'
  context.fillRect(0, 0, width, height)

  context.strokeStyle = '#ffffff'
  context.lineCap = 'round'
  context.lineWidth = 1
  context.beginPath()
  context.moveTo(formX, formY)
  context.lineTo(toX, toY)
  context.stroke()
})
</script>
<style lang="less" scoped>
.noise-line-afterimage {
  .canvas {
    width: 50rem;
    height: 16rem;
    overflow: hidden;
    border-radius: 10px;
  }
}
</style>
