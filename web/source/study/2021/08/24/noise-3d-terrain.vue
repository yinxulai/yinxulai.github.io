<template>
  <div class="noise-3d-terrain">
    <canvas ref="canvasRef" class="canvas" />
  </div>
</template>
<script lang="ts" setup>
import * as THREE from 'three'
import { ref, computed } from 'vue'
import { makeNoise2D } from 'fast-simplex-noise'
import { useThreeRenderer } from '@hooks/use-three-renderer'

const noise2D = makeNoise2D()
const noiseOffset = ref<number>(0)
const canvasRef = ref<HTMLCanvasElement>()
const threeRenderer = useThreeRenderer(canvasRef)

const plane = computed(() => {
  if (canvasRef.value == null) return null
  const { width, height } = canvasRef.value
  const geometry = new THREE.PlaneGeometry(width, height * 2, Math.fround(width), Math.fround(height * 2))
  const material = new THREE.MeshNormalMaterial({ flatShading: true })
  // const material = new THREE.MeshDepthMaterial()
  // const material = new THREE.LineBasicMaterial({ })
  return new THREE.Mesh(geometry, material)
})

const box = computed(() => {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshNormalMaterial()
  return new THREE.Mesh(geometry, material)
})

threeRenderer.setRender((scene, size) => {
  if (plane.value == null) return

  if (scene.getObjectById(plane.value.id) == null) {
    console.log('add plane')
    scene.add(plane.value)
  }

  if (scene.getObjectById(box.value.id) == null) {
    // console.log('add box')
    // scene.add(box.value)
  }

  const position = plane.value.geometry.getAttribute('position')

  noiseOffset.value += 0.05
  for (let i = 0; i < position.count; i++) {
    const z = noise2D(position.getX(i) * 0.005, position.getY(i) * 0.005 + noiseOffset.value)
    position.setZ(i, Math.fround(z * 40))
  }

  position.needsUpdate = true

  plane.value.rotation.x = 5.1
  plane.value.position.z = -400

})
</script>
<style lang="less" scoped>
.noise-3d-terrain,
.canvas {
  width: 50rem;
  height: 16rem;
  overflow: hidden;
  border-radius: 10px;
}
</style>
