<template>
  <div class="steering-behaviors">
    <canvas ref="canvasRef" class="canvas" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { makeNoise3D } from 'fast-simplex-noise'
import { useCanvasRenderer } from '@hooks/use-canvas-renderer'
import { Agent } from './libs/agent'
import { Vector2D } from './libs/vector'

const noise3D = makeNoise3D()
const agent = ref<Agent>()
const noiseOffset = ref<number>(0)
const canvasRef = ref<HTMLCanvasElement>()
const canvasRenderer = useCanvasRenderer(canvasRef, '2d')

canvasRenderer.onRender(({ context, size }) => {
  if (agent.value == null) {
    agent.value = new Agent(size.width / 2, size.height / 2)
  }

  noiseOffset.value += 0.01
  const { width, height } = size
  context.fillStyle = 'rgb(255,255,255)'
  context.fillRect(0, 0, width, height)

  const x = noise3D(0, 0, noiseOffset.value + 10)
  const y = noise3D(10, 10, noiseOffset.value + 100)

  agent.value.applyAcceleration(new Vector2D(x, y)).update().render(context)
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
