import Interaction from './Interaction';
import Canvas from '../core/Canvas';
import Vector2d from '../utils/Vector2d';
import Node from '../graph/Node';
export declare class AreaPickInteraction extends Interaction {
    minDragDistance: number;
    mouseDown: boolean;
    activeNodes: Node[];
    dragMove: boolean;
    lastCoordinate: Vector2d;
    onInstall: (canvas: Canvas) => void;
    onUninstall: (canvas: Canvas) => void;
    onMouseDown: (canvas: Canvas, e: Event) => void;
    onMouseMove: (canvas: Canvas, e: Event) => void;
    onMouseUp: (canvas: Canvas, e: Event) => void;
    handleEvent(canvas: Canvas, event: Event): void;
}
export declare const areaPickInteraction: AreaPickInteraction;
export default AreaPickInteraction;
