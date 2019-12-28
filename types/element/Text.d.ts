import Element from './Element';
import Vector2d from '../utils/Vector2d';
import Rect from './Rect';
export declare class Text extends Element {
    text: string;
    font: string;
    backgroundColor: string;
    readonly textAlign: CanvasTextAlign;
    readonly textBaseline: CanvasTextBaseline;
    rectElement: Rect;
    constructor(text: string);
    render(ctx: CanvasRenderingContext2D): void;
    get width(): number;
    get height(): number;
    isPointIn(point: Vector2d): boolean;
}
export default Text;
