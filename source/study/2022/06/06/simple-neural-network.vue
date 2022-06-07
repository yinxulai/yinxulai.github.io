<template>
  <div class="simple-neural-network">
    simple-neural-network
    <canvas ref="canvasRef" class="canvas"></canvas>
  </div>
</template>
<script lang="ts" setup>

type Vector2D = [number, number, number]
type Vector3D = [number, number, number]
type Vector4D = [number, number, number, number]

const trainingDataList: Vector3D[] = [[0, 0, 1], [1, 1, 1], [1, 0, 1], [0, 1, 1]]
const trainingTargetList: Vector4D = [0, 1, 1, 0]

const weightList: Vector3D = new Array(3)
  .fill(0)
  .map(() => Math.random() * 2 - 1) as Vector3D

function fp(input: Vector3D, weight: Vector3D) {
  // 向量的点乘
  const value = input.reduce((acc, current, index) => {
    acc += current * weight[index]
    return acc
  }, 0)

  // sigmoid 激活函数
  return 1 / (1 + Math.exp(-value))
}

function bp(target: number, output: number) {
  // 误差
  const error = target - output
  // sigmoid 求导
  const slope = output * (1 - output)
  // 误差 * 偏导
  const result = error * slope
  return result
}

for (let index = 0; index < 10000; index++) {
  // 随机从训练数据里取出数据
  const trainingDataIndex = Math.floor(Math.random() * 4)
  const trainingData = trainingDataList[trainingDataIndex]
  const trainingTarget = trainingTargetList[trainingDataIndex]

  const output = fp(trainingData, weightList)
  const delta = bp(trainingTarget, output)

  // 更新权重
  for (let index = 0; index < weightList.length; index++) {
    const weight = weightList[index]
    const newWeight = weight + weight * delta
    weightList[index] = +newWeight.toFixed(8)
  }
}

console.log(weightList)

</script>
<style lang="less" scoped>
.simple-neural-network {
  .canvas {
    width: 50rem;
    height: 50rem;
    overflow: hidden;
    border-radius: 10px;
  }
}
</style>
