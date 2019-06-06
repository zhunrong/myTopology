import Vector2d from './vector2d'
export default class Math2d {
  static isPointInRect() { }
  static isPointInCircle() { }
  /**
   * 判断点是否在三角形内
   * @param point 
   * @param v0 
   * @param v1 
   * @param v2 
   */
  static isPointInTriangle(P: Vector2d, A: Vector2d, B: Vector2d, C: Vector2d): boolean {
    const PA = A.substract(P)
    const PB = B.substract(P)
    const PC = C.substract(P)
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
}