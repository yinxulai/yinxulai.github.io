import { createRef } from 'airx'
import { makeNoise2D } from 'fast-simplex-noise'
import { useCanvasRenderer } from '../../../common/hooks/use-canvas-renderer'

import styles from './style.module.less'

export function generateTextureImageData(map: number[], width: number, height: number): ImageData {
  const image = new ImageData(width, height)

  function getAltitudeColor(altitude: number) {
    if (altitude < 0.1) {
      return [18, 174, 194, 255]
    } else if (altitude < 0.2) {
      return [247, 183, 159, 255]
    } else if (altitude < 0.5) {
      return [92, 181, 96, 255]
    } else if (altitude < 0.6) {
      return [31, 136, 117, 255]
    } else if (altitude < 0.8) {
      return [94, 109, 129, 255]
    }

    return [255, 255, 255, 255]
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const altitude = map[y * width + x]
      const [r, g, b, a] = getAltitudeColor(altitude)
      const dataIndex = (y * width + x) * 4
      image.data[dataIndex] = r
      image.data[dataIndex + 1] = g
      image.data[dataIndex + 2] = b
      image.data[dataIndex + 3] = a
    }
  }

  return image
}

export function Noise2dTerrain() {
  let frequency = 0.01

  const noise2D = makeNoise2D()
  const canvasRef = createRef<HTMLCanvasElement | undefined>(undefined)
  const canvasRenderer = useCanvasRenderer(canvasRef, '2d')

  function generateAltitudeData(width: number, height: number): number[] {
    const altitudeData: number[] = []

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let baseAltitude = (noise2D(x * frequency, y * frequency) + 1) / 2 // 值区间 [0,1]

        // 根据点与画布中心的距离调整权重
        const distanceX = x - width / 2
        const distanceY = y - height / 2
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
        const distanceRatio = distance / (width / 2) * 1.6
        const altitude = (1 - distanceRatio) * baseAltitude
        altitudeData.push(altitude)
      }
    }

    return altitudeData
  }

  let inited = false
  canvasRenderer.onRender(({ context, size }) => {
    if (!inited) {
      context.clearRect(0, 0, size.width, size.height)
      const map = generateAltitudeData(size.width, size.height)
      const image = generateTextureImageData(map, size.width, size.height)
      context.putImageData(image, 0, 0)
      inited = true
    }
  })

  return () => (
    <div class={styles.root}>
      <canvas ref={canvasRef} class={styles.canvas} />
    </div>
  )
}
