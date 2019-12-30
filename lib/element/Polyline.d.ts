import Element from './Element';
import Vector2d from '../utils/Vector2d';
export declare class Polyline extends Element {
    points: Vector2d[];
    lineWidth: number;
    render(ctx: CanvasRenderingContext2D): void;
    isPointIn(point: Vector2d): boolean;
}
export default Polyline;
