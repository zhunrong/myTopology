import Node, { INodeOptions,BoundingRect } from './Node'
import { Vector2d } from '../utils/vector2d'
export interface IVirtualNodeOptions extends INodeOptions { }
export class VirtualNode extends Node {
  renderType: string = 'NONE'
  constructor(options: IVirtualNodeOptions) {
    super(options)
  }
  get vertexes(): Vector2d[] {
    return [this.position, this.position, this.position, this.position]
  }
  get boundingRect():BoundingRect{
    return [this.position, this.position, this.position, this.position]
  }
  get boundingJoinPoints():Vector2d[]{
    return [this.position]
  }
  get joinPoint() {
    return this.position
  }
  isInRect() { return false }
  isPointIn() { return false }
  render() { }
}
export default VirtualNode