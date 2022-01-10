import { Vector2D } from './vector'


// 脑子
export class Brain {
  // 追踪静态的目标
  Seek() { }
  // 逃离静态目标
  Flee() { }
  // 追踪动态目标
  Pursuit() { }
  // 逃离动态目标
  Evasion() { }
  // 躲避障碍
  ObstacleAvoidance() { }
  // 漫步
  Wander() { }
  // 路径跟踪
  PathFollowing() { }
  // 流场跟踪
  FlowFieldFollowing() { }
  // 领袖跟踪
  LeaderFollowing() { }
  // 避免与任意代理发生碰撞
  UnalignedCollisionAvoidance() { }
  // 与其他代理保持距离
  Separation() { }
  // 与其他代理保持方向大致相同
  Alignment() { }
  // 与其他代理不要距离太远
  Cohesion() { }
}

export class Agent {
  private brain: Brain
  private maxSpeed: number
  private maxForce: number

  private velocity: Vector2D // 速度

  position: Vector2D // 位置

  constructor(x = 0, y = 0) {
    this.maxSpeed = 1
    this.maxForce = 1
    this.velocity = new Vector2D(0, 0)
    this.position = new Vector2D(x, y)

    this.brain = new Brain()
  }

  // 应用加速度
  applyAcceleration(acceleration: Vector2D) {
    if (acceleration.magSq() <= 0) return this

    acceleration
      .limitMag(this.maxForce)
    // .limitHeading(Math.PI * 0.1) 限制转向速度

    this.velocity
      .add(acceleration)
      .limitMag(this.maxSpeed)

    return this
  }

  update() {
    if (this.velocity.magSq() > 0) {
      this.position.add(this.velocity)
    }
    return this
  }

  private renderSight(context: CanvasRenderingContext2D) {
    const size = 10
    const angle = this.velocity.heading()
    const toX = this.position.x + Math.cos(angle) * size
    const toY = this.position.y + Math.sin(angle) * size

    context.save()
    context.lineWidth = 1
    context.strokeStyle = 'rgba(0,0,0,.3)'
    context.beginPath()
    context.moveTo(this.position.x, this.position.y)
    context.lineTo(toX, toY)
    context.stroke()
    context.restore()
  }

  private renderBody(context: CanvasRenderingContext2D) {
    const size = 10
    context.save()
    context.beginPath()
    context.lineWidth = 1
    context.strokeStyle = 'rgba(0,0,0,.3)'
    context.arc(this.position.x, this.position.y, size, 0, Math.PI * 2, false)
    context.stroke()

    context.fillStyle = 'rgba(0,0,0,.08)'
    context.fill()
    context.restore()
    return this
  }

  render(context: CanvasRenderingContext2D) {
    this.renderSight(context)
    this.renderBody(context)
  }
}
