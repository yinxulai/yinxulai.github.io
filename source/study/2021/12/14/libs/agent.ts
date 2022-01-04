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
    this.maxSpeed = 10
    this.maxForce = 10
    this.velocity = new Vector2D(0, 0)
    this.position = new Vector2D(x, y)
  }

  // 应用加速度
  applyAcceleration(acceleration: Vector2D) {
    if (acceleration.magSq() <= 0) return

    this.velocity
      .add(acceleration.limit(this.maxForce))
      .limit(this.maxSpeed)

    console.log('applyAcceleration', acceleration, this.velocity)
  }

  update() {
    //根据速度更新位置
    if (this.velocity.magSq() > 0) {
      this.position.add(this.velocity)
    }
  }
}
