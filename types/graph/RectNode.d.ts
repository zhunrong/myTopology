import Node, { INodeOptions } from './Node';
import Vector2d from '../utils/Vector2d';
export interface IRectNodeOptions extends INodeOptions {
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
}
export declare abstract class RectNode extends Node {
    shapeType: string;
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
    collapseWidth: number;
    collapseHeight: number;
    constructor(options: IRectNodeOptions);
    get vertexes(): Vector2d[];
    get boundingRect(): Vector2d[];
    get boundingJoinPoints(): Vector2d[];
    get centerPoint(): Vector2d;
    get circumradius(): number;
    getPosition(): Vector2d;
    getWidth(): number;
    getHeight(): number;
    isPointIn(): boolean;
    get joinPoint(): Vector2d;
    getBoundingRect(): Vector2d[];
    getBoundingJoinPoints(): Vector2d[];
    getCenterPoint(): Vector2d;
    isInRect(points: Vector2d[]): boolean;
    isWrappedInRect(rect: Vector2d[]): boolean;
    drawThumbnail(ctx: CanvasRenderingContext2D): void;
}
export default RectNode;
