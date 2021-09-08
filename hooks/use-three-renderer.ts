import * as THREE from 'three'
import { Ref, computed, onUnmounted, watch } from 'vue'
import { useCanvasRenderer } from './use-canvas-renderer'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

type Size = { width: number, height: number }
type RenderFuncUtils = { size: Size }
type CanvasRef = Ref<HTMLCanvasElement | undefined>
type RenderFunc = (scene: THREE.Scene, camera: THREE.Camera, utils: RenderFuncUtils) => void
export function useThreeRenderer(canvas: CanvasRef, options?: WebGLContextAttributes) {
  const context = useCanvasRenderer(canvas, 'webgl', options)
  const scene = new THREE.Scene()

  const renderer = computed(() => {
    if (canvas.value == null) return null
    const { width, height } = canvas.value
    const renderer = new THREE.WebGLRenderer({ canvas: canvas.value })
    renderer.setSize(width, height)
    return renderer
  })

  const camera = computed(() => {
    if (canvas.value == null) return null
    const { width, height } = canvas.value
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000)
    camera.position.z = 5
    return camera
  })

  const orbit = computed(() => {
    if (camera.value == null) return null
    if (renderer.value == null) return null
    return new OrbitControls(camera.value, renderer.value.domElement)
  })

  const setRender = (func: RenderFunc) => {
    context.setRender((_ctx, utils) => {
      orbit.value?.update()
      if (camera.value == null) return
      func(scene, camera.value, utils)
      if (renderer.value == null) return
      renderer.value.render(scene, camera.value)
    })
  }

  const handleKeyboard = (event: KeyboardEvent) => {
    if (camera.value == null) return

    if (event.code === 'KeyW') {
      camera.value.translateZ(-10)
    }

    if (event.code === 'KeyS') {
      camera.value.translateZ(10)
    }

    if (event.code === 'KeyA') {
      camera.value.translateX(-10)
    }

    if (event.code === 'KeyD') {
      camera.value.translateX(10)
    }
  }

  watch([canvas], () => {
    if (canvas.value == null) return
    window.addEventListener('keydown', handleKeyboard)
  })

  onUnmounted(() => {
    if (canvas.value == null) return
    window.removeEventListener('keydown', handleKeyboard)
  })

  return { ...context, setRender }
}
