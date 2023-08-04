export class Vector2D {
  constructor(public x: number, public y: number) {}

  private isFinite() {
    if (!Number.isFinite(this.x)) {
      throw new Error(`x 不是一个有效的值: ${this.x}`)
    }
    if (!Number.isFinite(this.y)) {
      throw new Error(`y 不是一个有效的值: ${this.y}`)
    }
  }

  /** 归零 */
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
  * 两个向量是否相等
  */
  equal(vector: Vector2D) {
    return this.x === vector.x
      && this.y === vector.y
  }

  /** 加
   * @param  {Vector2D} vector */
  add(vector: Vector2D) {
    this.isFinite()
    this.x += vector.x
    this.y += vector.y
    return this
  }

  /** 减
   * @param  {Vector2D} vector */
  sub(vector: Vector2D) {
    this.isFinite()
    this.x -= vector.x
    this.y -= vector.y
    return this
  }

  /** 乘
   * @param  {number} num */
  mult(target: number) {
    this.isFinite()
    this.x *= target
    this.y *= target
    return this
  }

  /** 除
   * @param  {number} num */
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

  /** @param  {number} max */
  limitMag(max: number) {
    const magSq = this.magSq()
    if (magSq > max * max) {
      const length = Math.sqrt(magSq)
      if (length === 0) return this
      this.div(length).mult(max)
    }

    return this
  }

  /** 归一化 */
  normalize() {
    this.div(this.mag())
    return this
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
      this.rotate(isNegative ? distance : -distance)
    }
    return this
  }
}

export type Vector =
  | [number]
  | [number, number]
  | [number, number, number]
  | [number, number, number, number]

