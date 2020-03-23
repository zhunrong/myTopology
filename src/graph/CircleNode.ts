import Node, { INodeOptions } from './Node'
import Vector2d from '../utils/Vector2d'
import Math2d from '../utils/Math2d'

export interface ICircleNodeOptions extends INodeOptions {
  radius?: number
  minRadius?: number
  text?: string
}

export abstract class CircleNode extends Node {
  shapeType = 'circle'
  radius: number
  minRadius: number
  text: string

  get boundingJoinPoints(): Vector2d[] {
    return this.getBoundingJoinPoints()
  }
  get boundingRect(): Vector2d[] {
    return this.getBoundingRect()
  }
  get centerPoint(): Vector2d {
    return this.getCenterPoint()
  }
  get vertexes(): Vector2d[] {
    return this.getBoundingRect()
  }

  get circumradius() {
    return this.radius
  }

  constructor(options: ICircleNodeOptions) {
    super(options)
    this.radius = options.radius || 50
    this.minRadius = options.minRadius || 30
    this.text = options.text || ''
  }

  isPointIn() {
    const { canvas, centerPoint, radius } = this
    if (!canvas) return false
    if (!this.visible) return false
    if (!canvas.nativeEvent) return false
    const event = canvas.nativeEvent as MouseEvent
    const point = canvas.viewportToPixelCoordinate(new Vector2d(event.clientX, event.clientY))
    return Math2d.isPointInCircle(point, centerPoint, radius)
  }

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

  drawThumbnail(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.centerPoint
    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.active ? this.style.activeColor : this.style.color
    ctx.fill()
    ctx.restore()
  }
}

export default CircleNode