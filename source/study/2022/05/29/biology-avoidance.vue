<template>
  <div class="biology-avoidance">
    <canvas ref="canvasRef" class="canvas"></canvas>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import * as tf from '@tensorflow/tfjs'
import { useCanvasRenderer } from '@hooks/use-canvas-renderer'

const canvasRef = ref<HTMLCanvasElement>()
const canvasRenderer = useCanvasRenderer(canvasRef, '2d')

const model = tf.sequential()
model.add(tf.layers.dense({
  units: 1,
  inputShape: [2],
  activation: 'sigmoid'
}))

model.compile({
  loss: tf.losses.logLoss,
  optimizer: tf.train.adam(0.1)
})

// model.fit({
  
// })

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
