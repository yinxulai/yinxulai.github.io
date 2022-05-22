export class Vector2D {
  constructor(public x: number, public y: number) { }

  private isFinite() {
    if (!Number.isFinite(this.x)) {
      throw new Error(`x 不是一个有效的值: ${this.x}`)
    }
    if (!Number.isFinite(this.y)) {
      throw new Error(`y 不是一个有效的值: ${this.y}`)
    }
  }

  /**
   * 归零
   */
  zero() {
    this.x = 0
    this.y = 0
    return this
  }

  /**
  * 克隆
  */
  clone() {
    return new Vector2D(
      this.x,
      this.y
    )
  }

  /**
   * 加
   * @param  {Vector2D} vector
   */
  add(vector: Vector2D) {
    this.isFinite()
    this.x += vector.x
    this.y += vector.y
    return this
  }

  /**
   * 减
   * @param  {Vector2D} vector
   */
  sub(vector: Vector2D) {
    this.isFinite()
    this.x -= vector.x
    this.y -= vector.y
    return this
  }

  /**
   * 乘
   * @param  {number} num
   */
  mult(target: number) {
    this.isFinite()
    this.x *= target
    this.y *= target
    return this
  }

  /**
   * 除
   * @param  {number} num
   */
  div(target: number) {
    if (target == 0) {
      throw new Error('0 不能作为被除数:')
    }

    this.isFinite()
    this.x /= target
    this.y /= target
    return this
  }

  rotate(radian: number) {
    const newHeading = this.heading() + radian
    const mag = this.mag()

    this.x = Math.cos(newHeading) * mag
    this.y = Math.sin(newHeading) * mag
    return this
  }

  magSq(): number {
    return this.x * this.x + this.y * this.y
  }

  mag(): number {
    return Math.sqrt(this.magSq())
  }

  /**
   * @param  {number} max
   */
  limitMag(max: number) {
    const magSq = this.magSq()
    if (magSq > max * max) {
      const length = Math.sqrt(magSq)
      if (length === 0) return this
      this.div(length).mult(max)
    }

    return this
  }
  
  /**
   * 归一化
   */
  normalize() {
    this.div(this.mag())
  }

  heading() {
    return Math.atan2(this.y, this.x)
  }

  limitHeading(radian: number) {
    const halfRadian = radian / 2
    const heading = this.heading()
    const isNegative = heading < 0
    if (Math.abs(heading) > halfRadian) {
      const distance = heading - halfRadian
      this.rotate(isNegative ? distance: -distance)
    }
    return this
  }
}
