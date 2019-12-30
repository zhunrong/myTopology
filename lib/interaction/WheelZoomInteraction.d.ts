import Interaction from './Interaction';
import Canvas from '../core/Canvas';
export declare class WheelZoomInteraction extends Interaction {
    onWheel: (canvas: Canvas, e: Event) => void;
    handleEvent(canvas: Canvas, event: Event): void;
}
export declare const wheelZoomInteraction: WheelZoomInteraction;
export default WheelZoomInteraction;
