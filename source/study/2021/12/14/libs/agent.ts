import { Vector2D } from './vector'

class Agent {
  static uuid: number
  public readonly uuid: number

  constructor(
    public readonly weight = 1,
    public readonly maxSpeed = 0,
    public readonly maxForce = 0,
    public position = new Vector2D(0, 0),
    public velocity = new Vector2D(0, 0),
    private acceleration = new Vector2D(0, 0),
  ) { this.uuid = Agent.uuid += 1 }

  // 应用加速度
  public applyAcceleration(acceleration: Vector2D) {
    if (acceleration.magSq() <= 0) return this
    acceleration.limitMag(this.maxForce)
    this.acceleration = acceleration
    return this
  }

  public cycle() {
    this.velocity
      .add(this.acceleration)
      .limitMag(this.maxSpeed)

    this.acceleration.zero()

    if (this.velocity.magSq() > 0) {
      this.position.add(this.velocity)
    }

    return this
  }
}

export class Brain {
  private agent: Agent
  constructor(agent: Agent) {
    this.agent = agent
  }

  // 寻找（或追求静态目标）的作用是引导角色朝向全局空间中的指定位置。
  // 此行为会调整代理，使其速度与目标径向对齐。
  // 请注意，这与会在目标点周围产生轨道路径的吸引力（例如重力）不同。
  // “期望速度” 是从角色到目标的方向上的向量。
  // “期望速度” 的长度可以是最大速度，也可以是角色的当前速度，这取决于特定的应用程序。
  // 转向矢量是这个期望速度和角色当前速度之间的差。
  //    目标速度 = limit(位置 - 目标, 最大速度)
  //    转向力 = 目标速度 - 速度
  //    加速度 = 转向力 / 质量
  // 如果一个角色继续寻找，它最终会穿过目标，然后转身再次接近。
  // 这会产生运动，有点像飞蛾在灯泡周围嗡嗡作响。
  public seek(target: Agent) {
    const targetVelocity = this.agent.position
      .clone()
      .sub(target.position)
      .limitMag(this.agent.maxSpeed)

    const acceleration = targetVelocity
      .sub(this.agent.velocity)
      .mult(this.agent.weight)

    this.agent.applyAcceleration(acceleration)
  }

  // 逃离静态目标
  Flee(agent: Agent) { }

  // 追踪动态目标
  Pursuit(agent: Agent) { }

  // 逃离动态目标
  Evasion(agent: Agent) { }

  // 躲避障碍
  ObstacleAvoidance(agents: Agent[]) { }

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

export class CarAgent extends Agent {
  private brain: Brain

  constructor(x = 0, y = 0) {
    super(1, 1, 1, new Vector2D(x, y))
    this.brain = new Brain(this)
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
