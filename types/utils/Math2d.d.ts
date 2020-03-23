import Vector2d from './Vector2d';
export declare class Math2d {
    static isPointInRect(P: Vector2d, rectPosition: Vector2d, width: number, height: number): boolean;
    static isPointInCircle(P: Vector2d, C: Vector2d, radius: number): boolean;
    static isPointInTriangle(P: Vector2d, A: Vector2d, B: Vector2d, C: Vector2d): boolean;
    static isPointInPolygon(P: Vector2d, points: Vector2d[]): boolean;
    static isPointInLineSegment(P: Vector2d, lineSegment: [Vector2d, Vector2d], deviation?: number): boolean;
    static isPointInPolyline(P: Vector2d, polyline: Vector2d[], deviation?: number): boolean;
    static isIntersect(line1: [Vector2d, Vector2d], line2: [Vector2d, Vector2d]): boolean;
    static getLineIntersect(line1: [Vector2d, Vector2d], line2: [Vector2d, Vector2d]): Vector2d;
    static getLinePoint(line: Vector2d[], ratio: number): Vector2d | null;
    static getPolyLineLength(line: Vector2d[]): number;
}
export default Math2d;
