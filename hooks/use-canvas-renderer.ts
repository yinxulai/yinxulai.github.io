import { Ref, ref, watch, onMounted, onUnmounted } from 'vue'
import { uesElementVisible } from '@hooks/ues-element-visible'

type ReturnType<T> = {
  setScale: (v: number) => void
  onRender: (func: RenderFunc<T>) => void
}

type StopFunc = () => void
type Size = { width: number, height: number }
type RenderFuncParams<T> = {context: T, size: Size, stop: StopFunc }
type RenderFunc<T> = (params: RenderFuncParams<T>) => void
type CanvasRef = Ref<HTMLCanvasElement | undefined>

export function useCanvasRenderer(canvas: CanvasRef, contextId: 'webgl', options?: WebGLContextAttributes): ReturnType<WebGLRenderingContext>
export function useCanvasRenderer(canvas: CanvasRef, contextId: 'webgl2', options?: WebGLContextAttributes): ReturnType<WebGL2RenderingContext>
export function useCanvasRenderer(canvas: CanvasRef, contextId: '2d', options?: CanvasRenderingContext2DSettings): ReturnType<CanvasRenderingContext2D>
export function useCanvasRenderer(canvas: CanvasRef, contextId: 'bitmaprenderer', options?: ImageBitmapRenderingContextSettings): ReturnType<ImageBitmapRenderingContext>
export function useCanvasRenderer(canvas: CanvasRef, contextId: string, options?: any): ReturnType<RenderingContext> {

  const scale = ref(1)
  const stop = ref(false)
  const isScrolling = ref(false)
  const canvasVisible = uesElementVisible(canvas)
  const context = ref<RenderingContext | null>(null)
  const drawFrame = ref<null | RenderFunc<RenderingContext>>(null)

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
    if (canvasVisible.value != true) return
    requestAnimationFrame(() => startRequestFrame())

    if (isScrolling.value === true) return
    if (drawFrame.value == null) return
    if (context.value == null) return

    const { width, height } = context.value.canvas
    const params = {context: context.value,  size: { width, height }, stop: stopRender }
    drawFrame.value(params)
  }

  const upgradeTabIndex = () => {
    if (canvas.value == null) return
    // 如果 tabIndex 为负数，
    // 那么元素就不能使用 tab 键进行导航，
    // 但还能获得焦点
    canvas.value.tabIndex = -1
  }

  const handleWheel = () => {
    isScrolling.value = true
    setTimeout(() => { isScrolling.value = false }, 1000)
  }

  onMounted(() => {
    window.addEventListener('wheel', handleWheel)
  })

  onUnmounted(() => {
    window.removeEventListener('wheel', handleWheel)
  })


  watch(canvasVisible, () => {
    startRequestFrame()
  }, {
    flush: 'post',
    immediate: true
  })

  watch(scale, () => {
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

  return { onRender, setScale }
}
