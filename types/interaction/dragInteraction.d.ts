import Interaction from './Interaction';
import Canvas from '../core/Canvas';
import Node from '../graph/Node';
import Vector2d from '../utils/Vector2d';
export declare class DragInteraction extends Interaction {
    minDragDistance: number;
    moveNodes: Node[];
    mousedown: boolean;
    lastCoordinate: Vector2d;
    onMouseDown: (canvas: Canvas) => void;
    onMouseMove: (canvas: Canvas) => void;
    onMouseUp: (canvas: Canvas) => void;
    handleEvent(canvas: Canvas, event: Event): void;
}
export declare const dragInteraction: DragInteraction;
export default DragInteraction;
