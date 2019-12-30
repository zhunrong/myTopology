import Element from './Element';
import Vector2d from '../utils/Vector2d';
interface ITriangleOptions {
    width: number;
    height: number;
}
export declare class Triangle extends Element {
    width: number;
    height: number;
    constructor(options: ITriangleOptions);
    render(ctx: CanvasRenderingContext2D): void;
    isPointIn(point: Vector2d): boolean;
}
export default Triangle;
