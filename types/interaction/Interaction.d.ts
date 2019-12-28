import { Canvas } from '../core/Canvas';
declare function noop(canvas: Canvas, e?: Event): void;
export declare abstract class Interaction {
    onInstall: typeof noop;
    onUninstall: typeof noop;
    onUpdate: typeof noop;
    handleEvent(canvas: Canvas, event: Event): void;
}
export default Interaction;
