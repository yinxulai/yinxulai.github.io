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
import { Vector2D } from './libs/vector'

const carAgent = ref<CarAgent>()
const noiseOffset = ref<number>(0)
const canvasRef = ref<HTMLCanvasElement>()
const mousePosition = useMousePosition(canvasRef)
const canvasRenderer = useCanvasRenderer(canvasRef, '2d')

const target1 = new Vector2D(0,1)
console.log('target1', target1.heading())
console.log('target1.limitMag', target1.limitMag(1))

const target5 = new Vector2D(3, 4)
console.log('target5.limitMag', target5.limitMag(1))

const target2 = new Vector2D(-1,0)
console.log('target2.limitHeading', target2.limitHeading(Math.PI / 2))

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

  carAgent.value.seek(target).render(context)
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
