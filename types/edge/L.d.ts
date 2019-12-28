import { Vector2d } from '../utils/Vector2d';
import { Edge, IEdgeOptions } from '../graph/Edge';
import Triangle from '../element/Triangle';
import Text from '../element/Text';
import Element from '../element/Element';
import Polyline from '../element/Polyline';
import PathAnimate from '../animate/PathAnimate';
export interface ILOptions extends IEdgeOptions {
    dash?: boolean;
    text?: string;
    arrow?: boolean;
    doubleArrow?: boolean;
    animateElement?: Element;
    animateDuration?: number;
}
export declare class L extends Edge {
    dash: boolean;
    arrow: boolean;
    doubleArrow: boolean;
    arrowStart: Vector2d | undefined;
    middlePoints: Vector2d[];
    centerPoint: Vector2d | null;
    sourceJoinPoint: Vector2d | undefined;
    targetJoinPoint: Vector2d | undefined;
    sourceArrowElement: Triangle;
    targetArrowElement: Triangle;
    textElement: Text;
    lineElement: Polyline;
    animate: PathAnimate;
    constructor(options: ILOptions);
    isInRect: () => boolean;
    isPointIn(): boolean;
    render(ctx?: CanvasRenderingContext2D): void;
    drawThumbnail(ctx: CanvasRenderingContext2D): void;
}
export default L;
