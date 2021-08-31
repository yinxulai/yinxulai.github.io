<template>
  <div class="perlin-noise">
    <canvas ref="canvasRef" class="canvas" />
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useColorPlane } from './use-gray-plane'
import { useCurvedPlane } from './use-curved-plane'
const canvasRef = ref<HTMLCanvasElement>()

const colorPlane = useColorPlane(canvasRef)
const curvedPlane = useCurvedPlane(canvasRef)

const resetSize = (canvas: HTMLCanvasElement) => {
  if (canvas == null) return
  const clientRect = canvas.getBoundingClientRect()
  canvas.height = clientRect.height
  canvas.width = clientRect.width
}

const drawFrame = (canvas: HTMLCanvasElement) => {
  if (canvas != null) curvedPlane.render()
  requestAnimationFrame(() => drawFrame(canvas))
}

watch(
  () => canvasRef.value,
  () => {
    if (canvasRef.value != null) {
      resetSize(canvasRef.value)
      drawFrame(canvasRef.value)
    }
  }
)
</script>
<style lang="less" scoped>
.perlin-noise,
.canvas {
  width: 50rem;
  height: 30rem;
  overflow: hidden;
  border-radius: 10px;
}
</style>
