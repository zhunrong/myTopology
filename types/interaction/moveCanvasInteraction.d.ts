import Interaction from './Interaction';
import Canvas from '../core/Canvas';
import Vector2d from '../utils/Vector2d';
export declare class MoveCanvasInteraction extends Interaction {
    minDragDistance: number;
    mouseDown: boolean;
    move: boolean;
    lastCoordinate: Vector2d;
    onMouseDown: (canvas: Canvas) => void;
    onMouseMove: (canvas: Canvas) => void;
    onMouseUp: (canvas: Canvas) => void;
    handleEvent(canvas: Canvas, event: Event): void;
}
export declare const moveCanvasInteraction: MoveCanvasInteraction;
export default MoveCanvasInteraction;
