<template>
  <div class="screen-protect">
    <canvas ref="canvasRef" class="canvas" />
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useLineSegment } from './use-line-segment'

const canvasRef = ref<HTMLCanvasElement>()

const resetSize = (canvas: HTMLCanvasElement) => {
  if (canvas == null) return
  const clientRect = canvas.getBoundingClientRect()
  canvas.height = clientRect.height
  canvas.width = clientRect.width
}

const lineSegment = useLineSegment(canvasRef)
const drawFrame = (canvas: HTMLCanvasElement) => {
  lineSegment.render()
  requestAnimationFrame(() => drawFrame(canvas))
}

watch([canvasRef], () => {
  if (canvasRef.value != null) {
    drawFrame(canvasRef.value)
    resetSize(canvasRef.value)
  }
})

</script>
<style lang="less" scoped>
.screen-protect,
.canvas {
  width: 40rem;
  height: 24rem;
  overflow: hidden;
  background: white;
  border-radius: 10px;
}
</style>
