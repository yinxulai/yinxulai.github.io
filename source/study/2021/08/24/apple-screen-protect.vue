<template>
  <div class="screen-protect">
    <canvas ref="canvasRef" class="canvas" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { makeNoise3D } from 'fast-simplex-noise'
import { useCanvasRenderer } from '@hooks/use-canvas-renderer'

let zOffset = ref(0.01)
const angleNoise = makeNoise3D()
const colorNoise = makeNoise3D()
const canvasRef = ref<HTMLCanvasElement>()
const canvasRenderer = useCanvasRenderer(canvasRef, '2d')

const maxLineWidth = 4
const maxLineLength = 30
const canvasPadding = 0 // maxLineLength + maxLineWidth / 2

canvasRenderer.onRender(({ context, size }) => {
  zOffset.value += 0.0003
  context.clearRect(0, 0, size.width, size.height)

  for (let x = canvasPadding; x <= size.width - canvasPadding; x += 20) {
    for (let y = canvasPadding; y <= size.height - canvasPadding; y += 20) {
      const angle = angleNoise(x * 0.001, y * 0.001, zOffset.value * 10) * 5
      const color = colorNoise(x * 0.001, y * 0.001, zOffset.value) * 300
      const toX = x + Math.cos(angle) * maxLineLength
      const toY = y + Math.sin(angle) * maxLineLength

      const linearGradient = context.createLinearGradient(x, y, toX, toY)
      linearGradient.addColorStop(1, `hsla(${color}, 40%,40%, 1)`)
      linearGradient.addColorStop(0, 'hsla(0,0%,0%,0)')
      context.strokeStyle = linearGradient

      context.lineWidth = maxLineWidth
      context.lineCap = 'round'

      context.beginPath()
      context.moveTo(x, y)
      context.lineTo(toX, toY)
      context.stroke()
    }
  }
})
</script>
<style lang="less" scoped>
.screen-protect {
  .canvas {
    width: 50rem;
    height: 30rem;
    overflow: hidden;
    border-radius: 10px;
    background-color: black;
  }
}
</style>
