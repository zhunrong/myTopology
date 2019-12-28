import RectDomNode, { IRectDomNodeOptions } from './RectDomNode';
export interface IRectDomGroupOptions extends IRectDomNodeOptions {
    isExpanded?: boolean;
}
export declare class RectDomGroup extends RectDomNode {
    isGroup: boolean;
    canResize: boolean;
    constructor(options: IRectDomGroupOptions);
    render(): void;
    drawThumbnail(ctx: CanvasRenderingContext2D): void;
}
export default RectDomGroup;
