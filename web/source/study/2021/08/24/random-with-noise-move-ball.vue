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
  ctx.clearRect(0, 0, size.width, size.height)

  ctx.beginPath()
  ctx.fillStyle = '#ffffff'

  // 绘制随机位置的小球
  const randomX = Math.random() * (size.width / 2)
  const randomY = Math.random() * size.height
  ctx.arc(randomX, randomY, 10, 0, 360)

  noiseOffset.value += 0.001
  const noiseX = Math.abs(noise2D(10, noiseOffset.value)) * (size.width / 2) + size.width / 2
  const noiseY = Math.abs(noise2D(10000, noiseOffset.value)) * size.height
  ctx.arc(noiseX, noiseY, 10, 0, 360)

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
