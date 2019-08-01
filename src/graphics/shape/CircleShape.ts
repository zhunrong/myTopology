import Vector2d from '../utils/vector2d'
export class CircleShape {
  position!: Vector2d
  radius!: number
  /**
   * 边界矩形坐标数组
   */
  getBoundingRect(): Vector2d[] {
    const { radius, position: { x, y } } = this
    const diameter = 2 * radius
    return [
      new Vector2d(x, y),
      new Vector2d(x + diameter, y),
      new Vector2d(x + diameter, y + diameter),
      new Vector2d(x, y + diameter)
    ]
  }
  /**
   * 边界矩形上的连接点坐标数组
   */
  getBoundingJoinPoints(): Vector2d[] {
    const { radius, position: { x, y } } = this
    const diameter = 2 * radius
    return [
      new Vector2d(x + radius, y),
      new Vector2d(x + diameter, y + radius),
      new Vector2d(x + radius, y + diameter),
      new Vector2d(x, y + radius)
    ]
  }
  /**
   * 几何中点坐标
   */
  getCenterPoint(): Vector2d {
    const { position: { x, y }, radius } = this
    return new Vector2d(x + radius, y + radius)
  }
  /**
   * 是否相交于某矩形
   * @param points 
   */
  isInRect(points: Vector2d[]): boolean {
    const vertexes = this.getBoundingRect()
    // 左
    if (points[0].x > vertexes[2].x) return false
    // 右
    if (points[2].x < vertexes[0].x) return false
    // 上
    if (points[0].y > vertexes[2].y) return false
    // 下
    if (points[2].y < vertexes[0].y) return false
    return true
  }
  /**
   * 是否包含于某矩形
   * @param rect 
   */
  isWrappedInRect(rect: Vector2d[]): boolean {
    const vertexes = this.getBoundingRect()
    return rect[0].x <= vertexes[0].x && rect[0].y <= vertexes[0].y && rect[2].x >= vertexes[2].x && rect[2].y >= vertexes[2].y
  }
}

export default CircleShape