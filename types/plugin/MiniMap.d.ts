import Plugin from './Plugin';
import Canvas from '../core/Canvas';
export declare class MiniMap extends Plugin {
    canvasElement: HTMLCanvasElement;
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
    constructor(width?: number, height?: number);
    install(canvas: Canvas): void;
    destroy(): void;
    update(): void;
    render(): void;
    handleMouseMove: (...params: any[]) => void;
    mount(container: HTMLElement): void;
    unmount(): void;
}
export default MiniMap;
