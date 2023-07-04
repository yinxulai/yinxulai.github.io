import * as THREE from 'three'
import { createRef, watch } from 'airx'
import { makeNoise2D } from 'fast-simplex-noise'
import { useThreeRenderer } from '../../../common/hooks/use-three-renderer'

import styles from './style.module.less'

export function Noise3DPlaneTerrain() {
  const noise2D = makeNoise2D()
  const noiseOffsetRef = createRef<number>(0)
  const canvasRef = createRef<HTMLCanvasElement | undefined>(undefined)

  const threeRenderer = useThreeRenderer(canvasRef)
  const threePlaneRef = createRef<THREE.Mesh | null>(null)
  
  watch(canvasRef, () => {
    if (canvasRef.value == null) return null
    const { width, height } = canvasRef.value
    const geometry = new THREE.PlaneGeometry(
      width * 2,
      height * 8,
      Math.fround(width * 2 / 8),
      Math.fround(height * 8 / 8)
    )

    const material = new THREE.MeshNormalMaterial({ flatShading: true })
    threePlaneRef.value = new THREE.Mesh(geometry, material)
  })

  threeRenderer.onRender(({ scene, camera, size }) => {
    noiseOffsetRef.value += 0.003

    camera.rotation.x = Math.PI * 0.42
    camera.position.x = -380
    camera.position.y = -315
    camera.position.z = 80

    if (threePlaneRef.value == null) return
    if (scene.getObjectById(threePlaneRef.value.id) == null) {
      threePlaneRef.value.position.x = -size.width / 2
      threePlaneRef.value.position.y = -size.height / 2
      scene.add(threePlaneRef.value)
    }

    const positions = threePlaneRef.value.geometry.getAttribute('position')
    for (let i = 0; i < positions.count; i++) {
      const [currentX, currentY] = [positions.getX(i), positions.getY(i)]
      const z = noise2D(currentX * 0.003, currentY * 0.003 + noiseOffsetRef.value)
      positions.setZ(i, Math.fround(z * 60))
      positions.needsUpdate = true
    }
  })

  return () => (
    <div class={styles.root}>
      <canvas ref={canvasRef} class={styles.canvas} />
    </div>
  )
}
