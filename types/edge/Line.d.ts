import { IStyle } from '../graph/Graph';
import Vector2d from '../utils/Vector2d';
import { Edge, IEdgeOptions } from '../graph/Edge';
import Element from '../element/Element';
import Triangle from '../element/Triangle';
import Text from '../element/Text';
import Polyline from '../element/Polyline';
import PathAnimate from '../animate/PathAnimate';
export interface ILineOptions extends IEdgeOptions {
    dash?: boolean;
    arrow?: boolean;
    doubleArrow?: boolean;
    animateElement?: Element;
    animateDuration?: number;
}
export interface ILineStyle extends IStyle {
    lineWidth: number;
}
export declare class Line extends Edge {
    dash: boolean;
    arrow: boolean;
    doubleArrow: boolean;
    begin: Vector2d | undefined;
    end: Vector2d | undefined;
    lineElement: Polyline;
    sourceArrowElement: Triangle;
    targetArrowElement: Triangle;
    textElement: Text;
    animate: PathAnimate;
    constructor(options: ILineOptions);
    isInRect(): boolean;
    isPointIn(): boolean;
    render(ctx?: CanvasRenderingContext2D): void;
    drawThumbnail(ctx: CanvasRenderingContext2D): void;
}
export default Line;
