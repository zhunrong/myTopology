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
}

export default Edge