export const Vector = {
  /** 克隆 */
  clone<T extends Vector>(vector: T): T {
    return vector.slice() as T
  },

  /** 归零 */
  zone<T extends Vector>(vector: T): T {
    for (let index = 0; index < vector.length; index++) {
      vector[index] = 0
    }

    return vector
  },


  /** 归一化 */
  normalize<T extends Vector>(vector: T): T {
    const magnitude = Vector.magnitude(vector)
    return vector.map(component => component / magnitude) as T
  },

  /**
  * 向量是否相等
  */
  equal(...vectors: Vector[]): boolean {
    const maxLength = Math.max(...vectors.map(vector => vector.length))
    for (let index = 0; index < maxLength; index++) {
      const firstValue = vectors[0]
      for (let index = 1; index < vectors.length; index++) {
        if (firstValue !== vectors[index]) return false
      }
    }

    return true
  },

  /**
  * 向量维度是否相等
  */
  equalDimension(...vectors: Vector[]): boolean {
    const dimensions = Math.max(...vectors.map(vector => vector.length))
    for (let index = 0; index < dimensions; index++) {
      const firstLength = vectors.length
      for (let index = 1; index < vectors.length; index++) {
        if (firstLength !== vectors.length) return false
      }
    }

    return true
  },

  /** 加 */
  add<T extends Vector>(vector1: T, vector2: T): T {
    if (vector1.length !== vector2.length) {
      throw new Error('只有同维向量才能相加')
    }

    const newVector: T = [] as unknown as T
    for (let offset = 0; offset < vector1.length; offset++) {
      newVector[offset] += vector1[offset] + vector2[offset]
    }

    return newVector
  },

  /** 减 */
  subtract<T extends Vector>(vector1: T, vector2: T): T {
    if (vector1.length !== vector2.length) {
      throw new Error('只有同维向量才能相减')
    }

    const newVector: T = [] as unknown as T
    for (let offset = 0; offset < vector1.length; offset++) {
      newVector[offset] += vector1[offset] - vector2[offset]
    }

    return newVector
  },

  /** 乘 */
  multiply<T extends Vector>(vector1: T, vector2: T): T {
    if (vector1.length !== vector2.length) {
      throw new Error('只有同维向量才能相乘')
    }

    const newVector: T = [] as unknown as T
    for (let offset = 0; offset < vector1.length; offset++) {
      newVector[offset] += vector1[offset] * vector2[offset]
    }

    return newVector
  },

  // dotMultiply<T extends Vector>(vector: T, factor: number): T {
  //   return vector.map((value) => value * factor) as T
  // },

  /** 除 */
  divide<T extends Vector>(vector1: T, vector2: T): T {
    if (vector1.length !== vector2.length) {
      throw new Error('只有同维向量才能相除')
    }

    const newVector: T = [] as unknown as T
    for (let offset = 0; offset < vector1.length; offset++) {
      newVector[offset] += vector1[offset] / vector2[offset]
    }

    return newVector
  },

  // dotDivide<T extends Vector>(vector: T, factor: number): T {
  //   return vector.map((value) => value / factor) as T
  // },


  /** 向量大小的平方，图形学常用，因为开方运算较慢  */
  magnitudeSquared<T extends Vector>(vector: T): number {
    let sum = 0
    for (let i = 0; i < vector.length; i++) {
      sum += vector[i] * vector[i]
    }
    return sum
  },

  magnitude<T extends Vector>(vector: T): number {
    let sumSquared = 0
    for (let i = 0; i < vector.length; i++) {
      sumSquared += vector[i] * vector[i]
    }
    return Math.sqrt(sumSquared)
  },

  /** */
  limitMagnitude<T extends Vector>(vector: T, max: number): T {
    const magnitudeSquared = Vector.magnitude(vector) ** 2
    if (magnitudeSquared > max ** 2) {
      const scaleFactor = max / Math.sqrt(magnitudeSquared)
      return vector.map((component) => component * scaleFactor) as T
    }
    return vector
  },

  rotate<T extends Vector>(vector: T, radian: number): T {
    const dimension = vector.length
    const cos = Math.cos(radian)
    const sin = Math.sin(radian)

    const rotatedVector: T = [] as unknown as T

    for (let i = 0; i < dimension; i++) {
      let rotatedComponent = 0
      for (let j = 0; j < dimension; j++) {
        const coefficient = j === i ? cos : -sin
        rotatedComponent += vector[j] * coefficient
      }

      rotatedVector.push(rotatedComponent)
    }

    return rotatedVector
  },


  heading<T extends Vector>(vector: T): number {
    const dimensions = vector.length  // 向量的维度
    if (dimensions < 2) {
      throw new Error('向量维度小于 2，无法计算方向或角度')
    }

    // 在二维和三维中特殊处理
    if (dimensions === 2) {
      const [x, y] = vector
      return Math.atan2(y, x)
    }

    if (dimensions === 3) {
      const [x, y, z] = vector
      return Math.atan2(Math.sqrt(x * x + y * y), z)
    }


    return 0
    // 高维情况通用处理
    // const sumOfSquares = vector.reduce((acc, component) => (
    //   acc + component * component
    // ), 0)

    // const magnitude = Math.sqrt(sumOfSquares)

    // // 所有分量都为零，无法计算方向或角度
    // if (magnitude === 0) {
    //   throw new Error('所有分量都为零，无法计算方向或角度')
    // }

    // const unitVector = vector.map((component) => component / magnitude)
    // const orthogonalVector = [...unitVector]
    // orthogonalVector[dimensions - 1] += 1

    // const dotProduct = Vector.multiply(unitVector, orthogonalVector)
    // const angle = Math.acos(Math.min(dotProduct, 1))  // 处理浮点数精度误差

    // return angle
  }

  // limitHeading(vector: T, radian: number) {
  //   const halfRadian = radian / 2
  //   const heading = this.heading()
  //   const isNegative = heading < 0
  //   if (Math.abs(heading) > halfRadian) {
  //     const distance = heading - halfRadian
  //     this.rotate(isNegative ? distance : -distance)
  //   }
  //   return this
  // }
}
