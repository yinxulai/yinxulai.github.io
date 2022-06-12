import * as THREE from 'three'
import { ref, Ref, computed, watchPostEffect } from 'vue'
import { useCanvasRenderer, RenderFuncParams } from './use-canvas-renderer'

type Options<T> = { maxFPS: number } & T
type CanvasRef = Ref<HTMLCanvasElement | undefined>
export type ThreeRenderFuncParams = RenderFuncParams<WebGLRenderingContext> & {
  scene: THREE.Scene,
  camera: THREE.Camera
}
type RenderFunc = (params: ThreeRenderFuncParams) => void

export function useThreeRenderer(canvas: CanvasRef, options?: Options<WebGLContextAttributes>) {
  const canvasRenderRef = useCanvasRenderer(canvas, 'webgl', options)
  const scene = new THREE.Scene()

  const rendererRef = computed(() => {
    if (canvas.value == null) return null
    const { width, height } = canvas.value
    const renderer = new THREE.WebGLRenderer({ canvas: canvas.value })
    renderer.setSize(width, height)
    return renderer
  })

  const cameraRef = computed(() => {
    if (canvas.value == null) return null
    const { width, height } = canvas.value
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000)
    camera.position.y = height / 2
    camera.position.z = height / 2
    camera.position.x = 0
    camera.lookAt(0, 0, 0)
    return camera
  })

  const onSetup = (func: RenderFunc) => {
    canvasRenderRef.onSetup((params) => {
      if (cameraRef.value == null) return
      const camera = cameraRef.value
      func({ ...params, scene, camera })
    })
  }

  const onRender = (func: RenderFunc) => {
    canvasRenderRef.onRender((params) => {
      if (cameraRef.value == null) return
      const camera = cameraRef.value
      func({ ...params, scene, camera })
      if (rendererRef.value == null) return
      rendererRef.value.render(scene, camera)
    })
  }

  const handleKeyboard = (event: KeyboardEvent) => {
    if (cameraRef.value == null) return
    event.preventDefault()

    if (event.code === 'KeyW') {
      cameraRef.value.translateZ(-10)
    }

    if (event.code === 'KeyS') {
      cameraRef.value.translateZ(10)
    }

    if (event.code === 'KeyA') {
      cameraRef.value.translateX(-10)
    }

    if (event.code === 'KeyD') {
      cameraRef.value.translateX(10)
    }

    if (event.code === 'ArrowUp') {
      cameraRef.value.rotateX(Math.PI * 0.1)
    }

    if (event.code === 'ArrowDown') {
      cameraRef.value.rotateX(-Math.PI * 0.1)
    }

    if (event.code === 'ArrowLeft') {
      cameraRef.value.rotateY(-Math.PI * 0.1)
    }

    if (event.code === 'ArrowRight') {
      cameraRef.value.rotateY(Math.PI * 0.1)
    }

    if (event.code === 'KeyQ') {
      cameraRef.value.focus += 1
    }

    if (event.code === 'KeyE') {
      cameraRef.value.focus -= 1
    }
  }

  watchPostEffect(() => {
    if (canvas.value == null) return
    if (cameraRef.value == null) return
    const { width } = canvas.value
    cameraRef.value.position.x = width / 2
  })

  watchPostEffect((onInvalidate) => {
    if (canvas.value == null) return
    canvas.value.addEventListener('keydown', handleKeyboard)
    onInvalidate(() => {
      if (canvas.value == null) return
      canvas.value.removeEventListener('keydown', handleKeyboard)
    })
  })

  return { ...canvasRenderRef, onSetup, onRender }
}
