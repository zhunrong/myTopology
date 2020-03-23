import Graph, { IGraphOptions } from './Graph';
import Node from './Node';
export interface IEdgeOptions extends IGraphOptions {
    targetNode: Node;
    sourceNode: Node;
}
export declare abstract class Edge extends Graph {
    renderType: string;
    targetNode: Node;
    sourceNode: Node;
    constructor(options: IEdgeOptions);
    getTargetNode(): Node;
    getSourceNode(): Node;
}
export default Edge;
