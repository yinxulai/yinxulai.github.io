import { Agent } from './agent'

export class World {
  private agents: Agent[]

  constructor() {
    this.agents = []
  }

  add(agent: Agent) {
    this.agents.push(agent)
  }

  update() {
    for (const agent of this.agents) {
      agent.update()
    }
  }

  render(context: CanvasRenderingContext2D) {
    for (const agent of this.agents) {
      agent.render(context)
    }
  }
}
