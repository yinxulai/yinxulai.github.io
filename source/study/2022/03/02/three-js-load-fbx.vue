<template>
  <div class="three-js-load-fbx">
    <input type="file" @change="handleSelectFile" />
    <canvas ref="canvasRef" class="canvas"></canvas>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, toRaw } from 'vue'
import { AnimationMixer, Group, Clock, HemisphereLight, DirectionalLight } from 'three'
import { useThreeRenderer } from '@hooks/use-three-renderer'
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

const clock = new Clock()
const fileRef = ref<File>()
const canvasRef = ref<HTMLCanvasElement>()
const threeRenderer = useThreeRenderer(canvasRef)

const fbxGroupRef = ref<Group>()
const animationMixer = ref<AnimationMixer>()

const dirLight = new DirectionalLight(0xffffff)
const hemiLight = new HemisphereLight(0xffffff, 0x444444)

const handleSelectFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target == null || target.files == null) return
  fileRef.value = target.files[0]
}

// watch(fileRef, async () => {
//   if (fileRef.value == null) return null

//   const loader = new FBXLoader()
//   const buffer = await fileRef.value.arrayBuffer()

//   fbxGroupRef.value = loader.parse(buffer, 'root')
//   animationMixer.value = new AnimationMixer(fbxGroupRef.value)
//   if (fbxGroupRef.value.animations.length > 0) {
//     animationMixer.value.clipAction(fbxGroupRef.value.animations[0]).play()
//   }
// })

threeRenderer.onRender((scene, camera, { size }) => {
  if (fbxGroupRef.value == null) return
  if (animationMixer.value == null) return

  if (scene.getObjectById(hemiLight.id) == null) {
    hemiLight.position.set(0, 200, 0)
    scene.add(hemiLight)
  }

  if (scene.getObjectById(dirLight.id) == null) {
    dirLight.position.set(0, 200, 100)
    dirLight.castShadow = true
    dirLight.shadow.camera.top = 180
    dirLight.shadow.camera.bottom = -100
    dirLight.shadow.camera.left = -120
    dirLight.shadow.camera.right = 120
    scene.add(dirLight)
  }

  if (scene.getObjectById(fbxGroupRef.value.id) == null) {
    const obj = toRaw(fbxGroupRef.value)
    camera.position.set(0, 150, 550)
    camera.lookAt(obj.position)
    camera.rotation.x = -Math.PI / 20
    scene.add(obj)
  }

  animationMixer.value.update(clock.getDelta())
})
</script>
<style lang="less" scoped>
.three-js-load-fbx {
  .canvas {
    width: 50rem;
    height: 50rem;
    overflow: hidden;
    border-radius: 10px;
  }
}
</style>
