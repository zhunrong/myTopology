import { Vector2d } from './vector2d'

export class Math2d {
  /**
   * 判断点是否在矩形内
   * @param P 
   * @param rectPosition 
   * @param width 
   * @param height 
   */
  static isPointInRect(P: Vector2d, rectPosition: Vector2d, width: number, height: number) {
    if (P.x < rectPosition.x) return false
    if (P.y < rectPosition.y) return false
    if (P.x > rectPosition.x + width) return false
    if (P.y > rectPosition.y + height) return false
    return true
  }
  /**
   * 判断点是否在圆内
   * @param P 
   * @param C 
   * @param radius 
   */
  static isPointInCircle(P: Vector2d, C: Vector2d, radius: number): boolean {
    return Vector2d.copy(C).substract(P).magnitude <= radius
  }

  /**
   * 判断点是否在三角形内
   * @param point 
   * @param v0 
   * @param v1 
   * @param v2 
   */
  static isPointInTriangle(P: Vector2d, A: Vector2d, B: Vector2d, C: Vector2d): boolean {
    const PA = Vector2d.copy(A).substract(P)
    const PB = Vector2d.copy(B).substract(P)
    const PC = Vector2d.copy(C).substract(P)
    const b1 = PA.crossProduct(PB) < 0
    const b2 = PB.crossProduct(PC) < 0
    const b3 = PC.crossProduct(PA) < 0
    return b1 === b2 && b2 === b3
  }
  /**
   * 判断点是否在多边形内
   * @param P 
   * @param points 
   */
  static isPointInPolygon(P: Vector2d, points: Vector2d[]): boolean {
    if (points.length < 3) return false
    for (let i = 2; i < points.length; i++) {
      if (Math2d.isPointInTriangle(P, points[0], points[i - 1], points[i])) return true
    }
    return false
  }
  /**
   * 判断点是否在线段上
   * @param P 
   * @param lineSegment 
   * @param deviation 计算偏差 最小为0
   */
  static isPointInLineSegment(P: Vector2d, lineSegment: [Vector2d, Vector2d], deviation: number = 0.01): boolean {
    const A = lineSegment[0]
    const B = lineSegment[1]
    const AP = Vector2d.copy(P).substract(A)
    const BP = Vector2d.copy(P).substract(B)
    const BA = Vector2d.copy(A).substract(B)
    if (AP.magnitude + BP.magnitude - BA.magnitude < deviation) {
      return true
    }
    return false
  }
  /**
   * 判断点是否在多线段上
   * @param P 
   * @param polyline 
   * @param deviation 
   */
  static isPointInPolyline(P: Vector2d, polyline: Vector2d[], deviation: number = 0.01): boolean {
    const length = polyline.length
    if (length < 2) return false
    for (let i = 1; i < length; i++) {
      if (Math2d.isPointInLineSegment(P, [polyline[i - 1], polyline[i]], deviation)) return true
    }
    return false
  }

  /**
   * 判断两条线是否相交
   * @param line1 
   * @param line2 
   */
  static isIntersect(line1: [Vector2d, Vector2d], line2: [Vector2d, Vector2d]): boolean {
    const A = line1[0]
    const B = line1[1]
    const C = line2[0]
    const D = line2[1]
    if (Math2d.isPointInLineSegment(A, line2)) return true
    if (Math2d.isPointInLineSegment(B, line2)) return true
    if (Math2d.isPointInLineSegment(C, line1)) return true
    if (Math2d.isPointInLineSegment(D, line1)) return true
    const AC = Vector2d.copy(C).substract(A)
    const AD = Vector2d.copy(D).substract(A)
    const BC = Vector2d.copy(C).substract(B)
    const BD = Vector2d.copy(D).substract(B)
    const b1 = AC.crossProduct(AD) < 0
    const b2 = BC.crossProduct(BD) < 0
    if (b1 === b2) return false
    const CA = Vector2d.copy(A).substract(C)
    const CB = Vector2d.copy(B).substract(C)
    const DA = Vector2d.copy(A).substract(D)
    const DB = Vector2d.copy(B).substract(D)
    const b3 = CA.crossProduct(CB) < 0
    const b4 = DA.crossProduct(DB) < 0
    if (b3 === b4) return false
    return true
  }

  /**
   * 获取两条相交线段的交点
   * @param line1 
   * @param line2 
   */
  static getLineIntersect(line1: [Vector2d, Vector2d], line2: [Vector2d, Vector2d]): Vector2d {
    const A = line1[0]
    const B = line1[1]
    const C = line2[0]
    const D = line2[1]
    const AB = Vector2d.copy(B).substract(A)
    const CD = Vector2d.copy(D).substract(C)
    const perpendicular = CD.perpendicular()
    // C,A,B 在perpendicular的投影  a----c----->b
    const c = C.project(perpendicular)
    const a = A.project(perpendicular)
    const b = B.project(perpendicular)

    const ac = Vector2d.copy(c).substract(a)
    const cb = Vector2d.copy(b).substract(c)
    // 设交点P,则AP的模
    const magnitude = AB.magnitude * ac.magnitude / (ac.magnitude + cb.magnitude)
    const AP = AB.normalize().scale(magnitude)
    return AP.add(A)
  }

  /**
   * 根据ratio,获取线段上点的坐标,起点为0,终点为1
   * @param line 
   * @param ratio 
   */
  static getLinePoint(line: Vector2d[], ratio: number): Vector2d | null {
    const len = line.length
    if (len < 2) return null
    if (ratio > 1) ratio = 1
    if (ratio < 0) ratio = 0
    const length = Math2d.getPolyLineLength(line) * ratio
    let sum = 0
    for (let i = 1; i < len; i++) {
      sum += line[i].distance(line[i - 1])
      if (sum >= length) {
        const diff = sum - length
        return Vector2d.copy(line[i]).add(Vector2d.copy(line[i - 1]).substract(line[i]).normalize().scale(diff))
      }
    }
    return new Vector2d(0, 0)
  }

  /**
   * 获取多线段的长度
   * @param line 
   */
  static getPolyLineLength(line: Vector2d[]): number {
    const length = line.length
    if (length < 2) return 0
    let sum = 0
    for (let i = 1; i < length; i++) {
      sum += line[i].distance(line[i - 1])
    }
    return sum
  }
}

// let count = 10000
// const before = Date.now()
// const p = new Vector2d(-10, 10)
// const a = new Vector2d(10, 10)
// const b = new Vector2d(-10, -10)
// const c = new Vector2d(10, -10)
// while (count--) {
//   Math2d.getLineIntersect([p, c], [a, b])
// }
// console.log(Date.now() - before)

export default Math2d