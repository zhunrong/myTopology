import Interaction from './Interaction';
import Canvas from '../core/Canvas';
import Node from '../graph/Node';
export declare class ResizeInteraction extends Interaction {
    activeNode: Node | undefined;
    flag: boolean;
    activeAnchorIndex: number;
    onInstall: (canvas: Canvas) => void;
    onUninstall: (canvas: Canvas) => void;
    onMouseUp: (canvas: Canvas) => void;
    onMouseDown: (canvas: Canvas) => void;
    onMouseMove: (canvas: Canvas, e: Event) => void;
    onUpdate: (canvas: Canvas) => void;
    getActiveAnchorIndex(canvas: Canvas): number;
    handleEvent(canvas: Canvas, event: Event): void;
}
export declare const resizeInteraction: ResizeInteraction;
export default ResizeInteraction;
