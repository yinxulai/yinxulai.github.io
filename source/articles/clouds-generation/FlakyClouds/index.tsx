import * as BABYLON from '@babylonjs/core'
import { createRef, onMounted } from 'airx'
import { Worley, Simplex } from '../../../common/math/noise'

import styles from './style.module.less'

// 基本的面片云
export function FlakyClouds() {
  const worleyNoise = new Worley()
  const simplexNoise = new Simplex()
  const canvasRef = createRef<HTMLCanvasElement | undefined>(undefined)
  const textureCanvasRef = createRef<HTMLCanvasElement | undefined>(undefined)


  function generateTextureImageData(width: number, height: number): ImageData {
    let worleyFrequency = 0.005
    let simplexFrequency = 0.005
    const image = new ImageData(width, height)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const wn = worleyNoise.Euclidean(x * worleyFrequency, y * worleyFrequency, 0)
        const sn = (simplexNoise.noise(x * simplexFrequency, y * simplexFrequency, 0)) + 1 / 2
        // console.log(wn, sn)
        const gary = Math.floor(255 * wn[0] * sn) * 0.8
        
        const dataIndex = (y * width + x) * 4
        image.data[dataIndex] = gary
        image.data[dataIndex + 1] = gary
        image.data[dataIndex + 2] = gary
        image.data[dataIndex + 3] = 255
      }
    }

    return image
  }


  onMounted(() => {
    if (canvasRef.value == null) return
    const engine = new BABYLON.Engine(canvasRef.value, true)
    const scene = new BABYLON.Scene(engine)

    const camera = new BABYLON.FreeCamera(
      "mainCamera",
      new BABYLON.Vector3(0, 5, -10),
      scene
    )

    camera.setTarget(BABYLON.Vector3.Zero())
    camera.attachControl(canvasRef, true)

    function createCloud() {
      const ground = BABYLON.MeshBuilder.CreatePlane("ground", { size: 50.0 }, scene)
      ground.position = new BABYLON.Vector3(0, 0, 0)
      ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0)
  
      const material = new BABYLON.StandardMaterial("groundMat", scene)
      material.diffuseColor = new BABYLON.Canvas()
      material.backFaceCulling = true
      material.alpha = 1
      ground.material = material
    }

    createCloud()

    engine.runRenderLoop(() => scene.render())

    const listener = () => engine!.resize()
    window.addEventListener("resize", listener)
    return () => window.removeEventListener("resize", listener)
  })

  onMounted(() => {
    // 画到画布上看看效果
    if (textureCanvasRef.value == null) return
    const image = generateTextureImageData(400, 400)
    textureCanvasRef.value.width = image.width
    textureCanvasRef.value.height = image.height
    textureCanvasRef.value.getContext('2d')?.putImageData(image, 0, 0)
  })

  return () => (
    <div class={styles.root}>
      <canvas ref={canvasRef} class={styles.canvas} />
      <canvas ref={textureCanvasRef} class={styles.canvas} />
    </div>
  )
}

// n 多面片交叉组成的伪体积云
export function StaggeredFlakyClouds() {}
