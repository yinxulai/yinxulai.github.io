// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls'

import * as THREE from 'three'
import { Ref, createRef, watch } from 'airx'
import { RenderFuncParams, useCanvasRenderer } from './use-canvas-renderer'

type Options<T> = { maxFPS: number } & T
type CanvasRef = Ref<HTMLCanvasElement | undefined>
type RenderFunc = (
  params: { renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera }
    & RenderFuncParams<WebGLRenderingContext>
) => void

export function useThreeRenderer(canvas: CanvasRef, options?: Options<WebGLContextAttributes>) {
  const context = useCanvasRenderer(canvas, 'webgl', options)

  const scene = new THREE.Scene()
  const cameraRef = createRef<THREE.Camera | null>(null)
  const rendererRef = createRef<THREE.WebGLRenderer | null>(null)

  watch(canvas, () => {
    if (!canvas.value) return
    const { width, height } = canvas.value

    // create renderer
    rendererRef.value = new THREE.WebGLRenderer({ canvas: canvas.value })
    rendererRef.value.setPixelRatio( window.devicePixelRatio )
    rendererRef.value.setSize(width, height)

    // create camera
    cameraRef.value = new THREE.PerspectiveCamera(30, width / height, 0.1, 10000)
    cameraRef.value.position.y = height / 2
    cameraRef.value.position.z = height / 2
    cameraRef.value.position.x = 0
    cameraRef.value.lookAt(0, 0, 0)

    // 控制器
    new OrbitControls(cameraRef.value, canvas.value)
  })

  const onRender = (func: RenderFunc) => {
    context.onRender((baseParams) => {
      if (cameraRef.value == null) return
      if (rendererRef.value == null) return
      func({
        ...baseParams,
        scene,
        camera: cameraRef.value,
        renderer: rendererRef.value,
      })
      if (rendererRef.value == null) return
      rendererRef.value.render(scene, cameraRef.value)
    })
  }

  return { ...context, onRender }
}
