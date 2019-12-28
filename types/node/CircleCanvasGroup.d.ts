import CircleCanvasNode, { ICircleCanvasNodeOptions } from './CircleCanvasNode';
interface IGroupOptions extends ICircleCanvasNodeOptions {
    isExpanded?: boolean;
}
export declare class CircleCanvasGroup extends CircleCanvasNode {
    static shape: string;
    isGroup: boolean;
    canResize: boolean;
    constructor(options: IGroupOptions);
    render(ctx?: CanvasRenderingContext2D): void;
    update(ctx?: CanvasRenderingContext2D): void;
    drawThumbnail(ctx: CanvasRenderingContext2D): void;
}
export default CircleCanvasGroup;
