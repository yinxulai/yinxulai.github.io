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

const boxSize = 20
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
  noiseOffset.value += 0.01

  const mapWidth = size.width / 2
  const mapHeigth = size.height * 2

  scene.clear()
  camera.position.z = 120
  camera.position.y = 150
  camera.position.x = mapWidth / 2

  camera.rotation.x = Math.PI * 0.25

  if (box.value == null) return
  for (let x = 0; x < mapWidth; x += boxSize) {
    for (let y = 0; y < mapHeigth; y += boxSize) {
      const noiseValue = noise2D(x * 0.005, y * 0.005 + noiseOffset.value) * 80
      const z = Math.floor(noiseValue - (noiseValue % boxSize))
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
