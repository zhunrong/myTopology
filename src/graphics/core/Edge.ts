import Graph, { IGraphOptions } from './Graph'
import Node from './Node'
interface IEdgeOptions extends IGraphOptions {
  targetNode: Node
  sourceNode: Node
}
export default abstract class Edge extends Graph {
  targetNode: Node
  sourceNode: Node
  constructor(options: IEdgeOptions) {
    super(options)
    this.targetNode = options.targetNode
    this.sourceNode = options.sourceNode
  }
}