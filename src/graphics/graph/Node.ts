import Graph, { IGraphOptions } from './Graph'
import { Vector2d } from '../utils/vector2d'
export interface INodeOptions extends IGraphOptions {
  x: number
  y: number
}
// export type BoundingRect = [Vector2d,Vector2d,Vector2d,Vector2d]
export type BoundingRect = Vector2d[]
export abstract class Node extends Graph {
  position: Vector2d
  /**
   * 顶点坐标数组
   */
  abstract get vertexes(): Vector2d[]
  /**
   * 几何中心坐标
   */
  abstract get centerPoint(): Vector2d
  /**
   * 边界矩形上的连接点
   */
  abstract get boundingJoinPoints(): Vector2d[]
  /**
   * 边界盒子
   */
  abstract get boundingRect(): Vector2d[]
  constructor(options: INodeOptions) {
    super(options)
    this.position = new Vector2d(options.x, options.y)
  }
  destroy() { }
  abstract updatePosition(): void
  abstract updateRender(): void
}

export default Node