import Plugin from './Plugin';
import Canvas from '../core/Canvas';
import Node from '../graph/Node';
import Edge from '../graph/Edge';
import Vector2d from '../utils/Vector2d';
export interface IMenu {
    label: string;
    command: string;
    [key: string]: any;
}
export declare class ContextMenu extends Plugin {
    position: Vector2d;
    mounted: boolean;
    container: HTMLDivElement;
    onContextMenu: ((instance: this, target: Node | Edge | null, nodes: Node[], edges: Edge[]) => IMenu[]) | null;
    menu: IMenu[];
    constructor();
    handleEvent(event: Event): void;
    install(canvas: Canvas): void;
    destroy(): void;
    show(menu?: IMenu[], left?: number, top?: number): void;
    hide: () => void;
    handleContextMenu: (e: MouseEvent) => void;
    handleClick: (e: MouseEvent) => void;
}
export default ContextMenu;
