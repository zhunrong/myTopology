import Graph, { IGraphOptions } from './Graph'
import Node from './Node'

export interface IEdgeOptions extends IGraphOptions {
  targetNode: Node
  sourceNode: Node
}
export abstract class Edge extends Graph {
  renderType: string = 'CANVAS'
  targetNode: Node
  sourceNode: Node
  constructor(options: IEdgeOptions) {
    super(options)
    this.targetNode = options.targetNode
    this.sourceNode = options.sourceNode
  }
  /**
   * 获取可见的目标节点
   */
  getTargetNode(): Node | undefined {
    let node = this.targetNode
    while (!node.visible && node.parent) {
      node = node.parent
    }
    return node.visible ? node : undefined
  }
  /**
   * 获取可见的源节点
   */
  getSourceNode(): Node | undefined {
    let node = this.sourceNode
    while (!node.visible && node.parent) {
      node = node.parent
    }
    return node.visible ? node : undefined
  }
}

export default Edge