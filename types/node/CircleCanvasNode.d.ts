import Circle, { ICircleNodeOptions } from '../graph/CircleNode';
export interface ICircleCanvasNodeOptions extends ICircleNodeOptions {
}
export declare class CircleCanvasNode extends Circle {
    readonly renderType = "CANVAS";
    cacheCanvas: HTMLCanvasElement;
    constructor(options: ICircleCanvasNodeOptions);
    render(): void;
    update(): void;
}
export default CircleCanvasNode;
