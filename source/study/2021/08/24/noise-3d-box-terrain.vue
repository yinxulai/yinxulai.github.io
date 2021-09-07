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

const boxSize = 10
const noise2D = makeNoise2D()
const noiseOffset = ref<number>(0)
const canvasRef = ref<HTMLCanvasElement>()
const threeRenderer = useThreeRenderer(canvasRef)

const box = computed(() => {
  const geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize, 1, 1)
  const material = new THREE.MeshBasicMaterial({ wireframe: true })
  return new THREE.Mesh(geometry, material)
})

threeRenderer.setRender((scene, camera, { size }) => {
  scene.clear()
  camera.position.z = 80
  camera.position.x = size.width / 2
  camera.lookAt(size.width / 2, size.height, 0)

  noiseOffset.value += 0.01
  if (box.value == null) return
  for (let x = 0; x < size.width; x += boxSize) {
    for (let y = 0; y < size.height; y += boxSize) {
      const z = Math.floor((noise2D(x * 0.005, y * 0.005 + noiseOffset.value) * 400) / boxSize)
      const currentBox = box.value.clone()
      currentBox.position.x = x
      currentBox.position.y = y
      currentBox.position.z = z
      scene.add(currentBox)
    }
  }
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
