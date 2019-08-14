import Node, { INodeOptions, BoundingRect } from './Node'
import { Vector2d } from '../utils/vector2d'
export interface IVirtualNodeOptions extends INodeOptions { }
export class VirtualNode extends Node {
  renderType: string = 'NONE'
  shapeType = 'circle'
  radius = 0
  constructor(options: IVirtualNodeOptions) {
    super(options)
  }
  get vertexes(): Vector2d[] {
    return [this.position, this.position, this.position, this.position]
  }
  get boundingRect(): BoundingRect {
    return [this.position, this.position, this.position, this.position]
  }
  get boundingJoinPoints(): Vector2d[] {
    return [this.position]
  }
  get joinPoint() {
    return this.position
  }
  get centerPoint() {
    return this.position
  }

  get depth(): number {
    return Number.MAX_SAFE_INTEGER
  }

  isInRect() { return false }
  isPointIn() { return false }
  render() { }
  destroy() { }
  updatePosition() { }
  updateRender() { }
}
export default VirtualNode