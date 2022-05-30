import { round } from '@math/round'
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
  ) { this.uuid = Agent.uuid++ }

  /**
   * @param  {Vector2D} acceleration
   * @description 向 Agent 添加加速度
   */
  public applyForce(acceleration: Vector2D) {
    // 将所有的加速度先添加到 Agent 
    if (acceleration.magSq() <= 0) return this
    acceleration.limitMag(this.maxForce)

    // 速度 = 加速度 / 质量
    const velocity = acceleration.div(this.mass)
    this.velocity.add(velocity).limitMag(this.maxSpeed)
    return this
  }

  /**
   * @description 计算 Agent 的一次生命周期
   */
  public cycle() {
    this.position.add(this.velocity)
    return this
  }
}

export abstract class CollidableAgent extends Agent {
  /**
   * @param  {T} agent
   * @returns void
   * @description 发生碰撞时的处理逻辑
   */
  abstract impact<T extends CollidableAgent>(agent: T): boolean

  /**
   * @returns Array
   * @description 获取用来检测碰撞的方块，可能有多个
   */
  abstract getBlocks(): Array<[Vector2D, Vector2D]>
}

export abstract class VisibleAgent extends CollidableAgent {
  /**
   * @param  {CanvasRenderingContext2D} context
   * @returns void
   * @description 可见时的渲染逻辑
   */
  abstract render(context: CanvasRenderingContext2D): void
}

export class CircleAgent extends VisibleAgent {
  private radius: number = 0

  constructor(mass = 1, x = 0, y = 0) {
    super(mass, 5, 5, 0.9, new Vector2D(x, y))
    this.radius = 8 + this.mass
  }

  getBlocks(): [Vector2D, Vector2D][] {
    // 直接用外切矩形了
    // 细一点可以用多个矩形来组成一个

    return Array([
      new Vector2D(this.position.x - this.radius, this.position.y - this.radius),
      new Vector2D(this.position.x + this.radius, this.position.y + this.radius)
    ])
  }

  /**
   * @param  {T} target
   * @returns void
   * @description 发生碰撞时的处理逻辑
   */
  impact<T extends CollidableAgent>(target: T): boolean {
    const selfBlocks = this.getBlocks()
    const targetBlocks = target.getBlocks()
    const isCollided = selfBlocks.some(selfBlock => targetBlocks.some(targetBlock => {
      const selfX = selfBlock[0].x
      const selfY = selfBlock[0].y
      const selfDx = selfBlock[1].x
      const selfDy = selfBlock[1].y

      const targetX = targetBlock[0].x
      const targetY = targetBlock[0].y
      const targetDx = targetBlock[1].x
      const targetDy = targetBlock[1].y

      return selfX < targetDx && selfDx > targetX && selfY < targetDy && selfDy > targetY
    }))

    //  没有发生碰撞直接退出
    if (!isCollided) return false
    // 不会写，长大后再学习

    // p = mv
    // m1v1 + m2v2 = m1v1' + m2v2'
    // const totalM = this.mass + target.mass // 总质量

    // const selfV = this.velocity.clone().mult((this.mass - target.mass) / totalM)
    //   .add(target.velocity.clone().mult(target.mass * 2 / totalM))

    //   const targetV = target.velocity.clone().mult((target.mass - this.mass) / totalM)
    //   .add(this.velocity.clone().mult(this.mass * 2 / totalM))

    // this.velocity.zero().add(selfV)
    // target.velocity.zero().add(targetV)

    return true
  }

  /**
 * @param  {CanvasRenderingContext2D} context
 * @description 渲染边框
 */
  private renderBlocks(context: CanvasRenderingContext2D) {
    const blocks = this.getBlocks()
    context.save()
    for (let index = 0; index < blocks.length; index++) {
      const block = blocks[index]
      const x = block[0].x
      const y = block[0].y
      const dx = block[1].x
      const dy = block[1].y

      context.beginPath()
      context.lineWidth = 1
      context.strokeStyle = 'rgba(255,0,0,.1)'
      context.rect(x, y, dx - x, dy - y)
      context.stroke()

      context.fillStyle = 'rgba(255,0,0,.08)'
      context.fill()
    }

    context.restore()
  }

  /**
   * @param  {CanvasRenderingContext2D} context
   * @description 渲染边框
   */
  private renderSight(context: CanvasRenderingContext2D) {
    const angle = this.velocity.heading()
    const toX = this.position.x + Math.cos(angle) * this.radius
    const toY = this.position.y + Math.sin(angle) * this.radius

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
    context.save()
    context.beginPath()
    context.lineWidth = 1
    context.strokeStyle = 'rgba(0,0,0,.3)'
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
    context.stroke()

    context.fillStyle = 'rgba(0,0,0,.08)'
    context.fill()
    context.restore()
  }

  /**
   * @param  {CanvasRenderingContext2D} context
   * @description 渲染当前的 Agent 到指定对象
   */
  render(context: CanvasRenderingContext2D) {
    // this.renderBlocks(context)
    this.renderSight(context)
    this.renderBody(context)
  }
}

export class TargetAgent extends VisibleAgent {
  private radius: number = 10

  constructor(mass = 1, x = 0, y = 0) {
    super(mass, 0, 0, 0, new Vector2D(x, y))
  }

  getBlocks(): [Vector2D, Vector2D][] {
    // 直接用外切矩形了
    // 细一点可以用多个矩形来组成一个

    return Array([
      new Vector2D(this.position.x - this.radius, this.position.y - this.radius),
      new Vector2D(this.position.x + this.radius, this.position.y + this.radius)
    ])
  }

  impact<T extends Agent>(agent: T): boolean {
    return false
  }

  render(context: CanvasRenderingContext2D) {
    context.save()
    context.beginPath()
    context.lineWidth = 1
    context.strokeStyle = 'rgba(0,0,0,.3)'
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
    context.stroke()

    context.fillStyle = 'rgba(0,255,0,.08)'
    context.fill()
    context.restore()
    return this
  }
}
