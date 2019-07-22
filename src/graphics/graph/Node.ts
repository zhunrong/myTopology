import Graph, { IGraphOptions } from './Graph'
import { Vector2d } from '../utils/vector2d'
export interface INodeOptions extends IGraphOptions {
  x: number
  y: number
}
export type BoundingRect = [Vector2d,Vector2d,Vector2d,Vector2d]
export abstract class Node extends Graph {
  position: Vector2d
  abstract get vertexes(): Vector2d[]
  abstract get joinPoint(): Vector2d
  abstract get boundingJoinPoints(): Vector2d[]
  /**
   * 边界盒子
   */
  abstract get boundingRect(): BoundingRect
  constructor(options: INodeOptions) {
    super(options)
    this.position = new Vector2d(options.x, options.y)
  }
  destroy() { }
}

export default Node