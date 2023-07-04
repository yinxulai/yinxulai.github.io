import { createRef } from 'airx'
import { makeNoise3D } from 'fast-simplex-noise'
import { useCanvasRenderer } from '../../../common/hooks/use-canvas-renderer'

import styles from './style.module.less'

export function NoiseAngleField() {
  const gridSize = 20
  const lineLength = 15
  const canvasPadding = 20
  const noise3D = makeNoise3D()
  const noiseOffset = createRef<number>(0)
  const canvasRef = createRef<HTMLCanvasElement | undefined>(undefined)
  const canvasRenderer = useCanvasRenderer(canvasRef, '2d')

  canvasRenderer.onRender(({ context, size }) => {
    noiseOffset.value += 0.001
    context.clearRect(0, 0, size.width, size.height)
    for (let x = canvasPadding; x < size.width - canvasPadding; x += gridSize) {
      for (let y = canvasPadding; y < size.height - canvasPadding; y += gridSize) {
        const angle = noise3D(x * 0.0005, y * 0.0005, noiseOffset.value) * 5
        const toX = x + Math.cos(angle) * lineLength
        const toY = y + Math.sin(angle) * lineLength
        context.strokeStyle = '#ffffff'
        context.lineCap = 'round'
        context.lineWidth = 1
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
