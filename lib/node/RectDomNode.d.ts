import RectNode, { IRectNodeOptions } from '../graph/RectNode';
export interface IRectDomNodeOptions extends IRectNodeOptions {
}
export declare class RectDomNode extends RectNode {
    readonly renderType = "DOM";
    $el: HTMLDivElement;
    constructor(options: IRectDomNodeOptions);
    mount(force?: boolean): void;
    unmount(): void;
    render(ctx?: CanvasRenderingContext2D): void;
    update(ctx?: CanvasRenderingContext2D): void;
}
export default RectDomNode;
