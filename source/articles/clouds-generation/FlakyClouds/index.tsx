import * as BABYLON from '@babylonjs/core'
import { createRef, onMounted } from 'airx'

import styles from './style.module.less'

// 基本的面片云
export function FlakyClouds() {
  const canvasRef = createRef<HTMLCanvasElement | undefined>(undefined)

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

    }

    engine.runRenderLoop(() => scene.render())

    const listener = () => engine!.resize()
    window.addEventListener("resize", listener)
    return () => window.removeEventListener("resize", listener)
  })


  return () => (
    <div class={styles.root}>
      <canvas ref={canvasRef} class={styles.canvas} />
    </div>
  )
}

// n 多面片交叉组成的伪体积云
export function StaggeredFlakyClouds() {}
