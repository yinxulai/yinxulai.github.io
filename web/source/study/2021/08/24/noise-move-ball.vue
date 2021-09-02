<template>
  <div class="perlin-noise">
    <canvas ref="canvasRef" class="canvas" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { makeNoise2D } from 'fast-simplex-noise'
import { useCanvasRenderer } from '@hooks/use-canvas-renderer'

const noise2D = makeNoise2D()
const noiseOffset = ref<number>(0)
const canvasRef = ref<HTMLCanvasElement>()
const canvasRenderer = useCanvasRenderer(canvasRef, '2d')

canvasRenderer.setRender((ctx, size) => {
  ctx.beginPath()
  ctx.fillStyle = `rgba(0,0,0,0.5)`
  ctx.fillRect(0, 0, size.width, size.height)
  ctx.closePath()

  ctx.beginPath()
  noiseOffset.value += 0.005
  const noiseY = Math.abs(noise2D(10000, noiseOffset.value)) * size.height
  const noiseX = Math.abs(noise2D(10, noiseOffset.value)) * size.width
  const radius = Math.abs(noise2D(100000, noiseOffset.value)) * 20 + 6
  const color = Math.abs(noise2D(100000, noiseOffset.value)) * 360
  ctx.fillStyle = `hsla(${color},50%,50%,1)`
  ctx.arc(noiseX, noiseY, radius, 0, 360)
  ctx.fill()
  ctx.closePath()
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
