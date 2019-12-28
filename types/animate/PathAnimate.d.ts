import Vector2d from '../utils/Vector2d';
import Element from '../element/Element';
export declare class PathAnimate {
    path: Vector2d[];
    element: Element | null;
    duration: number;
    progress: number;
    private _lastPoint;
    update(timeDelta: number): void;
    render(ctx: CanvasRenderingContext2D): void;
}
export default PathAnimate;
