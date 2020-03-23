import Canvas from '../core/Canvas';
import Vector2d from '../utils/Vector2d';
import Node from '../graph/Node';
export declare class Transport {
    destination: Vector2d;
    distance: Vector2d;
    speed: Vector2d;
    node: Node | null;
    duration: number;
    pass: number;
    complete: boolean;
    update(timeDelta: number): void;
}
export declare abstract class Layout {
    canvas: Canvas;
    transports: Transport[];
    constructor(canvas: Canvas);
    update(): boolean;
    abstract layout(): void;
}
export default Layout;
