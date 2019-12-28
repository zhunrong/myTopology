export declare class Vector2d {
    static xAxis: Vector2d;
    static yAxis: Vector2d;
    static copy(target: Vector2d): Vector2d;
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    get magnitude(): number;
    getMagnitude(): number;
    add(target: Vector2d): this;
    substract(target: Vector2d): this;
    dotProduct(target: Vector2d): number;
    crossProduct(target: Vector2d): number;
    scale(scalar: number): this;
    edge(target: Vector2d): Vector2d;
    perpendicular(): Vector2d;
    normalize(): Vector2d;
    normal(): Vector2d;
    cosAngle(target: Vector2d): number;
    angle(target: Vector2d): number;
    xAxisAngle(): number;
    rotate(deg: number): this;
    project(target: Vector2d): Vector2d;
    equal(target: Vector2d): boolean;
    distance(target: Vector2d): number;
    copy(target: Vector2d): this;
    clone(): Vector2d;
}
export default Vector2d;
