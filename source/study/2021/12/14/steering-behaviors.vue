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

const agent = new Agent(100, 100)

const noise3D = makeNoise3D()
const noiseOffset = ref<number>(0)
const canvasRef = ref<HTMLCanvasElement>()
const canvasRenderer = useCanvasRenderer(canvasRef, '2d')

const renderAgent = (context: CanvasRenderingContext2D, agent: Agent) => {
  if (!Number.isSafeInteger(agent.position.x)) {
    console.log('zale')
  }

  context.beginPath()
  context.lineWidth = 1
  context.strokeStyle = 'rgba(0,0,0,.3)'
  context.arc(agent.position.x, agent.position.y, 10, 0, Math.PI * 2, false)
  context.stroke()

  context.fillStyle = 'rgba(0,0,0,.08)'
  context.fill()
}

canvasRenderer.onRender(({ context, size }) => {
  noiseOffset.value += 0.01
  const { width, height } = size
  const x = noise3D(0, 0, noiseOffset.value + 10)
  const y = noise3D(10, 10, noiseOffset.value + 100)

  agent.applyAcceleration(new Vector2D(x, y))
  context.fillStyle = 'rgb(255,255,255)'
  context.fillRect(0, 0, width, height)
  renderAgent(context, agent)
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
