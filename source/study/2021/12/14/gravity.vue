CircleAgent<template>
  <div class="steering-behaviors">
    <canvas ref="canvasRef" class="canvas"></canvas>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useMousePosition } from '@hooks/use-mouse-position'
import { useCanvasRenderer } from '@hooks/use-canvas-renderer'

import { Vector2D } from '@math/vector'
import { World } from '@math/physics/simulation/world'
import { CircleAgent, TargetAgent } from '@math/physics/simulation/agent'

const canvasRef = ref<HTMLCanvasElement>()
const agentWorldRef = ref<World | null>()

const mousePosition = useMousePosition(canvasRef)
const canvasRenderer = useCanvasRenderer(canvasRef, '2d', {
  maxFPS: 60,
})

watch(canvasRef, (_, __, onInvalidate) => {
  if (canvasRef.value == null) return

  const handleClick = (event: MouseEvent) => {
    if (agentWorldRef.value == null) return

    if (event.altKey) {
      agentWorldRef.value.addAgent(
        new TargetAgent(
          Math.random() * 5 + 500,
          mousePosition.value.offsetX,
          mousePosition.value.offsetY
        )
      )

      return
    }

    agentWorldRef.value.addAgent(
      new CircleAgent(
        Math.random() * 5,
        mousePosition.value.offsetX,
        mousePosition.value.offsetY
      )
    )
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
  const { width, height } = size
  context.fillStyle = 'rgb(255,255,255)'
  context.fillRect(0, 0, width, height)
  if (agentWorldRef.value == null) {
    agentWorldRef.value = new World(
      width,
      height,
      new Vector2D(0, 0.1), // 重力
      0.3
    )
  }

  agentWorldRef.value.render(context)
})
</script>
<style lang="less" scoped>
.steering-behaviors {
  .canvas {
    width: 50rem;
    height: 20rem;
    overflow: hidden;
    border-radius: 10px;
    background-color: white;
  }
}
</style>
