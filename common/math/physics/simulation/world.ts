import { Vector2D } from '@math/vector'
import { Agent, CollidableAgent, VisibleAgent } from './agent'


export class World<T extends Agent = Agent> {
  constructor(
    public readonly width: number = Infinity,
    public readonly height: number = Infinity,
    public readonly gravity = new Vector2D(0, 0.1),
    public readonly attraction: number = 6.67428e-11 // 万有引力常数
  ) { }

  private agentMap = new Map<number, T>()

  /**
   * @param  {T} agent
   * @description 添加一个代理对象到世界中
   */
  addAgent(agent: T) {
    if (this.agentMap.has(agent.uuid)) {
      throw new Error(`agent has existed: ${agent.uuid}`)
    }

    // if (this.agentMap.size >= 300) {
    //   console.warn('the world is too crowded.')
    //   return
    // }

    this.agentMap.set(agent.uuid, agent)
  }

  /**
   * @param  {T} agent
   * @description 从世界移除一个代理对象
   */
  removeAgent(agent: T) {
    if (!this.agentMap.has(agent.uuid)) {
      throw new Error(`agent does not existed: ${agent.uuid}`)
    }

    this.agentMap.delete(agent.uuid)
  }

  /**
   * @param  {(agent:T)=>void} callback
   * @description 遍历世界中的代理对象
   */
  forEachAgent(callback: (agent: T) => void) {
    this.agentMap.forEach(item => callback(item))
  }

  /**
   * @param  {T} agent
   * @description 检查代理对象是否已经接触到世界边缘，对于没有弹性的对象，将会掉出这个世界，具有弹性的对象会根据对象的弹性受到作用力
   */
  private checkEdges(agent: T) {
    if (this.width !== Infinity && agent.position.x >= this.width) {
      agent.position.x = this.width
      agent.velocity.x *= -(agent.elasticity) // TODO: 不要直接修改向量里的值
    } else if (agent.position.x <= 0) {
      agent.velocity.x *= -(agent.elasticity) // TODO: 不要直接修改向量里的值
      agent.position.x = 0
    }

    if (this.height !== Infinity && agent.position.y >= this.height) {
      agent.position.y = this.height
      agent.velocity.y *= -(agent.elasticity) // TODO: 不要直接修改向量里的值
    } else if (agent.position.y <= 0) {
      agent.velocity.y *= -(agent.elasticity) // TODO: 不要直接修改向量里的值
      agent.position.y = 0
    }
  }

  /**
   * @param  {T} agent
   * @description 添加重力
   */
  private applyGravity(agent: T) {
    // 重力与代理的质量成正比关系
    const gravity = this.gravity.clone().mult(agent.mass)
    agent.applyForce(gravity)
  }

  /**
   * @param  {T} a
   * @param  {T} b
   * @description 万有引力，所以让我们为每个对象之间添加相互的引力
   */
  private applyAttractor(a: T, b: T) {
    const force = a.position.clone().sub(b.position)
    const force2 = b.position.clone().sub(a.position)
    const distanceSq = force.magSq() // 距离平方
    if (distanceSq === 0) return
    const f = (this.attraction * a.mass * b.mass) / distanceSq

    force.normalize()
    force.mult(f)
    b.applyForce(force)

    force2.normalize()
    force2.mult(f)
    a.applyForce(force2)
  }

  /**
   * @param  {T} agent
   * @description 应用相互作用力
   */
  private applyInteraction(agent: T) {
    const reactedSet = new Set<string>()
    this.forEachAgent(targetAgent => {
      if (agent.uuid === targetAgent.uuid) return
      // 确保两两之间只进行一次计算
      const key = `${agent.uuid}:${targetAgent.uuid}`
      const rKey = `${targetAgent.uuid}:${agent.uuid}`
      if (reactedSet.has(key) || reactedSet.has(rKey)) return

      this.applyAttractor(agent, targetAgent) // 基本的万有引力
      // 摩檫力
      // 吸引力

      // 碰撞检查
      if (agent instanceof CollidableAgent) {
        if (targetAgent instanceof CollidableAgent) {
          agent.impact(targetAgent)
        }
      }

      reactedSet.add(key)
      reactedSet.add(rKey)
    })
  }

  /**
    * @description 使这个世界向前运行进一个周期
    */
  private cycle(agent: T) {
    this.checkEdges(agent)
    this.applyGravity(agent)
    this.applyInteraction(agent)
  }

  /**
 * @param  {CanvasRenderingContext2D} context
 * @description 渲染这个世界的一些信息到画布上
 */
  private renderInfo(context: CanvasRenderingContext2D) {
    const padding = 10
    const fontSize = 12
    const fontHeight = fontSize * 2

    context.textAlign = 'left'
    context.textBaseline = 'middle'
    context.fillStyle = "#000000FF"
    context.font = `bold ${fontSize}px serif`

    const textList = [
      `agent count: ${this.agentMap.size}`,
      `gravity(Sq): ${this.gravity.magSq().toFixed(4)}`,
      `attraction: ${this.attraction}`
    ]

    textList.forEach((text, index) => {
      context.fillText(text, padding, ((index + 1) * fontHeight))
    })
  }

  /**
   * @param  {CanvasRenderingContext2D} context
   * @description 渲染这个世界到指定的画布上
   */
  render(context: CanvasRenderingContext2D) {
    this.renderInfo(context)

    this.forEachAgent(agent => {
      this.cycle(agent)
      agent.cycle()
      if (agent instanceof VisibleAgent) {
        agent.render(context)
      }
    })
  }
}
