import Vector2d from '../utils/vector2d'

export class RectShape {
  width!: number
  height!: number
  position!: Vector2d
  /**
   * 边界矩形坐标数组
   */
  getBoundingRect(): Vector2d[] {
    const { position: { x, y }, width, height } = this
    return [
      new Vector2d(x, y),
      new Vector2d(x + width, y),
      new Vector2d(x + width, y + height),
      new Vector2d(x, y + height)
    ]
  }
  /**
   * 边界矩形上的连接点坐标数组
   */
  getBoundingJoinPoints(): Vector2d[] {
    const { position: { x, y }, width, height } = this
    return [
      new Vector2d(x + width / 2, y),
      new Vector2d(x + width, y + height / 2),
      new Vector2d(x + width / 2, y + height),
      new Vector2d(x, y + height / 2)
    ]
  }
  /**
   * 几何中点坐标
   */
  getCenterPoint(): Vector2d {
    const { position: { x, y }, width, height } = this
    return new Vector2d(x + width / 2, y + height / 2)
  }

  /**
   * 是否在矩形中
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
}

export default RectShape