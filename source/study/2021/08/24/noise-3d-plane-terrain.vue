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
    width,
    height * 2,
    Math.fround(width),
    Math.fround(height * 2)
  )
  const material = new THREE.MeshNormalMaterial({ flatShading: true })
  return new THREE.Mesh(geometry, material)
})

threeRenderer.setRender((scene, _camera, { size }) => {
  noiseOffset.value += 0.05
  if (plane.value == null) return

  if (scene.getObjectById(plane.value.id) == null) {
    scene.add(plane.value)
    plane.value.rotation.x = 5.1
    plane.value.position.z = -400
  }

  const positions = plane.value.geometry.getAttribute('position')
  for (let i = 0; i < positions.count; i++) {
    const currentX = positions.getX(i)
    const currentY = positions.getY(i)
    const z = noise2D(currentX * 0.005, currentY * 0.005 + noiseOffset.value)
    positions.setZ(i, Math.fround(z * 40))
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
