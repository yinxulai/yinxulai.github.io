import { Vector2D } from './vector'


// 脑子
export class Brain {

}

export class Agent {
  private maxSpeed: number
  private maxForce: number

  private velocity: Vector2D // 速度

  position: Vector2D // 位置

  constructor(x = 0, y = 0) {
    this.maxSpeed = 1
    this.maxForce = 1
    this.velocity = new Vector2D(0, 0)
    this.position = new Vector2D(x, y)
  }

  // 应用加速度
  applyAcceleration(acceleration: Vector2D) {
    if (acceleration.magSq() <= 0) return this

    this.velocity
      .add(acceleration.limitMag(this.maxForce).limitHeading(Math.PI * 0.1))
      .limitMag(this.maxSpeed)

    return this
  }

  update() {
    console.log('magSq', this.velocity.magSq())
    if (this.velocity.magSq() > 0) {
      this.position.add(this.velocity)
    }
    return this
  }

  private renderSight(context: CanvasRenderingContext2D) {
    const size = 10
    const angle = this.velocity.heading()
    console.log('angle', angle)
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
