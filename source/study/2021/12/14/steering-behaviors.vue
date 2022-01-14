<template>
  <div class="steering-behaviors">
    <canvas ref="canvasRef" class="canvas" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useMousePosition } from '@hooks/use-mouse-position'
import { useCanvasRenderer } from '@hooks/use-canvas-renderer'
import { CarAgent, TargetAgent } from './libs/agent'

const carAgent = ref<CarAgent>()
const noiseOffset = ref<number>(0)
const canvasRef = ref<HTMLCanvasElement>()
const mousePosition = useMousePosition(canvasRef)
const canvasRenderer = useCanvasRenderer(canvasRef, '2d')

canvasRenderer.onRender(({ context, size }) => {
  if (carAgent.value == null) {
    carAgent.value = new CarAgent(
      size.width / 2, 
      size.height / 2
    )
  }

  noiseOffset.value += 0.01
  const { width, height } = size
  context.fillStyle = 'rgb(255,255,255)'
  context.fillRect(0, 0, width, height)

  const target = new TargetAgent(
    mousePosition.value.offsetX, 
    mousePosition.value.offsetY
  )

  carAgent.value.flee(target)
  carAgent.value.cycle().render(context)
})
</script>
<style lang="less">
.steering-behaviors {
  .canvas {
    width: 50rem;
    height: 30rem;
    overflow: hidden;
    border-radius: 10px;
    background-color: white;
  }
}
</style>
