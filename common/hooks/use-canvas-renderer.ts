import { Ref, ref, watch, onMounted, onUnmounted } from 'vue'
import { uesElementVisible } from '@hooks/ues-element-visible'

type ReturnType<T> = {
  setScale: (v: number) => void
  onSetup: (func: RenderFunc<T>) => void
  onRender: (func: RenderFunc<T>) => void
}

export type StopFunc = () => void
export type Size = { width: number, height: number }
export type RenderFuncParams<T> = { context: T, size: Size, stop: StopFunc }
export type RenderFunc<T> = (params: RenderFuncParams<T>) => void
export type CanvasRef = Ref<HTMLCanvasElement | undefined>
export type Options<T> = { maxFPS: number } & T

export function useCanvasRenderer(canvas: CanvasRef, contextId: 'webgl', options?: Options<WebGLContextAttributes>): ReturnType<WebGLRenderingContext>
export function useCanvasRenderer(canvas: CanvasRef, contextId: 'webgl2', options?: Options<WebGLContextAttributes>): ReturnType<WebGL2RenderingContext>
export function useCanvasRenderer(canvas: CanvasRef, contextId: '2d', options?: Options<CanvasRenderingContext2DSettings>): ReturnType<CanvasRenderingContext2D>
export function useCanvasRenderer(canvas: CanvasRef, contextId: 'bitmaprenderer', options?: Options<ImageBitmapRenderingContextSettings>): ReturnType<ImageBitmapRenderingContext>
export function useCanvasRenderer(canvas: CanvasRef, contextId: string, options?: Options<any>): ReturnType<RenderingContext> {

  const scaleRef = ref(1)
  const stopRef = ref(false)
  const isMountedRef = ref(false)
  const isScrollingRef = ref(false)
  const isAlreadySetup = ref(false)
  const lastRenderTimeRef = ref(Date.now())
  const canvasVisibleRef = uesElementVisible(canvas)
  const contextRef = ref<RenderingContext | null>(null)
  const drawFrameRef = ref<null | RenderFunc<RenderingContext>>(null)
  const drawSetupRef = ref<null | RenderFunc<RenderingContext>>(null)

  const updateCanvasSize = () => {
    if (canvas.value == null) return

    const clientRect = canvas.value.getBoundingClientRect()
    canvas.value.height = Math.fround(clientRect.height * scaleRef.value)
    canvas.value.width = Math.fround(clientRect.width * scaleRef.value)
  }

  const updateContext = () => {
    if (canvas.value == null) {
      contextRef.value = null
      return
    }

    contextRef.value = canvas.value.getContext(contextId, options)
  }

  const setScale = (ratio = 1) => {
    scaleRef.value = ratio
  }

  const stopRender = () => {
    stopRef.value = true
  }

  const onSetup = (newDraw: RenderFunc<RenderingContext>) => {
    drawSetupRef.value = newDraw
  }

  const onRender = (newDraw: RenderFunc<RenderingContext>) => {
    drawFrameRef.value = newDraw
  }

  const startRequestFrame = () => {
    if (!isMountedRef.value) return
    if (stopRef.value === true) return
    requestAnimationFrame(() => (
      startRequestFrame()
    ))

    if (contextRef.value == null) return
    if (isScrollingRef.value === true) return
    if (canvasVisibleRef.value != true) return
    if (options?.maxFPS != null && Number.isFinite(options.maxFPS)) {
      const now = Date.now()
      const gapTime = now - lastRenderTimeRef.value
      if (gapTime <= (1000 / options.maxFPS)) return
      lastRenderTimeRef.value = Date.now()
    }

    const { width, height } = contextRef.value.canvas
    const params = { context: contextRef.value, size: { width, height }, stop: stopRender }

    if (isAlreadySetup.value === false) {
      drawSetupRef.value?.(params)
      isAlreadySetup.value = true
    } 

    drawFrameRef.value?.(params)
  }

  const upgradeTabIndex = () => {
    if (canvas.value == null) return
    // 如果 tabIndex 为负数，
    // 那么元素就不能使用 tab 键进行导航，
    // 但还能获得焦点
    canvas.value.tabIndex = -1
  }

  const handleWheel = () => {
    isScrollingRef.value = true
    setTimeout(() => { isScrollingRef.value = false }, 1000)
  }

  onMounted(() => {
    isMountedRef.value = true
    window.addEventListener('wheel', handleWheel)
  })

  onUnmounted(() => {
    isMountedRef.value = false
    window.removeEventListener('wheel', handleWheel)
  })


  watch(canvasVisibleRef, () => {
    startRequestFrame()
  }, {
    flush: 'post',
    immediate: true
  })

  watch(scaleRef, () => {
    updateCanvasSize()
  }, {
    flush: 'post',
    immediate: true
  })

  watch(canvas, () => {
    updateCanvasSize()
    upgradeTabIndex()
    updateContext()
  }, {
    flush: 'post',
    immediate: true
  })

  return { onRender, onSetup, setScale }
}
