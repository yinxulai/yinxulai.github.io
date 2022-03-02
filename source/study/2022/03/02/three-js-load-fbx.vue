<template>
  <div class="three-js-load-fbx">
    <input type="file" accept="image/*" @change="handleSelectFile" />
    <canvas ref="canvasRef" class="canvas" />
  </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import { AnimationMixer } from 'three'
import { useThreeRenderer } from '@hooks/use-three-renderer'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

const loader = new FBXLoader()
const fileRef = ref<File>()
const canvasRef = ref<HTMLCanvasElement>()
const threeRenderer = useThreeRenderer(canvasRef)

const handleSelectFile = (event: InputEvent) => {
  const target = event.target as HTMLInputElement
  if (target == null || target.files == null) return
  fileRef.value = target.files[0]
}

const fbxObject = computed(() => {
  if (fileRef.value == null) return null
  const buffer = await fileRef.value.arrayBuffer()
  return loader.parse(buffer, '')
})

threeRenderer.onRender((scene, camera, { size }) => {
  if (fbxObject.value != null) {
    const mixer = new AnimationMixer(fbxObject.value)
    const action = mixer.clipAction(fbxObject.value.animations[0])
    fbxObject.value.traverse((child) => {
      // if (child.isMesh) {
      //   child.castShadow = true
      //   child.receiveShadow = true
      // }
    })
  }

  // action.play();

  // scene.add( object );

  // }
})
</script>
<style lang="less" scoped>
.three-js-load-fbx {
  .canvas {
    width: 50rem;
    height: 16rem;
    overflow: hidden;
    border-radius: 10px;
  }
}
</style>
