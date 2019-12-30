import Vector2d from '../utils/Vector2d';
import Canvas from '../core/Canvas';
export interface IStyle {
    color: string;
    activeColor: string;
    lineWidth: number;
    [key: string]: any;
}
export interface IGraphOptions {
    visible?: boolean;
    zIndex?: number;
    text?: string;
    data?: any;
}
export declare abstract class Graph {
    canvas: Canvas | undefined;
    active: boolean;
    _visible: boolean;
    protected _text: string;
    get visible(): boolean;
    set visible(visible: boolean);
    get text(): string;
    set text(value: string);
    get miniMapVisible(): boolean;
    zIndex: number;
    isUpdate: boolean;
    graphId: number;
    data: any;
    style: IStyle;
    renderSign: any;
    constructor(options: IGraphOptions);
    abstract isPointIn(): boolean;
    isInRect(points: Vector2d[]): boolean;
    isWrappedInRect(rect: Vector2d[]): boolean;
    isWrappedInCircle(): boolean;
    abstract drawThumbnail(ctx: CanvasRenderingContext2D): void;
    render(ctx?: CanvasRenderingContext2D): void;
    update(ctx?: CanvasRenderingContext2D): void;
    destroy(): void;
    beforeDestroy(): void;
    exportJson(): any;
}
export default Graph;
