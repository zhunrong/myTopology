import Interaction from './Interaction';
import Canvas from '../core/Canvas';
export declare class CollapseAndExpandInteraction extends Interaction {
    lastTimestamp: number;
    onMouseDown: (canvas: Canvas) => void;
    handleEvent(canvas: Canvas, event: Event): void;
}
export declare const collapseAndExpandInteraction: CollapseAndExpandInteraction;
export default CollapseAndExpandInteraction;
