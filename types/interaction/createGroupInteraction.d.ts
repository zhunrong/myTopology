import Interaction from './Interaction';
import Canvas from '../core/Canvas';
import Node from '../graph/Node';
export declare class CreateGroupInteraction extends Interaction {
    canvas: Canvas;
    parentNode: Node | undefined;
    onCreate: () => Node;
    constructor(onCreate?: () => Node);
    onContextMenu: (canvas: Canvas, e: Event) => void;
    onInstall: (canvas: Canvas) => void;
    onUninstall: (canvas: Canvas) => void;
    onAddToGroup: (menu: any) => void;
    handleEvent(canvas: Canvas, event: Event): void;
}
export declare const createGroupInteraction: CreateGroupInteraction;
export default CreateGroupInteraction;
