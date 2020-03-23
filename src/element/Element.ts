import Vector2d from '../utils/Vector2d'

export abstract class Element {
  position = new Vector2d()
  offset = new Vector2d()
  rotate = 0
  /**
   * 渲染
   * @param ctx 
   */
  abstract render(ctx: CanvasRenderingContext2D): void
  /**
   * 判断点是否处于图形内
   * @param point 
   */
  abstract isPointIn(point: Vector2d): boolean
}

export default Element