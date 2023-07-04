import { createRef } from 'airx'
import { makeNoise3D } from 'fast-simplex-noise'
import { useCanvasRenderer } from '../../../common/hooks/use-canvas-renderer'

import styles from './style.module.less'

export function NoiseLineAfterimage() {

  const noise3D = makeNoise3D()
  const noiseOffset = createRef<number>(0)
  const canvasRef = createRef<HTMLCanvasElement | undefined>(undefined)
  const canvasRenderer = useCanvasRenderer(canvasRef, '2d')

  canvasRenderer.onRender(({ context, size }) => {
    noiseOffset.value += 0.001
    const { width, height } = size
    const maxLineLength = Math.min(width, height) / 2
    const lineAngle = noise3D(0, 0, noiseOffset.value) * 4
    const centerPointX = noise3D(0, 0, noiseOffset.value + 10) * (width * 0.1) + width / 2
    const centerPointY = noise3D(0, 0, noiseOffset.value + 100) * (height * 0.1) + height / 2
    const lineLength = noise3D(0, 0, noiseOffset.value + 1000) * maxLineLength + maxLineLength

    const reversedLineAngle = (lineAngle + 180) % 360
    const formX = centerPointX + Math.cos(reversedLineAngle) * lineLength
    const formY = centerPointY + Math.sin(reversedLineAngle) * lineLength
    const toX = centerPointX + Math.cos(lineAngle) * lineLength
    const toY = centerPointY + Math.sin(lineAngle) * lineLength

    context.fillStyle = 'rgba(0,0,0,0.1)'
    context.fillRect(0, 0, width, height)

    context.strokeStyle = '#ffffff'
    context.lineCap = 'round'
    context.lineWidth = 1
    context.beginPath()
    context.moveTo(formX, formY)
    context.lineTo(toX, toY)
    context.stroke()
  })
  return () => (
    <div class={styles.root}>
      <canvas ref={canvasRef} class={styles.canvas} />
    </div>
  )
}
