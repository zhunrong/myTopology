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
   * 获取目标节点
   */
  getTargetNode(): Node {
    let parent = this.targetNode.parent
    let isAllExpanded = true
    while (parent) {
      if (!parent.isExpanded) {
        isAllExpanded = false
      }
      parent = parent.parent
    }
    if (isAllExpanded) {
      return this.targetNode
    } else {
      let node = this.targetNode
      while (!node.visible && node.parent && node.parent.renderType !== 'NONE') {
        node = node.parent
      }
      return node
    }
  }
  /**
   * 获取源节点
   */
  getSourceNode(): Node {
    let parent = this.sourceNode.parent
    let isAllExpanded = true
    while (parent) {
      if (!parent.isExpanded) {
        isAllExpanded = false
      }
      parent = parent.parent
    }
    if (isAllExpanded) {
      return this.sourceNode
    } else {
      let node = this.sourceNode
      while (!node.visible && node.parent && node.parent.renderType !== 'NONE') {
        node = node.parent
      }
      return node
    }
  }
}

export default Edge