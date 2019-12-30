import Interaction from './Interaction';
import Canvas from '../core/Canvas';
export declare class DropInteraction extends Interaction {
    onDrop: (canvas: Canvas, e: Event) => void;
    onDragOver: (canvas: Canvas, e: Event) => void;
    handleEvent(canvas: Canvas, event: Event): void;
}
export declare const dropInteraction: DropInteraction;
export default DropInteraction;
