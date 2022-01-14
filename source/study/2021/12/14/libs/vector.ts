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
  mult(num: number) {
    this.isFinite()
    this.x *= num;
    this.y *= num;
    return this
  }

  /**
   * 除
   * @param  {number} num
   */
  div(num: number) {
    if (num == 0) {
      throw new Error('0 不能作为被除数:')
    }

    this.isFinite()
    this.x /= num;
    this.y /= num;
    return this
  }

  mag(): number {
    return Math.sqrt(this.magSq())
  }

  magSq(): number {
    return this.x * this.x + this.y * this.y
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

  heading() {
    return Math.atan2(this.y, this.x)
  }

  limitHeading(max: number) {
    const heading = this.heading()
    if (heading >= max) {
      const mag = this.mag()
      this.x = Math.cos(max) * mag
      this.y = Math.sin(max) * mag
      return this
    }

    if (heading >= Math.PI - max) {
      const mag = this.mag()
      this.x = Math.cos(Math.PI - max) * mag
      this.y = Math.sin(Math.PI - max) * mag
    }

    console.log(this.heading())
    return this
  }
}
