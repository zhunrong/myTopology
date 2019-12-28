import Node, { INodeOptions } from './Node';
import Vector2d from '../utils/Vector2d';
export interface ICircleNodeOptions extends INodeOptions {
    radius?: number;
    minRadius?: number;
    text?: string;
}
export declare abstract class CircleNode extends Node {
    shapeType: string;
    radius: number;
    minRadius: number;
    text: string;
    get boundingJoinPoints(): Vector2d[];
    get boundingRect(): Vector2d[];
    get centerPoint(): Vector2d;
    get vertexes(): Vector2d[];
    get circumradius(): number;
    constructor(options: ICircleNodeOptions);
    isPointIn(): boolean;
    getBoundingRect(): Vector2d[];
    getBoundingJoinPoints(): Vector2d[];
    getCenterPoint(): Vector2d;
    isInRect(points: Vector2d[]): boolean;
    isWrappedInRect(rect: Vector2d[]): boolean;
    drawThumbnail(ctx: CanvasRenderingContext2D): void;
}
export default CircleNode;
