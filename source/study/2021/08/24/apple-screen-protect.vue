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

const maxLineWidth = 5
const maxLineLength = 60
const canvasPadding = maxLineLength + maxLineWidth / 2

canvasRenderer.onRender((cxt, { size }) => {
  zOffset.value += 0.001
  cxt.clearRect(0, 0, size.width, size.height)

  for (let x = canvasPadding; x <= size.width - canvasPadding; x += 20) {
    for (let y = canvasPadding; y <= size.height - canvasPadding; y += 20) {
      const angle = angleNoise(x * 0.0005, y * 0.0005, zOffset.value) * 5
      const color = colorNoise(x * 0.0002, y * 0.0002, zOffset.value) * 360
      const toX = x + Math.cos(angle) * maxLineLength
      const toY = y + Math.sin(angle) * maxLineLength

      const linearGradient = cxt.createLinearGradient(x, y, toX, toY)
      linearGradient.addColorStop(1, `hsla(${color}, 40%,40%, 1)`)
      linearGradient.addColorStop(0, 'hsla(0,0%,0%,0)')
      cxt.strokeStyle = linearGradient

      cxt.lineWidth = maxLineWidth
      cxt.lineCap = 'round'

      cxt.beginPath()
      cxt.moveTo(x, y)
      cxt.lineTo(toX, toY)
      cxt.stroke()
    }
  }
})
</script>
<style lang="less" scoped>
.screen-protect,
.canvas {
  width: 50rem;
  height: 30rem;
  overflow: hidden;
  border-radius: 10px;
}
</style>
