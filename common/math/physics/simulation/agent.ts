import { Vector2D } from '@math/vector'

export abstract class Agent {
  protected static uuid: number = 0
  public readonly uuid: number = 0

  constructor(
    public readonly mass = 1, // 质量
    public readonly maxSpeed = 0, // 最大速度
    public readonly maxForce = 0, // 最大力
    // public readonly friction = 1, // 摩擦系数
    public readonly elasticity = 1, // 弹性
    public position = new Vector2D(0, 0), // 位置
    public velocity = new Vector2D(0, 0), // 速度
    protected acceleration = new Vector2D(0, 0), // 加速度
  ) { this.uuid = Agent.uuid++ }

  /**
   * @param  {Vector2D} acceleration
   * @description 向 Agent 添加加速度
   */
  public applyForce(acceleration: Vector2D) {
    // 将所有的加速度先添加到 Agent 
    if (acceleration.magSq() <= 0) return this
    acceleration.limitMag(this.maxForce)
    this.acceleration.add(acceleration)
    return this
  }

  /**
   * @description 计算 Agent 的一次生命周期
   */
  protected cycle() {
    // 速度 = 加速度 / 质量
    const velocity = this.acceleration.div(this.mass)
    this.velocity.add(velocity).limitMag(this.maxSpeed)
    this.position.add(this.velocity)

    // 清除加速度
    this.acceleration.zero()
    return this
  }
}

export abstract class VisibleAgent extends Agent {
  abstract render(context: CanvasRenderingContext2D): void
}

export class CircleAgent extends VisibleAgent {
  constructor(mass = 1, x = 0, y = 0) {
    super(mass, 10, 10, 0.8, new Vector2D(x, y))
  }

  /**
   * @param  {CanvasRenderingContext2D} context
   * @description 渲染边框
   */
  private renderSight(context: CanvasRenderingContext2D) {
    const size = 8 + this.mass
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

  /**
   * @param  {CanvasRenderingContext2D} context
   * @description 渲染身体
   */
  private renderBody(context: CanvasRenderingContext2D) {
    const size = 8 + this.mass
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

  /**
   * @param  {CanvasRenderingContext2D} context
   * @description 渲染当前的 Agent 到指定对象
   */
  render(context: CanvasRenderingContext2D) {
    this.cycle()
    this.renderSight(context)
    this.renderBody(context)
  }
}

export class TargetAgent extends VisibleAgent {
  constructor(mass = 1, x = 0, y = 0) {
    super(mass, 0, 0, 0, new Vector2D(x, y))
  }

  render(context: CanvasRenderingContext2D) {
    const size = 10
    context.save()
    context.beginPath()
    context.lineWidth = 1
    context.strokeStyle = 'rgba(0,0,0,.3)'
    context.arc(this.position.x, this.position.y, size, 0, Math.PI * 2, false)
    context.stroke()

    context.fillStyle = 'rgba(0,255,0,.08)'
    context.fill()
    context.restore()
    return this
  }
}
