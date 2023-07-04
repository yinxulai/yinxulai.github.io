import * as THREE from 'three'
import { Ref, createRef, watch } from 'airx'
import { RenderFuncParams, useCanvasRenderer } from './use-canvas-renderer'

type Options<T> = { maxFPS: number } & T
type CanvasRef = Ref<HTMLCanvasElement | undefined>
type RenderFunc = (
  params: { scene: THREE.Scene, camera: THREE.Camera }
    & RenderFuncParams<WebGLRenderingContext>
) => void

export function useThreeRenderer(canvas: CanvasRef, options?: Options<WebGLContextAttributes>) {
  const context = useCanvasRenderer(canvas, 'webgl', options)

  const scene = new THREE.Scene()
  const cameraRef = createRef<THREE.Camera | null>(null)
  const rendererRef = createRef<THREE.Renderer | null>(null)

  watch(canvas, () => {
    if (!canvas.value) return
    const { width, height } = canvas.value

    // create renderer
    rendererRef.value = new THREE.WebGLRenderer({ canvas: canvas.value })
    rendererRef.value.setSize(width, height)

    // create camera
    cameraRef.value = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000)
    cameraRef.value.position.y = height / 2
    cameraRef.value.position.z = height / 2
    cameraRef.value.position.x = 0
    cameraRef.value.lookAt(0, 0, 0)

    // add event
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

      // if (event.code === 'KeyQ') {
      //   cameraRef.value.focus += 1
      // }

      // if (event.code === 'KeyE') {
      //   cameraRef.value.focus -= 1
      // }
    }

    canvas.value.addEventListener('keydown', handleKeyboard, { passive: true })

    // dispose
    return () => {
      canvas.value?.removeEventListener('keydown', handleKeyboard)
    }
  })

  const onRender = (func: RenderFunc) => {
    context.onRender((baseParams) => {
      if (cameraRef.value == null) return
      func({ ...baseParams, scene, camera: cameraRef.value })
      if (rendererRef.value == null) return
      rendererRef.value.render(scene, cameraRef.value)
    })
  }

  return { ...context, onRender }
}
