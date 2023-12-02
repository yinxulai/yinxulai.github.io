import * as THREE from 'three'
import { createRef } from 'airx'
import { makeNoise3D } from 'fast-simplex-noise'
import { useThreeRenderer } from '../../../common/hooks/use-three-renderer'

import { generateTextureImageData } from '../Noise2dTerrain/'

import styles from './style.module.less'


export function Noise3dTerrain() {
  // let frequency = 0.01
  const noise3D = makeNoise3D()
  const threeCanvasRef = createRef<HTMLCanvasElement | undefined>(undefined)

  const threeRenderer = useThreeRenderer(threeCanvasRef)

  // 灯光
  const mainLight = new THREE.HemisphereLight(0x000000, 0xffffff, 0.95)
  mainLight.position.set(0, -50, -100)
  const ambientLight = new THREE.AmbientLight(0xaaccff, 0.35)
  ambientLight.position.set(-200, -100, 200)
  const sunLight = new THREE.DirectionalLight(0xffffff)
  sunLight.position.set(0, -50, -100)
  sunLight.castShadow = true

  const geometrySize = 600
  const geometryGridSize = 600

  const geometry = new THREE.PlaneGeometry(
    geometrySize, geometrySize,
    geometryGridSize, geometryGridSize
  )

  const positions = geometry.getAttribute('position')
  for (let i = 0; i < positions.count; i++) {
    positions.needsUpdate = true
    const x = positions.getX(i)
    const y = positions.getY(i)
    const z = positions.getZ(i)
    let newZ = noise3D(x * 0.005, y * 0.005, z * 0.005) * 40 // 低频地形
    newZ += noise3D(x * 0.03, y * 0.03, z * 0.03) * 5 // 中频细节
    newZ += noise3D(x * 0.1, y * 0.1, z * 0.1)  // 高频细节

    // 根据点与画布中心的距离调整权重
    // const distance = Math.sqrt(x * x + y * y)
    // const distanceRatio = distance / (geometryGridSize / 2)
    // newZ = (1 - distanceRatio) * newZ

    positions.setZ(i, newZ )
  }

  const material = new THREE.MeshPhongMaterial({
    color: 0xdfdfdf,
    flatShading: true
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = true

  threeRenderer.onRender(({ renderer, scene, camera }) => {
    renderer.shadowMap.enabled = true

    if (!scene.getObjectById(mesh.id)) {
      camera.lookAt(mesh.position)
      mesh.rotation.x = Math.PI * -0.5
      mesh.position.set(0, 0, 0)
      scene.add(mesh)
    }

    if (!scene.getObjectById(mainLight.id)) {
      scene.add(mainLight)
    }

    if (!scene.getObjectById(ambientLight.id)) {
      scene.add(ambientLight)
    }

    if (!scene.getObjectById(sunLight.id)) {
      scene.add(sunLight)
    }

    mesh.rotateZ(Math.PI * 0.0001)
  })

  return () => (
    <div class={styles.root}>
      <canvas ref={threeCanvasRef} class={styles.canvas} />
    </div>
  )
}


export function Noise3dCartoonTerrain() {
  let frequency = 0.01
  const noise3D = makeNoise3D()
  const threeCanvasRef = createRef<HTMLCanvasElement | undefined>(undefined)
  // const textureCanvasRef = createRef<HTMLCanvasElement | undefined>(undefined)

  const threeRenderer = useThreeRenderer(threeCanvasRef)

  // 灯光
  const mainLight = new THREE.HemisphereLight(0x000000, 0xffffff, 0.95)
  mainLight.position.set(0, -50, -100)
  const ambientLight = new THREE.AmbientLight(0xaaccff, 0.35)
  ambientLight.position.set(-200, -100, 200)
  const sunLight = new THREE.DirectionalLight(0xffffff)
  sunLight.position.set(0, -50, -100)
  sunLight.castShadow = true

  const geometrySize = 600
  const geometryGridSize = 600

  const geometry = new THREE.PlaneGeometry(
    geometrySize, geometrySize,
    geometryGridSize, geometryGridSize
  )

  const textureMapData: number[] = []
  const textureMapInfo = { max: 0, min: 0 }

  const positions = geometry.getAttribute('position')
  for (let i = 0; i < positions.count; i++) {
    positions.needsUpdate = true
    const x = positions.getX(i)
    const y = positions.getY(i)
    const z = positions.getZ(i)
    let newZ = (noise3D(x * frequency, y * frequency, z * frequency) + 1) / 2 // 低频地形

    // const newZ1 = noise3D(x * 0.03, y * 0.03, z * 0.03) * 4 // 中频细节
    // const newZ2 = noise3D(x * 0.1, y * 0.1, z * 0.1)  // 高频细节

    // 根据点与画布中心的距离调整权重
    const distance = Math.sqrt(x * x + y * y)
    const distanceRatio = distance / (geometryGridSize / 2)
    newZ = (1 - distanceRatio) * newZ

    positions.setZ(i, newZ * 80)

    // 统计最大最小值方便做归一化
    if (newZ > textureMapInfo.max) textureMapInfo.max = newZ
    if (newZ < textureMapInfo.min) textureMapInfo.min = newZ
    const h = newZ / (textureMapInfo.max - textureMapInfo.min)
    textureMapData[i] = h
  }

  const textureImageData = generateTextureImageData(textureMapData, geometryGridSize + 1, geometryGridSize + 1)
  const texture = new THREE.CanvasTexture(textureImageData)

  // texture.wrapS = THREE.ClampToEdgeWrapping
  // texture.wrapT = THREE.ClampToEdgeWrapping
  texture.mapping = THREE.UVMapping
  // texture.colorSpace = THREE.SRGBColorSpace

  const material = new THREE.MeshBasicMaterial({ map: texture })
  // const material = new THREE.MeshPhongMaterial({
  //   color: 0xdfdfdf,
  //   flatShading: true,
  //   map: texture
  //   // wireframe: true
  // })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = true

  threeRenderer.onRender(({ renderer, scene, camera }) => {
    renderer.shadowMap.enabled = true

    if (!scene.getObjectById(mesh.id)) {
      camera.lookAt(mesh.position)
      mesh.rotation.x = Math.PI * -0.5
      mesh.position.set(0, 0, 0)
      scene.add(mesh)
    }

    if (!scene.getObjectById(mainLight.id)) {
      scene.add(mainLight)
    }

    if (!scene.getObjectById(ambientLight.id)) {
      // scene.add(ambientLight)
    }

    if (!scene.getObjectById(sunLight.id)) {
      scene.add(sunLight)
    }

    mesh.rotateZ(Math.PI * 0.0001)
  })

  // onMounted(() => {
  //   // 画到画布上看看效果
  //   if (textureCanvasRef.value == null) return
  //   textureCanvasRef.value.width = geometryGridSize
  //   textureCanvasRef.value.height = geometryGridSize
  //   textureCanvasRef.value.getContext('2d')?.putImageData(textureImageData, 0, 0)
  // })

  return () => (
    <div class={styles.root}>
      <canvas ref={threeCanvasRef} class={styles.canvas} />
      {/* <canvas ref={textureCanvasRef} class={styles.canvas} /> */}
    </div>
  )
}
