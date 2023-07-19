import { createRef, onMounted } from 'airx'
import * as BABYLON from '@babylonjs/core'

import styles from './style.module.less'

// 多层渲染模拟的伪体积云
export function VolumeClouds() {
  const canvasRef = createRef<HTMLCanvasElement | undefined>(undefined)

  onMounted(() => {
    if (canvasRef.value == null) return
  })

  return () => (
    <div class={styles.root}>
      <canvas ref={canvasRef} class={styles.canvas} />
    </div>
  )
}
