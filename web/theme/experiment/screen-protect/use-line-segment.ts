import { Ref, ref, computed } from 'vue'

import { makeNoise3D } from 'fast-simplex-noise'

interface Position {
  x: number
  y: number
}

export function useLineSegment(canvas: Ref<HTMLCanvasElement | undefined>) {
  let zOffset = ref(0.01)
  const angleNoise = makeNoise3D()
  const colorNoise = makeNoise3D()

  const context = computed(() => {
    if (canvas.value == null) return null
    return canvas.value.getContext('2d')
  })

  const drawLineSegment = (position: Position, angle: number, color:string) => {
    if (context.value == null) return null
    const toX = position.x + Math.cos(angle) * 40
    const toY = position.y + Math.sin(angle) * 40

    const linearGradient = context.value.createLinearGradient(position.x, position.y, toX, toY)
    linearGradient.addColorStop(0, 'hsla(0,0%,0%,0)')
    linearGradient.addColorStop(1, color)

    context.value.strokeStyle = linearGradient

    context.value.lineWidth = 6
    context.value.lineCap = 'round'

    context.value.beginPath()

    context.value.moveTo(position.x, position.y)
    context.value.lineTo(toX, toY)
    context.value.stroke()
  }

  const clear = (alpha = 1) => {
    if (canvas.value == null) return
    if (context.value == null) return
    context.value.fillStyle = `rgba(0,0,0,${alpha})`
    const { width, height } = canvas.value
    context.value.fillRect(0, 0, width, height)
  }

  const render = () => {
    zOffset.value += 0.001
    if (canvas.value == null) return
    if (context.value == null) return
    const { width, height } = canvas.value

    clear(1)

    for (let x = 0; x <= width; x += 20) {
      for (let y = 0; y <= height; y += 20) {
        const angle = angleNoise(x * 0.0005, y * 0.0005, zOffset.value) * 10
        const color = colorNoise(x * 0.0005, y * 0.0005, zOffset.value) * 360
        drawLineSegment({ x, y }, angle, `hsla(${color}, 50%,50%, 1)`)
      }
    }
  }

  return { render }
}
