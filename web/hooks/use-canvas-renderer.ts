import { Ref, ref, watch } from 'vue'
import { uesElementVisible } from '@hooks/ues-element-visible'

type RenderFunc<T> = (ctx: T) => void
type CanvasRef = Ref<HTMLCanvasElement | undefined>
type ReturnType<T> = { setRender: (func: RenderFunc<T>) => void }

export function useCanvasRenderer(canvas: CanvasRef, contextId: 'webgl', options?: WebGLContextAttributes): ReturnType<WebGLRenderingContext>
export function useCanvasRenderer(canvas: CanvasRef, contextId: 'webgl2', options?: WebGLContextAttributes): ReturnType<WebGL2RenderingContext>
export function useCanvasRenderer(canvas: CanvasRef, contextId: '2d', options?: CanvasRenderingContext2DSettings): ReturnType<CanvasRenderingContext2D>
export function useCanvasRenderer(canvas: CanvasRef, contextId: 'bitmaprenderer', options?: ImageBitmapRenderingContextSettings): ReturnType<ImageBitmapRenderingContext>
export function useCanvasRenderer(canvas: CanvasRef, contextId: string, options?: any): ReturnType<RenderingContext> {

  const canvasVisible = uesElementVisible(canvas)
  const context = ref<RenderingContext | null>(null)
  const drawFrame = ref<null | RenderFunc<RenderingContext>>(null)

  const updateCanvasSize = () => {
    if (canvas.value == null) return

    const clientRect = canvas.value.getBoundingClientRect()
    canvas.value.height = clientRect.height
    canvas.value.width = clientRect.width
  }

  const updateContext = () => {
    if (canvas.value == null) {
      context.value = null
      return
    }

    context.value = canvas.value.getContext(contextId, options)
    
  }

  const setRender = (newDraw: RenderFunc<RenderingContext>) => {
    drawFrame.value = newDraw
  }

  const startRequestFrame = () => {
    if (canvasVisible.value != true) return
    requestAnimationFrame(() => startRequestFrame())

    if (drawFrame.value != null && context.value != null) {
      drawFrame.value(context.value)
    }
  }

  watch([canvasVisible], () => {
    startRequestFrame()
  })

  watch([canvas], () => {
    updateContext()
    updateCanvasSize()
  })

  return { setRender: setRender }
}
