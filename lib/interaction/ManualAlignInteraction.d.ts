import Interaction from './Interaction';
import Canvas from '../core/Canvas';
import { IMenu } from '../plugin/ContextMenu';
export declare class ManualAlignInteraction extends Interaction {
    canvas: Canvas;
    handleEvent(canvas: Canvas, event: Event): void;
    onContextMenu(canvas: Canvas, event: Event): void;
    onInstall: (canvas: Canvas) => void;
    onUninstall: (canvas: Canvas) => void;
    onCanvasMenu: (menu: IMenu) => void;
}
export default ManualAlignInteraction;
