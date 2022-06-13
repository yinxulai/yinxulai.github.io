<template>
  <div class="steering-behaviors">
    <canvas ref="canvasRef" class="canvas" />
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useMousePosition } from '@hooks/use-mouse-position'
import { useCanvasRenderer } from '@hooks/use-canvas-renderer'
import { CarAgent, TargetAgent } from './libs/agent'

const canvasRef = ref<HTMLCanvasElement>()
const carAgent = ref<CarAgent | null>(null)
const targetAgent = ref<TargetAgent | null>(null)
const mousePosition = useMousePosition(canvasRef)
const canvasRenderer = useCanvasRenderer(canvasRef, '2d', {
  maxFPS: 0.5,
})

watch(
  canvasRef,
  (_, __, onInvalidate) => {
    if (canvasRef.value == null) return
    const handleClick = (event: MouseEvent) => {
      if (event.altKey) {
        carAgent.value = new CarAgent(mousePosition.value.offsetX, mousePosition.value.offsetY)
      } else {
        targetAgent.value = new TargetAgent(
          mousePosition.value.offsetX,
          mousePosition.value.offsetY
        )
      }
    }

    canvasRef.value.addEventListener('click', handleClick)
    onInvalidate(() => {
      if (canvasRef.value == null) return
      canvasRef.value.removeEventListener('click', handleClick)
    })
  },
  { flush: 'post' }
)

canvasRenderer.onRender(({ context, size }) => {
  console.log('render')
  const { width, height } = size
  context.fillStyle = 'rgb(255,255,255)'
  context.fillRect(0, 0, width, height)
  if (targetAgent.value !== null) {
    targetAgent.value.render(context)
  }

  if (carAgent.value !== null) {
    carAgent.value.render(context)
  }

  if (carAgent.value !== null && targetAgent.value !== null) {
    carAgent.value.seek(targetAgent.value as any)
  }
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
