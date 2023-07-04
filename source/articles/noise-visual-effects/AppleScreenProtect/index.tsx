import { createRef } from 'airx'
import { makeNoise3D } from 'fast-simplex-noise'
import { useCanvasRenderer } from '../../../common/hooks/use-canvas-renderer'

import styles from './style.module.less'

export function AppleScreenProtect() {
  const angleNoise = makeNoise3D()
  const colorNoise = makeNoise3D()
  const zOffsetRef = createRef(0.01)
  const canvasRef = createRef<HTMLCanvasElement | undefined>(undefined)

  const canvasRenderer = useCanvasRenderer(canvasRef,  '2d')

  const maxLineWidth = 4
  const maxLineLength = 30
  const canvasPadding = 0 // maxLineLength + maxLineWidth / 2

  canvasRenderer.onRender(({ context, size }) => {
    zOffsetRef.value += 0.00005
    context.clearRect(0, 0, size.width, size.height)

    for (let x = canvasPadding; x <= size.width - canvasPadding; x += 20) {
      for (let y = canvasPadding; y <= size.height - canvasPadding; y += 20) {
        const angle = angleNoise(x * 0.001, y * 0.001, zOffsetRef.value * 10) * 5
        const color = colorNoise(x * 0.001, y * 0.001, zOffsetRef.value) * 300
        const toX = x + Math.cos(angle) * maxLineLength
        const toY = y + Math.sin(angle) * maxLineLength

        const linearGradient = context.createLinearGradient(x, y, toX, toY)
        linearGradient.addColorStop(1, `hsla(${color}, 40%,40%, 1)`)
        linearGradient.addColorStop(0, 'hsla(0,0%,0%,0)')
        context.strokeStyle = linearGradient

        context.lineWidth = maxLineWidth
        context.lineCap = 'round'

        context.beginPath()
        context.moveTo(x, y)
        context.lineTo(toX, toY)
        context.stroke()
      }
    }
  })
  return () => (
    <div class={styles.root}>
      <canvas ref={canvasRef} class={styles.canvas} />
    </div>
  )
}
