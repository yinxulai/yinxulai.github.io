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
   * @param  {Vector2D} vector
   */
  add(vector: Vector2D) {
    this.isFinite()
    this.x += vector.x
    this.y += vector.y
    return this
  }

  /**
   * @param  {number} num
   */
  mult(num: number) {
    this.isFinite()
    this.x *= num;
    this.y *= num;
    return this
  }

  /**
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

  /**
   */
  zero() {
    this.x = 0
    this.y = 0
    return this
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
    // TODO: WIP
    const heading = this.heading()
    if (heading <= max) return this
    this.x = Math.cos(heading)
    this.y = Math.sin(heading)
    return this
  }
}
