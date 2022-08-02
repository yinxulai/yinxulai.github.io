<template>
  <canvas ref="canvasRef" class="scatter-chart">
  </canvas>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import * as THREE from 'three'
import { useThreeRenderer } from '@hooks/use-three-renderer'

interface Props {
  type: 'scatter-chart'
  data: Array<[number, number, number]>
}

const props = defineProps<Props>()
const canvasRef = ref<HTMLCanvasElement>()
const threeRenderer = useThreeRenderer(canvasRef)

// 绘制轴
function axisRender(scene: THREE.Scene) {
  //显示坐标轴与平面
  const size = 10 * 2
  const divisions = 10
  const axesHelper = new THREE.AxesHelper(5)
  const gridHelper = new THREE.GridHelper(size, divisions)
  scene.add(gridHelper)
  scene.add(axesHelper)
}

// 绘制空间
function roomRender(scene: THREE.Scene) {

}

// 绘制数据
function dataRender(scene: THREE.Scene) {

}

// threeRenderer.onSetup(({ camera, scene, stop }) => {
//   const limit = 20
//   const generateRandomPts = (num: number) => {
//     return new Array(num).fill([]).map((val) => {
//       return {
//         x: Math.random() * limit * 2 - limit,
//         y: Math.random() * limit,
//         z: Math.random() * limit * 2 - limit,
//       }
//     })
//   }
//   scene.add(new THREE.AmbientLight(0xffffff, 0.5))
//   scene.add(new THREE.DirectionalLight(0xffffff, 0.5))
//   //显示坐标轴与平面
//   const axesHelper = new THREE.AxesHelper(5)
//   const size = limit * 2
//   const divisions = 10
//   const gridHelper = new THREE.GridHelper(size, divisions)
//   scene.add(gridHelper)
//   scene.add(axesHelper)

//   //生成随机空间点并绘制
//   const pts = generateRandomPts(25) //15个点
//   const drawPts = (points: typeof pts) => {
//     for (let pt of points) {
//       const geometry = new THREE.SphereGeometry(0.5 + pt.y / limit)
//       const mesh = new THREE.Mesh(
//         geometry,
//         new THREE.MeshLambertMaterial({
//           color: `hsl(${(pt.y * 360) / limit},50%,70%)`,
//         })
//       )
//       mesh.position.set(pt.x, pt.y, pt.z)
//       scene.add(mesh)
//     }
//   }

//   drawPts(pts)
// })

threeRenderer.onRender(({ camera, scene, stop }) => {
  // console.log('onRender')
})

</script>
<style lang="less" scoped>
.scatter-chart {
  width: 100%;
  height: 100%;
  background-color: white;
}
</style>
