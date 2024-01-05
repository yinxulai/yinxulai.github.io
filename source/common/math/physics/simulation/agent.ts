import { Vector2D } from '../../../math/vector'

interface Size {
  width: number
  height: number
}

interface Block extends Size {
  x: number
  y: number
}

interface AgentOptions {
  mass?: number //  = 1, // 质量
  maxSpeed?: number //  = 0, // 最大速度
  maxForce?: number //  = 0, // 最大力
  friction?: number //  = 1, // 摩擦系数
  elasticity?: number //  = 1, // 弹性
  position?: Vector2D //  = new Vector2D(0, 0), // 位置
  velocity?: Vector2D //  = new Vector2D(0, 0), // 速度
}

export abstract class Agent {
  protected static uuid: number = 0
  public readonly uuid: number = 0
  public mass: number = 1 // 质量
  public maxSpeed: number = Infinity // 最大速度
  public maxForce: number = Infinity // 最大力
  public friction: number = 1 // 摩擦系数
  public elasticity: number = 1 // 弹性
  public position: Vector2D = new Vector2D(0, 0) // 位置
  public velocity: Vector2D = new Vector2D(0, 0) // 速度

  constructor(options?: AgentOptions) {
    this.uuid = Agent.uuid++
    this.mass = options?.mass || this.mass
    this.maxSpeed = options?.maxSpeed || this.maxSpeed
    this.maxForce = options?.maxForce || this.maxForce
    this.friction = options?.friction || this.friction
    this.elasticity = options?.elasticity || this.elasticity
    this.position = options?.position || this.position
    this.velocity = options?.velocity || this.velocity
  }

  /**
   * @param  {Vector2D} acceleration
   * @description 向 Agent 添加加速度
   */
  public applyForce(acceleration: Vector2D) {
    if (acceleration.magSq() === 0) return this
    if (this.maxForce !== Infinity) acceleration.limitMag(this.maxForce)

    // 速度 = 加速度 / 质量
    this.velocity.add(acceleration.div(this.mass))
    if (this.maxSpeed !== Infinity) this.velocity.limitMag(this.maxSpeed)
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

export abstract class VisibleAgent extends Agent {
  /**
   * @param  {RenderingContext} context
   * @returns void
   * @description 可见时的渲染逻辑
   */
  abstract render(context: RenderingContext): void
}

export abstract class CollidableAgent extends VisibleAgent {
  /**
   * @returns Block
   * @description 用于粗检测
   */
  protected abstract getPolygonPoints(): Block

  /**
   * @param  target
   * @returns void
   * @description 发生碰撞时的处理逻辑
   */
  public async impact<T extends CollidableAgent>(target: T): Promise<boolean> {
    // 先用方块做粗检测
    const selfBlock = this.getPolygonPoints()
    const targetBlock = target.getPolygonPoints()

    const selfX = selfBlock.x
    const selfY = selfBlock.y
    const selfDx = selfBlock.x + selfX
    const selfDy = selfBlock.y + selfY

    const targetX = targetBlock.x
    const targetY = targetBlock.y
    const targetDx = targetBlock.x + targetX
    const targetDy = targetBlock.y + targetY
    const isCollided = selfX < targetDx && selfDx > targetX && selfY < targetDy && selfDy > targetY

    //  没有发生碰撞直接退出
    if (!isCollided) return false
    // 核心算法如下：
    // 1、分别在两块 canvas 绘制图形
    // 2、交给 web worker 去计算相交点

    return true
  }
}

interface CircleAgentOptions extends AgentOptions {
  radius?: number
}

export class CircleAgent extends CollidableAgent {

  private radius: number = 0

  constructor(options?: CircleAgentOptions) {
    const { radius, ...rest } = options || {}
    super(rest)
    this.radius = radius || Math.round(8 + this.mass)
  }

  getPolygonPoints(): Block {
    return {
      x: this.position.x - this.radius,
      y: this.position.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2
    }
  }

  protected renderPixel(context: CanvasRenderingContext2D): void {
    this.renderSight(context)
    this.renderBody(context)
  }

  /**
   * @param  {CanvasRenderingContext2D} context
   * @description 渲染边框
   */
  private renderSight(context: CanvasRenderingContext2D) {
    const angle = this.velocity.heading()
    const toX = this.position.x + Math.cos(angle) * this.radius
    const toY = this.position.y + Math.sin(angle) * this.radius

    context.lineWidth = 1
    context.strokeStyle = 'rgba(0,0,0,.3)'
    context.beginPath()
    context.moveTo(this.position.x, this.position.y)
    context.lineTo(toX, toY)
    context.stroke()
  }

  /**
   * @param  {RenderingContext} context
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
  }

  /**
   * @param  {CanvasRenderingContext2D} context
   * @description 渲染当前的 Agent 到指定对象
   */
  render(context: CanvasRenderingContext2D) {
    this.renderSight(context)
    this.renderBody(context)
  }
}
