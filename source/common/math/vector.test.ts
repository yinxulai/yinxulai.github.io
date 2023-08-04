import { Vector2D, Vector } from './vector'

describe('vector', () => {
  test('zero', () => {
    const vector = new Vector2D(1, 1)
    const returnVector = vector.zero()
    expect(vector).toStrictEqual(new Vector2D(0, 0))
    expect(returnVector).toBe(vector)
  })
  test('clone', () => {
    const vector = new Vector2D(1, 1)
    const newVector = vector.clone()
    expect(vector).toStrictEqual(newVector)
    expect(vector).not.toBe(newVector)
  })
  test('add', () => {
    const vector1 = new Vector2D(1, 1)
    expect(vector1.add(new Vector2D(0, 0))).toStrictEqual(new Vector2D(1, 1))

    const vector2 = new Vector2D(1, 1)
    expect(vector2.add(new Vector2D(1, 1))).toStrictEqual(new Vector2D(2, 2))

    const vector3 = new Vector2D(1, 1)
    expect(vector3.add(new Vector2D(-1, -1))).toStrictEqual(new Vector2D(0, 0))
  })
  test('sub', () => {
    const vector1 = new Vector2D(1, 1)
    expect(vector1.sub(new Vector2D(0, 0))).toStrictEqual(new Vector2D(1, 1))

    const vector2 = new Vector2D(1, 1)
    expect(vector2.sub(new Vector2D(1, 1))).toStrictEqual(new Vector2D(0, 0))

    const vector3 = new Vector2D(1, 1)
    expect(vector3.sub(new Vector2D(-1, -1))).toStrictEqual(new Vector2D(2, 2))
  })
  test('mult', () => {
    const vector1 = new Vector2D(1, 1)
    expect(vector1.mult(0)).toStrictEqual(new Vector2D(0, 0))

    const vector2 = new Vector2D(1, 1)
    expect(vector2.mult(1)).toStrictEqual(new Vector2D(1, 1))

    const vector3 = new Vector2D(1, 1)
    expect(vector3.mult(-1)).toStrictEqual(new Vector2D(-1, -1))
  })
  test('div', () => {
    const vector1 = new Vector2D(1, 1)
    expect(() => vector1.div(0)).toThrow()

    const vector2 = new Vector2D(1, 1)
    expect(vector2.div(1)).toStrictEqual(new Vector2D(1, 1))

    const vector3 = new Vector2D(1, 1)
    expect(vector3.div(-1)).toStrictEqual(new Vector2D(-1, -1))
  })
  test('magSq', () => {
    const vector1 = new Vector2D(3, 4)
    expect(vector1.magSq()).toBe(25)
  })
  test('mag', () => {
    const vector1 = new Vector2D(3, 4)
    expect(vector1.mag()).toBe(5)
  })
  test('limitMag', () => {
    const vector1 = new Vector2D(6, 8)
    expect(vector1.limitMag(5)).toStrictEqual(new Vector2D(3, 4))
  })

  test('heading', () => {
    const vector1 = new Vector2D(0, 1)
    expect(vector1.heading()).toBe(Math.PI / 2)

    const vector2 = new Vector2D(1, 0)
    expect(vector2.heading()).toBe(0)

    const vector3 = new Vector2D(-1, 0)
    expect(vector3.heading()).toBe(Math.PI)

    const vector4 = new Vector2D(0, -1)
    expect(vector4.heading()).toBe(-Math.PI / 2)
  })

  test('limitHeading', () => {
    const vector1 = new Vector2D(0, 1)
    expect(vector1.limitHeading(Math.PI / 2).heading()).toBe(Math.PI / 4)

    const vector2 = new Vector2D(-1, 0)
    expect(vector2.limitHeading(-Math.PI / 2).heading()).toBe(-Math.PI / 4)
  })

  test('rotate', () => {
    const vector1 = new Vector2D(1, 0)
    expect(vector1.rotate(Math.PI / 2).heading()).toBe(Math.PI / 2)

    const vector2 = new Vector2D(1, 0)
    expect(vector2.rotate(-Math.PI / 2).heading()).toBe(-Math.PI / 2)
  })
})
