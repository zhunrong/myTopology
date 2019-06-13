import Graph, { IGraphOptions } from './Graph'
import Vector2d from '../../utils/vector2d';
export interface INodeOptions extends IGraphOptions {
  x: number
  y: number
}
export default abstract class Node extends Graph {
  position: Vector2d
  abstract get vertexes(): Vector2d[]
  abstract get joinPoint(): Vector2d
  constructor(options: INodeOptions) {
    super(options)
    this.position = new Vector2d(options.x, options.y)
  }
}