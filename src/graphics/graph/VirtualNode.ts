import Node, { INodeOptions, BoundingRect } from './Node'
import Vector2d from '../utils/Vector2d'

export class VirtualNode extends Node {
  maxDepth = false
  renderType: string = 'NONE'
  shapeType = 'circle'
  radius = 1
  constructor(options: INodeOptions) {
    super(options)
  }
  get vertexes(): Vector2d[] {
    return this.boundingRect
  }
  get boundingRect(): BoundingRect {
    const { x, y } = this.position
    return [
      new Vector2d(x - this.radius, y - this.radius),
      new Vector2d(x + this.radius, y - this.radius),
      new Vector2d(x + this.radius, y + this.radius),
      new Vector2d(x - this.radius, y + this.radius),
    ]
  }
  get boundingJoinPoints(): Vector2d[] {
    const { x, y } = this.position
    return [
      new Vector2d(x, y - this.radius),
      new Vector2d(x + this.radius, y),
      new Vector2d(x, y + this.radius),
      new Vector2d(x - this.radius, y)
    ]
  }
  get joinPoint() {
    return this.position
  }
  get centerPoint() {
    return this.position
  }

  get depth(): number {
    return this.maxDepth ? Number.MAX_SAFE_INTEGER : (this.parent ? this.parent.depth + 1 : 0)
  }

  isInRect() { return false }
  isPointIn() { return false }
  render() { }
  destroy() { }
  updatePosition() { }
  updateRender() { }
  drawThumbnail() { }
}
export default VirtualNode