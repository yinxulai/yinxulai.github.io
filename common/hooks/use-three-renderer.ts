import * as THREE from 'three'
import { Ref, computed, watchPostEffect } from 'vue'
import { useCanvasRenderer } from './use-canvas-renderer'

type Size = { width: number, height: number }
type RenderFuncUtils = { size: Size }
type Options<T> = { maxFPS: number } & T
type CanvasRef = Ref<HTMLCanvasElement | undefined>
type RenderFunc = (scene: THREE.Scene, camera: THREE.Camera, utils: RenderFuncUtils) => void
export function useThreeRenderer(canvas: CanvasRef, options?: Options<WebGLContextAttributes>) {
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
    camera.position.y = height / 2
    camera.position.z = height / 2
    camera.position.x = 0
    camera.lookAt(0,0,0)
    return camera
  })

  const onRender = (func: RenderFunc) => {
    context.onRender((utils) => {
      if (camera.value == null) return
      func(scene, camera.value, utils)
      if (renderer.value == null) return
      renderer.value.render(scene, camera.value)
    })
  }

  const handleKeyboard = (event: KeyboardEvent) => {
    if (camera.value == null) return
    event.preventDefault()

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

    if (event.code === 'ArrowUp') {
      camera.value.rotateX(Math.PI * 0.1)
    }

    if (event.code === 'ArrowDown') {
      camera.value.rotateX(-Math.PI * 0.1)
    }

    if (event.code === 'ArrowLeft') {
      camera.value.rotateY(-Math.PI * 0.1)
    }

    if (event.code === 'ArrowRight') {
      camera.value.rotateY(Math.PI * 0.1)
    }

    if (event.code === 'KeyQ') {
      camera.value.focus += 1
    }

    if (event.code === 'KeyE') {
      camera.value.focus -= 1
    }
  }

  watchPostEffect(() => {
    if (canvas.value == null) return
    if (camera.value == null) return
    const { width } = canvas.value
    camera.value.position.x = width / 2
  })

  watchPostEffect((onInvalidate) => {
    if (canvas.value == null) return
    canvas.value.addEventListener('keydown', handleKeyboard)
    onInvalidate(() => {
      if (canvas.value == null) return
      canvas.value.removeEventListener('keydown', handleKeyboard)
    })
  })

  return { ...context, onRender }
}
