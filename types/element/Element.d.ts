import Vector2d from '../utils/Vector2d';
export declare abstract class Element {
    position: Vector2d;
    offset: Vector2d;
    rotate: number;
    abstract render(ctx: CanvasRenderingContext2D): void;
    abstract isPointIn(point: Vector2d): boolean;
}
export default Element;
