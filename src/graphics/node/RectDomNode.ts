import DomNode, { IDomNodeOptions } from '../graph/DomNode'
import RectShape from '../shape/RectShape'
import Vector2d from '../utils/vector2d'
import Math2d from '../utils/math2d'
import { applyMixins } from '../utils/utils'

export interface IRectDomNodeOptions extends IDomNodeOptions {
  width?: number
  height?: number
  text?: string
  minWidth?: number
  minHeight?: number
}
export class RectDomNode extends DomNode implements RectShape {
  shapeType = 'rect'
  width: number
  height: number
  minWidth: number
  minHeight: number
  text: string
  getBoundingRect(): Vector2d[] {
    return []
  }
  getBoundingJoinPoints(): Vector2d[] {
    return []
  }
  getCenterPoint() {
    return new Vector2d(0, 0)
  }
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
    this.width = options.width || 100
    this.height = options.height || 100
    this.minWidth = options.minWidth || 30
    this.minHeight = options.minHeight || 30
    this.text = options.text || ''
  }
  isPointIn() {
    const { canvas } = this
    if (!canvas) return false
    if (!canvas.nativeEvent) return false
    const event = canvas.nativeEvent as MouseEvent
    const point = canvas.viewportToPixelCoordinate(new Vector2d(event.clientX, event.clientY))
    return Math2d.isPointInRect(point, this.position, this.width, this.height)
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
                                      color:#29c1f8;">${this.text ? this.text : ''}</div>`
  }

  update() {
    const { x, y } = this.position
    const { width, height, active } = this
    Object.assign(this.$el.style, {
      transform: `translate3d(${x}px,${y}px,0)`,
      width: `${width}px`,
      height: `${height}px`,
      boxShadow: active ? '0 0 5px 0 rgba(255,0,0,0.8)' : 'none'
    })
  }
}

applyMixins(RectDomNode, [RectShape])

export default RectDomNode