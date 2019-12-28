import Node, { INodeOptions, BoundingRect } from './Node';
import Vector2d from '../utils/Vector2d';
export declare class VirtualNode extends Node {
    maxDepth: boolean;
    renderType: 'NONE';
    shapeType: string;
    radius: number;
    constructor(options: INodeOptions);
    get vertexes(): Vector2d[];
    get boundingRect(): BoundingRect;
    get boundingJoinPoints(): Vector2d[];
    get joinPoint(): Vector2d;
    get centerPoint(): Vector2d;
    get depth(): number;
    get circumradius(): number;
    isInRect(): boolean;
    isPointIn(): boolean;
    render(): void;
    destroy(): void;
    updatePosition(): void;
    updateRender(): void;
    drawThumbnail(): void;
}
export default VirtualNode;
