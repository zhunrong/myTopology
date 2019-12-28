import { RectCanvasNode, IRectCanvasNodeOptions } from './RectCanvasNode';
export interface IRectCanvasGroupOptions extends IRectCanvasNodeOptions {
    isExpanded?: boolean;
}
export declare class RectCanvasGroup extends RectCanvasNode {
    static shape: string;
    isGroup: boolean;
    canResize: boolean;
    constructor(options: IRectCanvasGroupOptions);
    render(ctx?: CanvasRenderingContext2D): void;
    update(ctx?: CanvasRenderingContext2D): void;
    drawThumbnail(ctx: CanvasRenderingContext2D): void;
}
export default RectCanvasGroup;
