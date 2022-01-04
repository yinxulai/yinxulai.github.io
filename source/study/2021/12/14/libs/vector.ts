export class Vector2D {
  constructor(public x: number, public y: number) { }

  /**
   * @param  {Vector2D} vector
   */
  add(vector: Vector2D) {
    this.x += vector.x
    this.y += vector.y
    return this
  }

  /**
   * @param  {number} num
   */
  mult(num: number) {
    this.x *= num;
    this.y *= num;
    return this
  }

  /**
   * @param  {number} num
   */
  div(num: number) {
    if (num == 0) console.warn('0 不能作为被除数')
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
  limit(max: number) {
    // 二维空间的求两点距离公式
    const magSq = this.x * this.x + this.y * this.y
    if (magSq > max * max) {
      console.log('input', this.x, this.y, magSq)
      const length = Math.sqrt(magSq)
      this.div(1 / length).mult(max)
      console.log('result', length, this.x, this.y)
    }

    return this
  }
}

// input -9.771784160969357 -3.7048825598900574 109.21392047114911
// result 10.45054641974041 -1021.2048397789437 -387.1804717181772
