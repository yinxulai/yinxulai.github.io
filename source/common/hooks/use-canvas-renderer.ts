import { Ref, createRef, watch, onMounted } from 'airx'
import { uesElementVisible } from './ues-element-visible'

type ReturnType<T> = {
  setScale: (v: number) => void
  onRender: (func: RenderFunc<T>) => void
}

type StopFunc = () => void
type Size = { width: number, height: number }
export type RenderFuncParams<T> = { context: T, size: Size, stop: StopFunc }
export type RenderFunc<T> = (params: RenderFuncParams<T>) => void
type CanvasRef = Ref<HTMLCanvasElement | undefined>
type Options<T> = { maxFPS: number } & T

export function useCanvasRenderer(canvas: CanvasRef, contextId: 'webgl', options?: Options<WebGLContextAttributes>): ReturnType<WebGLRenderingContext>
export function useCanvasRenderer(canvas: CanvasRef, contextId: 'webgl2', options?: Options<WebGLContextAttributes>): ReturnType<WebGL2RenderingContext>
export function useCanvasRenderer(canvas: CanvasRef, contextId: '2d', options?: Options<CanvasRenderingContext2DSettings>): ReturnType<CanvasRenderingContext2D>
export function useCanvasRenderer(canvas: CanvasRef, contextId: 'bitmaprenderer', options?: Options<ImageBitmapRenderingContextSettings>): ReturnType<ImageBitmapRenderingContext>
export function useCanvasRenderer(canvas: CanvasRef, contextId: string, options?: Options<any>): ReturnType<RenderingContext> {

  const scale = createRef(1)
  const stop = createRef(false)
  const isScrolling = createRef(false)
  const lastRenderTime = createRef(Date.now())
  const canvasVisible = uesElementVisible(canvas)
  const context = createRef<RenderingContext | null>(null)
  const drawFrame = createRef<null | RenderFunc<RenderingContext>>(null)

  const updateCanvasSize = () => {
    if (canvas.value == null) return

    const clientRect = canvas.value.getBoundingClientRect()
    canvas.value.height = Math.fround(clientRect.height * scale.value)
    canvas.value.width = Math.fround(clientRect.width * scale.value)
  }

  const updateContext = () => {
    if (canvas.value == null) {
      context.value = null
      return
    }

    context.value = canvas.value.getContext(contextId, options)
  }

  const setScale = (ratio = 1) => {
    scale.value = ratio
  }

  const stopRender = () => {
    stop.value = true
  }

  const onRender = (newDraw: RenderFunc<RenderingContext>) => {
    drawFrame.value = newDraw
  }

  const startRequestFrame = () => {
    if (stop.value === true) return
    requestAnimationFrame(() => (
      startRequestFrame()
    ))

    if (context.value == null) return
    if (drawFrame.value == null) return
    if (isScrolling.value === true) return
    if (canvasVisible.value != true) return
    if (options?.maxFPS != null && Number.isFinite(options.maxFPS)) {
      const now = Date.now()
      const gapTime = now - lastRenderTime.value
      if (gapTime <= (1000 / options.maxFPS)) return
      lastRenderTime.value = Date.now()
    }

    const { width, height } = context.value.canvas
    const params = { context: context.value, size: { width, height }, stop: stopRender }
    drawFrame.value(params)
  }

  const upgradeTabIndex = () => {
    if (canvas.value == null) return
    // 如果 tabIndex 为负数，
    // 那么元素就不能使用 tab 键进行导航，
    // 但还能获得焦点
    canvas.value.tabIndex = -1
  }

  onMounted(() => {
    const handleWheel = () => {
      isScrolling.value = true
      setTimeout(() => { isScrolling.value = false }, 1000)
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  })

  watch(canvasVisible, () => {
    startRequestFrame()
  })

  watch(scale, () => {
    updateCanvasSize()
  })

  watch(canvas, () => {
    updateCanvasSize()
    upgradeTabIndex()
    updateContext()
  })

  return { onRender, setScale }
}
