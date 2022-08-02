<template>
  <div class="biology-avoidance">
    <canvas ref="canvasRef" class="canvas"></canvas>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useCanvasRenderer } from '@hooks/use-canvas-renderer'

const canvasRef = ref<HTMLCanvasElement>()
const canvasRenderer = useCanvasRenderer(canvasRef, '2d')

canvasRenderer.onRender(({ context, size, stop }) => {

})
</script>
<style lang="less" scoped>
.biology-avoidance {
  .canvas {
    width: 50rem;
    height: 50rem;
    overflow: hidden;
    border-radius: 10px;
  }
}
</style>
