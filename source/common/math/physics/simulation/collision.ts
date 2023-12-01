function checkCollision(rectangles) {
  const collisions = []

  for (let i = 0; i < rectangles.length; i++) {
    const rectA = rectangles[i]

    for (let j = i + 1; j < rectangles.length; j++) {
      const rectB = rectangles[j]

      if (isCollision(rectA, rectB)) {
        collisions.push([rectA, rectB])
      }
    }
  }

  return collisions
}

function isCollision(rectA, rectB) {
  const radiansA = rectA.angle * (Math.PI / 180) // 角度转为弧度
  const radiansB = rectB.angle * (Math.PI / 180)

  const cosA = Math.cos(radiansA)
  const sinA = Math.sin(radiansA)
  const cosB = Math.cos(radiansB)
  const sinB = Math.sin(radiansB)

  // 获取矩形的四个顶点坐标
  const rectAPoints = getRectanglePoints(rectA, cosA, sinA)
  const rectBPoints = getRectanglePoints(rectB, cosB, sinB)

  // 检查每个矩形的顶点是否位于另一个矩形内部
  for (const point of rectAPoints) {
    if (isPointInsideRectangle(point, rectBPoints)) {
      return true
    }
  }

  for (const point of rectBPoints) {
    if (isPointInsideRectangle(point, rectAPoints)) {
      return true
    }
  }

  return false
}

function getRectanglePoints(rectangle, cos, sin) {
  const x = rectangle.x
  const y = rectangle.y
  const width = rectangle.width
  const height = rectangle.height

  const x1 = -width / 2
  const y1 = -height / 2
  const x2 = width / 2
  const y2 = -height / 2
  const x3 = width / 2
  const y3 = height / 2
  const x4 = -width / 2
  const y4 = height / 2

  const points = [
    rotatePoint(x1, y1, cos, sin),
    rotatePoint(x2, y2, cos, sin),
    rotatePoint(x3, y3, cos, sin),
    rotatePoint(x4, y4, cos, sin)
  ]

  return points.map(point => [point[0] + x, point[1] + y])
}

function rotatePoint(x, y, cos, sin) {
  const newX = x * cos - y * sin
  const newY = x * sin + y * cos
  return [newX, newY]
}

function isPointInsideRectangle(point, rectanglePoints) {
  const x = point[0]
  const y = point[1]

  let isInside = false
  for (let i = 0, j = rectanglePoints.length - 1; i < rectanglePoints.length; j = i++) {
    const xi = rectanglePoints[i][0]
    const yi = rectanglePoints[i][1]
    const xj = rectanglePoints[j][0]
    const yj = rectanglePoints[j][1]

    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi)

    if (intersect) {
      isInside = !isInside
    }
  }

  return isInside
}

const rectangles = new Array(1000).fill(null).map(() => ({
  x: 0,
  y: 0,
  width: 4,
  height: 2,
  angle: Math.floor(Math.random() * 360)
}))

const per = window.performance
const time = per.now()
const collisions = checkCollision(rectangles)
const total = per.now() - time
console.log(total, total / 1000)

if (collisions.length > 0) {
  console.log("发生碰撞的矩形：")
  for (const collision of collisions) {
    console.log(`矩形A: ${JSON.stringify(collision[0])}`)
    console.log(`矩形B: ${JSON.stringify(collision[1])}`)
    console.log("-----------")
  }
} else {
  console.log("没有发生碰撞的矩形。")
}
