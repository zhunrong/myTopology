import Layout, { Transport } from './Layout';
import Vector2d from '../utils/Vector2d';
declare class ForceTransport extends Transport {
    M: number;
    Q: number;
    force: Vector2d;
    accelerate: Vector2d;
    update(): void;
}
export declare class ForceLayout extends Layout {
    transports: ForceTransport[];
    elasticity: number;
    attractive: number;
    repulsion: number;
    damping: number;
    edgeLength: number;
    complete: boolean;
    animate: boolean;
    layout(): void;
    update(): boolean;
    calculateForce(): void;
}
export default ForceLayout;
