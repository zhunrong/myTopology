import Element from './Element';
import Vector2d from '../utils/Vector2d';
interface IRectOptions {
    width: number;
    height: number;
}
export declare class Rect extends Element {
    width: number;
    height: number;
    fillStyle: string;
    strokeStyle: string;
    constructor(options: IRectOptions);
    render(ctx: CanvasRenderingContext2D): void;
    isPointIn(point: Vector2d): boolean;
}
export default Rect;
