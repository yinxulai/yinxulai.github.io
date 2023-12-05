import { createRef } from 'airx'
import { PhysicsWorld } from '../../../common/math/physics/simulation/world'

import styles from './style.module.less'
import { CircleAgent } from '../../../common/math/physics/simulation/agent'
import { useCanvasRenderer } from '../../../common/hooks/use-canvas-renderer'
import { Vector2D } from '../../../common/math/vector'

export function Game() {
  const canvasRef = createRef<HTMLCanvasElement | undefined>(undefined)
  const canvasRender = useCanvasRenderer(canvasRef, '2d')
  let physicsWorld: PhysicsWorld | undefined = undefined


  const handleClick = (event: MouseEvent) => {
    const element = event.target as HTMLCanvasElement
    var x = event.clientX - element.offsetLeft // 相对元素的 x 位置
    var y = event.clientY - element.offsetTop // 相对元素的 y 位置
    if (physicsWorld != null) {
      physicsWorld.addAgent(new CircleAgent({
        mass: Math.floor(Math.random() * 8),
        position: new Vector2D(x, y)
      }))
    }
  }

  canvasRender.onRender(({ context, size }) => {
    if (physicsWorld == null) {
      physicsWorld = new PhysicsWorld(size.width, size.height)
    }

    context.clearRect(0, 0, size.width, size.height)
    physicsWorld.render(context)
  })

  return () => (
    <div class={styles.root}>
      <canvas
        ref={canvasRef}
        class={styles.canvas}
        onClick={handleClick}
      />
    </div>
  )
}
