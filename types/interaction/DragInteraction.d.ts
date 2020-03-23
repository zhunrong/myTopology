import Interaction from './Interaction';
import Canvas from '../core/Canvas';
import Node from '../graph/Node';
import Vector2d from '../utils/Vector2d';
export interface IDragInteractionOptions {
    alignEnable?: boolean;
    alignGap?: number;
    alignLineColor?: string;
}
export declare class DragInteraction extends Interaction {
    minDragDistance: number;
    moveNodes: Node[];
    mousedown: boolean;
    lastCoordinate: Vector2d;
    yLocked: boolean;
    yAlign: 'center' | 'top' | 'bottom';
    yValue: number;
    xLocked: boolean;
    xAlign: 'center' | 'left' | 'right';
    xValue: number;
    alignEnable: boolean;
    alignGap: number;
    alignLineColor: string;
    constructor(options?: IDragInteractionOptions);
    onInstall: (canvas: Canvas) => void;
    onUninstall: (canvas: Canvas) => void;
    onMouseDown: (canvas: Canvas) => void;
    onMouseMove: (canvas: Canvas) => void;
    onMouseUp: (canvas: Canvas) => void;
    handleEvent(canvas: Canvas, event: Event): void;
    joinGroupComplete(canvas: Canvas): void;
    autoAlign(canvas: Canvas): void;
    autoAlignComplete(): void;
    isClose(a: number, b: number): boolean;
}
export declare const dragInteraction: DragInteraction;
export default DragInteraction;
