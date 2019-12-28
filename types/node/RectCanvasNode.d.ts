import RectNode, { IRectNodeOptions } from '../graph/RectNode';
export interface IRectCanvasNodeOptions extends IRectNodeOptions {
}
export declare class RectCanvasNode extends RectNode {
    readonly renderType = "CANVAS";
    cacheCanvas: HTMLCanvasElement;
    constructor(options: IRectCanvasNodeOptions);
    render(ctx?: CanvasRenderingContext2D): void;
    update(ctx?: CanvasRenderingContext2D): void;
}
export default RectCanvasNode;
