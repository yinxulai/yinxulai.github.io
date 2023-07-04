import { Vector2D } from '../../../math/vector'
import { createWorkerPool } from '../../../hooks/use-worker'

interface Size {
  width: number
  height: number
}

interface Block extends Size {
  x: number
  y: number
}

interface WorkerParams extends Block {
  selfCanvas: OffscreenCanvas
  targetCanvas: OffscreenCanvas
}

interface Point {
  x: number
  y: number
}

export abstract class Agent2D {
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
  ) { this.uuid = Agent2D.uuid++ }

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

export abstract class VisibleAgent extends Agent2D {
  /**
   * @param  {RenderingContext} context
   * @returns void
   * @description 可见时的渲染逻辑
   */
  abstract render(context: RenderingContext): void
}

export abstract class Collidable2DAgent extends VisibleAgent {

  protected static workerPool = createWorkerPool((params: WorkerParams): Point | false => {
    // 这个函数必须是确保可以在 webworker 运行的纯函数

    if (params == null) return false
    const { selfCanvas, targetCanvas } = params
    if (!(selfCanvas instanceof OffscreenCanvas)) return false
    if (!(targetCanvas instanceof OffscreenCanvas)) return false
    const selfContext = selfCanvas.getContext('2d')
    const targetContext = targetCanvas.getContext('2d')
    if (selfContext == null) return false
    if (targetContext == null) return false

    const imageDataParams = [0, 0, params.width, params.height] as const
    const selfImageData = selfContext.getImageData(...imageDataParams)
    const targetImageData = targetContext.getImageData(...imageDataParams)

    const conflictPoints: Point[] = []
    for (let x = 0; x < selfImageData.width; x++) {
      for (let y = 0; y < selfImageData.height; y++) {
        const selfAlphaValue = selfImageData.data[((y * selfImageData.width) + x) * 4]
        const targetAlphaValue = targetImageData.data[((y * selfImageData.width) + x) * 4]
        if (selfAlphaValue > 0 && targetAlphaValue > 0) {
          conflictPoints.push({ x, y })
        }
      }
    }

    const sumPoint = conflictPoints.reduce((a, b) => {
      a.x += b.x
      a.y += b.y
      return a
    }, { x: params.x, y: params.y })
  
    sumPoint.x = Math.floor(sumPoint.x / conflictPoints.length)
    sumPoint.y = Math.floor(sumPoint.y / conflictPoints.length)
    return sumPoint
  })

  // private static getPaintedOffscreenCanvas<T extends Collidable2DAgent>(size: Size, agent: T): OffscreenCanvas | null {
  //   const canvas = document.createElement('canvas')
  //   canvas.height = size.height
  //   canvas.width = size.width
  //   const context = canvas.getContext('2d')
  //   if (context == null) return null
  //   agent.render(context)
    
  //   return canvas.transferControlToOffscreen()
  // }

  /**
   * @returns Block
   * @description 用于粗检测
   */
  protected abstract getOutsideBlock(): Block

  /**
   * @param  target
   * @returns void
   * @description 发生碰撞时的处理逻辑
   */
  public async impact<T extends Collidable2DAgent>(target: T): Promise<Point | false> {
    // 先用方块做粗检测
    const selfBlock = this.getOutsideBlock()
    const targetBlock = target.getOutsideBlock()

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

    // 寻找最大外切矩形
    const minX = Math.min(selfX, targetX)
    const minY = Math.min(selfY, targetY)
    const maxDx = Math.max(selfDx, targetDx)
    const maxDy = Math.max(selfDy, targetDy)
    const outsideWidth = maxDx - minX
    const outsideHeight = maxDy - minY
    // const canvasSize: Size = {
    //   height: maxDy,
    //   width: maxDx
    // }

    // 创建 OffscreenCanvas 绘制像素
    const selfCanvas = new OffscreenCanvas(maxDx, maxDy)
    const selfContext = selfCanvas.getContext('2d', { willReadFrequently: true })

    const targetCanvas = new OffscreenCanvas(maxDx, maxDy)
    const targetContext = targetCanvas.getContext('2d', { willReadFrequently: true })

    if (selfContext == null || targetContext == null) return false
    // 继续向下进行像素粒度的碰撞检测
    // TODO targetContext、selfContext 被引用无法传递给 worker
    // https://github.com/whatwg/html/issues/6615

    const worker = await Collidable2DAgent.workerPool.getWorker()

    return worker.exec({
      x: minX,
      y: minY,
      width: outsideWidth,
      height: outsideHeight,
      selfCanvas: selfCanvas,
      targetCanvas: targetCanvas
    }, [selfCanvas, targetCanvas])
  }
}

export class CircleAgent extends Collidable2DAgent {

  private radius: number = 0

  constructor(mass = 1, x = 0, y = 0) {
    super(mass, 5, 5, 0.9, new Vector2D(x, y))
    this.radius = Math.round(8 + this.mass)
  }

  getOutsideBlock(): Block {
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
  private renderBlocks(context: CanvasRenderingContext2D) {
    const blocks = [this.getOutsideBlock()]
    for (let index = 0; index < blocks.length; index++) {
      const block = blocks[index]
      const x = block.x
      const y = block.y
      const dx = block.x + block.width
      const dy = block.y + block.height

      context.beginPath()
      context.lineWidth = 1
      context.strokeStyle = 'rgba(255,0,0,.1)'
      context.rect(x, y, dx - x, dy - y)
      context.stroke()

      context.fillStyle = 'rgba(255,0,0,.08)'
      context.fill()
    }
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
    this.renderBlocks(context)
    this.renderSight(context)
    this.renderBody(context)
  }
}

export class TargetAgent extends Collidable2DAgent {
  private radius: number = 10

  constructor(mass = 1, x = 0, y = 0) {
    super(mass, 0, 0, 0, new Vector2D(x, y))
  }

  getOutsideBlock(): Block {
    return {
      width: this.radius * 2,
      height: this.radius * 2,
      x: this.position.x - this.radius,
      y: this.position.y - this.radius
    }
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
    return this
  }
}
