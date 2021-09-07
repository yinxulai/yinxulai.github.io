import { Ref, ref, watch, onMounted, onUnmounted } from 'vue'
import { uesElementVisible } from '@hooks/ues-element-visible'

type ReturnType<T> = {
  setScale: (v: number) => void
  setRender: (func: RenderFunc<T>) => void
}

type StopFunc = () => void
type Size = { width: number, height: number }
type RenderFuncUtils = { size: Size, stop: StopFunc }
type RenderFunc<T> = (ctx: T, utils: RenderFuncUtils) => void
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

  const setRender = (newDraw: RenderFunc<RenderingContext>) => {
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
    const other = { size: { width, height }, stop: stopRender }
    drawFrame.value(context.value, other)
  }

  watch([canvasVisible], () => {
    startRequestFrame()
  }, { immediate: true })

  watch([canvas], () => {
    updateContext()
    updateCanvasSize()
  }, { immediate: true })

  watch([scale], () => {
    updateCanvasSize()
  }, { immediate: true })

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

  return { setRender, setScale }
}
