<template>
  <div class="simple-neural-network">
    <button @click="test11">
      测试
    </button>
  </div>
</template>
<script lang="ts" setup>
import { createWorkerPool } from '@hooks/use-worker'

const pool = createWorkerPool((params: { a: number, b: number }) => {
  return params.a + params.b
})

type Vector3D = [number, number, number]

const testChartData: Array<[number, number, number]> = [[0, 0, 0], [1, 1, 1]]

const trainingDataList: Vector3D[] = [[0, 0, 0], [0, 0, 1], [1, 1, 1], [1, 0, 1], [0, 1, 1]]
const trainingTargetList: number[] = [0, 0, 1, 1, 0]

function test11() {
  new Array(10000).fill(0).forEach(async (_, index) => {
    const worker = await pool.getWorker()
    const result = await worker.exec({ a: index, b: 0 }, [])
  })
}

function test222() {

  const weightList: Vector3D = new Array(3)
    .fill(0)
    .map(() => Math.random() * 2 - 1) as Vector3D

  // 正向传播
  function fp(input: Vector3D, weight: Vector3D) {
    // 向量的点乘
    const value = input.reduce((acc, current, index) => {
      acc += current * weight[index]
      return acc
    }, 0)

    // sigmoid 激活函数
    return 1 / (1 + Math.exp(-value))
  }

  // 反向传播
  function bp(target: number, output: number) {
    // 误差
    const error = target - output

    // sigmoid 在 output 的导数
    const slope = output * (1 - output)

    // 误差 * 偏导
    return error * slope
  }

  console.log(weightList)
  for (let index = 0; index < 4000; index++) {
    // 随机从训练数据里取出数据
    const trainingDataIndex = Math.floor(Math.random() * 4)
    const trainingData = trainingDataList[trainingDataIndex]
    const trainingTarget = trainingTargetList[trainingDataIndex]

    const output = fp(trainingData, weightList)
    const delta = bp(trainingTarget, output)

    // 更新权重
    for (let index = 0; index < weightList.length; index++) {
      const weight = weightList[index]
      const input = trainingData[index]
      const newWeight = weight + input * delta
      weightList[index] = +newWeight.toFixed(8)
    }
  }

  console.log(weightList)
  console.log(fp([1, 0, 0], weightList))

}

if (!__VUEPRESS_SSR__) {
  test222()
}

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
