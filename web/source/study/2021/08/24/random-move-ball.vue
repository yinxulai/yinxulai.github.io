<template>
  <div class="perlin-noise">
    <canvas ref="canvasRef" class="canvas" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useColorPlane } from './use-gray-plane'
import { useCurvedPlane } from './use-curved-plane'
import { useCanvasRenderer } from '@hooks/use-canvas-renderer'

const canvasRef = ref<HTMLCanvasElement>()
const canvasRenderer = useCanvasRenderer(canvasRef, '2d')

const colorPlane = useColorPlane(canvasRef)
const curvedPlane = useCurvedPlane(canvasRef)
canvasRenderer.setRender((ctx) => colorPlane.render())

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
