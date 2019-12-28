import Element from './Element';
import Vector2d from '../utils/Vector2d';
export declare class Img extends Element {
    image: CanvasImageSource | undefined;
    constructor(source: string | CanvasImageSource);
    render(ctx: CanvasRenderingContext2D): void;
    isPointIn(point: Vector2d): boolean;
}
export default Img;
