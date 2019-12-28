import Layout from './Layout';
export declare class CircularLayout extends Layout {
    clockwise: boolean;
    radius: number;
    startAngle: number;
    endAngle: number;
    duration: number;
    gap: number;
    nodeRadius: number;
    layout(): void;
}
export default CircularLayout;
