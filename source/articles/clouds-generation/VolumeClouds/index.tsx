import { createRef, onMounted } from 'airx'
import * as BABYLON from '@babylonjs/core'

import styles from './style.module.less'

// 多层渲染模拟的伪体积云
export function VolumeClouds() {
  const canvasRef = createRef<HTMLCanvasElement | undefined>(undefined)

  onMounted(() => {
    if (canvasRef.value == null) return

    // 使用 noise 生成体积云效果

    // 创建Babylon.js引擎实例
    const engine = new BABYLON.Engine(canvasRef.value, true)

    const scene = new BABYLON.Scene(engine)

    // 添加光源
    new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene)

    // 渲染循环
    engine.runRenderLoop(() => {
      scene.render()
    })

    // 处理窗口调整事件
    window.addEventListener("resize", () => {
      engine.resize()
    })
  })

  return () => (
    <div class={styles.root}>
      <canvas ref={canvasRef} class={styles.canvas} />
    </div>
  )
}
