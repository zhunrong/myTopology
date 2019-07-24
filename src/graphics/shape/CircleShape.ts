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
}

export default CircleShape