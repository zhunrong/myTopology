import Interaction from './Interaction';
import { Canvas } from '../core/Canvas';
export declare class SelectInteraction extends Interaction {
    onMouseDown: (canvas: Canvas) => void;
    handleEvent(canvas: Canvas, event: Event): void;
}
export declare const selectInteraction: SelectInteraction;
export default SelectInteraction;
