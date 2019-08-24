import DomNode, { IDomNodeOptions } from '../graph/DomNode'
import Vector2d from '../utils/vector2d'
import Math2d from '../utils/math2d'

export interface IRectDomNodeOptions extends IDomNodeOptions {
  width?: number
  height?: number
  text?: string
  minWidth?: number
  minHeight?: number
}
export class RectDomNode extends DomNode {
  shapeType = 'rect'
  _width: number
  /**
   * 计算宽度
   */
  get width(): number {
    return this.isExpanded ? this._width : this.collapseWidth
  }
  set width(width: number) {
    this._width = width
  }
  _height: number
  /**
   * 计算高度
   */
  get height(): number {
    return this.isExpanded ? this._height : this.collapseHeight
  }
  set height(height: number) {
    this._height = height
  }
  minWidth: number
  minHeight: number
  // 折叠宽度
  collapseWidth: number = 50
  // 折叠高度
  collapseHeight: number = 50
  text: string
  get vertexes() {
    return this.getBoundingRect()
  }
  get joinPoint() {
    return this.getCenterPoint()
  }
  get boundingRect() {
    return this.getBoundingRect()
  }
  get boundingJoinPoints() {
    return this.getBoundingJoinPoints()
  }
  get centerPoint() {
    return this.getCenterPoint()
  }
  constructor(options: IRectDomNodeOptions) {
    super(options)
    this._width = options.width || 100
    this._height = options.height || 100
    this.minWidth = options.minWidth || 30
    this.minHeight = options.minHeight || 30
    this.text = options.text || ''
  }
  getPosition(): Vector2d {
    if /* 展开状态 */ (this.isExpanded) {
      return this.position
    } /* 折叠状态 */ else {
      const { x, y } = this.position
      return new Vector2d(x + (this._width - this.collapseWidth) / 2, y + (this._height - this.collapseHeight) / 2)
    }
  }
  isPointIn() {
    const { canvas } = this
    if (!canvas) return false
    if (!canvas.nativeEvent) return false
    const event = canvas.nativeEvent as MouseEvent
    const point = canvas.viewportToPixelCoordinate(new Vector2d(event.clientX, event.clientY))
    return Math2d.isPointInRect(point, this.getPosition(), this.width, this.height)
  }

  /**
   * 边界矩形坐标数组
   */
  getBoundingRect(): Vector2d[] {
    const { width, height } = this
    const { x, y } = this.getPosition()
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
    const { width, height } = this
    const { x, y } = this.getPosition()
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
    const { width, height } = this
    const { x, y } = this.getPosition()
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

  /**
   * 是否包含于某矩形
   * @param rect 
   */
  isWrappedInRect(rect: Vector2d[]): boolean {
    const vertexes = this.getBoundingRect()
    return rect[0].x <= vertexes[0].x && rect[0].y <= vertexes[0].y && rect[2].x >= vertexes[2].x && rect[2].y >= vertexes[2].y
  }

  render() {
    this.$el.innerHTML = `<div style="height:100%;
                                      display:flex;
                                      align-items:center;
                                      justify-content:center;
                                      border:1px solid #29c1f8;
                                      box-sizing: border-box;
                                      font-size:12px;
                                      user-select: none;
                                      color:#29c1f8;">${this.text}</div>`
  }

  update() {
    const { x, y } = this.getPosition()
    const { width, height, active } = this
    Object.assign(this.$el.style, {
      transform: `translate3d(${x}px,${y}px,0)`,
      width: `${width}px`,
      height: `${height}px`,
      boxShadow: active ? '0 0 5px 0 rgba(255,0,0,0.8)' : 'none'
    })
  }
}

// applyMixins(RectDomNode, [RectShape])

export default RectDomNode