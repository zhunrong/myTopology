import DomNode, { IDomNodeOptions } from '../graph/DomNode'
import RectShape from '../shape/RectShape'
import Vector2d from '../utils/vector2d'
import { applyMixins } from '../utils/utils'

export interface IRectDomNodeOptions extends IDomNodeOptions {
  width: number
  height: number
  x: number
  y: number
  text?: string
  id: number
}
export class RectDomNode extends DomNode implements RectShape {
  shapeType = 'rect'
  width: number
  height: number
  text: string
  id: number
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
    this.width = options.width
    this.height = options.height
    this.text = options.text || ''
    this.id = options.id
  }
  render() {
    this.$el.innerHTML = 'text'
  }
  updateRender() {
    this.$el.innerHTML = 'text'
  }
  /**
   * 更新节点位置
   */
  updatePosition() {
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