import * as THREE from 'three'
import { createRef } from 'airx'
import { makeNoise2D } from 'fast-simplex-noise'
import { useThreeRenderer } from '../../../common/hooks/use-three-renderer'

import styles from './style.module.less'

export function Noise3dBoxTerrain() {

  const boxSize = 20
  const noise2D = makeNoise2D()
  const noiseOffset = createRef<number>(0)
  const canvasRef = createRef<HTMLCanvasElement | undefined>(undefined)
  const threeRenderer = useThreeRenderer(canvasRef)

  const geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize, 1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ wireframe: true })
  const box = new THREE.Mesh(geometry, material)

  threeRenderer.onRender(({ scene, camera, size }) => {
    noiseOffset.value += 0.01

    const mapWidth = size.width * 2
    const mapHeight = size.height * 3

    scene.clear()
    camera.position.y = 8
    camera.position.z = 260
    camera.position.x = mapWidth / 2
    camera.rotation.x = Math.PI * 0.3

    if (box == null) return
    for (let x = 0; x < mapWidth; x += boxSize) {
      for (let y = 0; y < mapHeight; y += boxSize) {
        const noiseValue = noise2D(x * 0.002, y * 0.002 + noiseOffset.value) * 80
        const z = Math.floor(noiseValue - (noiseValue % boxSize))
        const currentBox = box.clone()
        currentBox.position.x = x
        currentBox.position.y = y
        currentBox.position.z = z
        scene.add(currentBox)
      }
    }
  })

  return () => (
    <div class={styles.root}>
      <canvas ref={canvasRef} class={styles.canvas} />
    </div>
  )
}
