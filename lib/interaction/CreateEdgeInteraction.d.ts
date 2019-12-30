import Interaction from './Interaction';
import Canvas from '../core/Canvas';
import Node from '../graph/Node';
import Edge from '../graph/Edge';
declare type CreateEdge = (sourceNode: Node, targetNode: Node) => Edge;
export declare class CreateEdgeInteraction extends Interaction {
    targetNode: Node | undefined;
    sourceNode: Node | undefined;
    edge: Edge | undefined;
    onCreate: CreateEdge;
    constructor(onCreate?: CreateEdge);
    onMouseUp: (canvas: Canvas) => void;
    onMouseMove: (canvas: Canvas) => void;
    onUninstall: (canvas: Canvas) => void;
    handleEvent(canvas: Canvas, event: Event): void;
}
export default CreateEdgeInteraction;
