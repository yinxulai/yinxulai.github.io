import { ref, Ref, watch, computed } from 'vue'
export interface Position {
  x: number
  y: number
  time: number
}

export type DrawCallback = (record: Position) => void
export type DrawStroke = (line: [Position, Position]) => void
export function useDraw(canvas: Ref<HTMLCanvasElement | undefined>) {

  const canvasContext = computed(() => {
    if (canvas.value == null) return null
    return canvas.value.getContext('2d')
  })

  const isStartDraw = ref<boolean>(false)
  const drawCallbackList = ref<DrawCallback[]>([])
  const lastDrawPosition = ref<Position>({ x: 0, y: 0, time: 0 })

  // 转换为相对 Canvas 的坐标
  const toRelativePosition = (point: Position): Position => {
    if (canvas.value == null) return point

    //创建canvas所对应的包围盒
    const clientRect = canvas.value.getBoundingClientRect()
    //返回屏幕 x 坐标减去 box 距离左边的间距就是 canvas 距离左边的位置,顶部同理左边
    return {
      x: Math.round(point.x - clientRect.left),
      y: Math.round(point.y - clientRect.top),
      time: Date.now()
    }
  }

  const resetSize = () => {
    if (canvas.value == null) return
    const clientRect = canvas.value.getBoundingClientRect()
    canvas.value.height = clientRect.height
    canvas.value.width = clientRect.width
  }

  const start = (event: MouseEvent) => {
    event.preventDefault()
    isStartDraw.value = true
    const { clientX, clientY } = event
    lastDrawPosition.value = toRelativePosition({
      time: Date.now(),
      x: clientX,
      y: clientY,
    })
  }

  const close = (event: MouseEvent) => {
    event.preventDefault()
    isStartDraw.value = false
    const { clientX, clientY } = event
    lastDrawPosition.value = toRelativePosition({
      time: Date.now(),
      x: clientX,
      y: clientY,
    })
  }

  const clear = (alpha = 1) => {
    if (canvas.value == null) return
    if (canvasContext.value == null) return
    canvasContext.value.fillStyle = `rgba(255,255,255,${alpha})`
    canvasContext.value.fillRect(0, 0, canvas.value.width, canvas.value.height)
  }

  const drawStroke: DrawStroke = (record) => {
    if (canvas.value == null) return
    if (canvasContext.value == null) return

    const context = canvasContext.value!
    const [startPosition, endPosition] = record

    //设置画笔粗细
    context.lineWidth = 10
    //填补空白
    context.lineCap = 'round'
    //线条更加平滑
    context.lineJoin = 'round'
    //设置画笔颜色
    context.strokeStyle = 'black'

    context.beginPath()
    context.moveTo(startPosition.x, startPosition.y)
    context.lineTo(endPosition.x, endPosition.y)
    lastDrawPosition.value = endPosition
    context.stroke()
    clear(0.01)
  }

  watch(
    () => [canvas.value, canvasContext.value],
    () => {
      if (canvas.value == null) return
      if (canvasContext.value == null) return

      resetSize()

      canvas.value.addEventListener('mouseup', close)
      canvas.value.addEventListener('mouseout', close)
      canvas.value.addEventListener('mousedown', start)
      canvas.value.addEventListener('mouseleave', close)

      canvas.value.addEventListener('mousemove', (event) => {
        event.preventDefault()
        if (isStartDraw.value == false) return

        const { clientX, clientY } = event
        const lastPosition = lastDrawPosition.value
        const nowPosition = toRelativePosition({
          time: Date.now(),
          x: clientX,
          y: clientY
        })

        drawStroke([lastPosition, nowPosition])
        if (drawCallbackList.value.length > 0) {
          drawCallbackList.value.forEach(v => v(nowPosition))
        }
      })
    }
  )

  const addDrawCallback = (callback: DrawCallback) => {
    drawCallbackList.value.push(callback);
  }

  return {
    addDrawCallback,
    drawStroke,
    clear
  }
}
