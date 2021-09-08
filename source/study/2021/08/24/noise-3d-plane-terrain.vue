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
  const geometry = new THREE.PlaneGeometry(
    width * 2,
    height * 8,
    Math.fround(width * 2 / 8),
    Math.fround(height * 8 / 8)
  )

  const material = new THREE.MeshNormalMaterial({ flatShading: true })
  return new THREE.Mesh(geometry, material)
})

threeRenderer.setRender((scene, camera, { size }) => {
  noiseOffset.value += 0.01

  camera.rotation.x = Math.PI * 0.42
  camera.position.x = -380
  camera.position.y = -315
  camera.position.z = 80

  if (plane.value == null) return
  if (scene.getObjectById(plane.value.id) == null) {
    plane.value.position.x = -size.width / 2
    plane.value.position.y = -size.height / 2
    scene.add(plane.value)
  }

  const positions = plane.value.geometry.getAttribute('position')
  for (let i = 0; i < positions.count; i++) {
    const [currentX, currentY] = [positions.getX(i), positions.getY(i)]
    const z = noise2D(currentX * 0.003, currentY * 0.003 + noiseOffset.value)
    positions.setZ(i, Math.fround(z * 60))
    positions.needsUpdate = true
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
