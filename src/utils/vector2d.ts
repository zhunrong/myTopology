export default class Vector2d {
  x: number
  y: number
  magnitude: number
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.magnitude = this.getMagnitude();
  }

  /**
   * 取模
   */
  getMagnitude(): number {
    if (this.x === 0 && this.y === 0) {
      return 0.000000001;
    }
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * 矢量加
   * @param target 
   */
  add(target: Vector2d): Vector2d {
    return new Vector2d(this.x + target.x, this.y + target.y);
  }

  /**
   * 矢量减
   * @param target 
   */
  substract(target: Vector2d): Vector2d {
    return new Vector2d(this.x - target.x, this.y - target.y);
  }

  /**
   * 点积
   * @param target 
   */
  dotProduct(target: Vector2d): number {
    return this.x * target.x + this.y * target.y;
  }

  /**
   * 叉积
   * @param target 
   */
  crossProduct(target: Vector2d): number {
    return this.x * target.y - this.y * target.x
  }

  /**
   * 与标量的积
   * @param scalar 
   */
  scale(scalar: number): Vector2d {
    return new Vector2d(this.x * scalar, this.y * scalar);
  }

  /**
   * 求边缘向量
   */
  edge(target: Vector2d): Vector2d {
    return this.substract(target);
  }

  /**
   * 求正交向量
   */
  perpendicular(): Vector2d {
    return new Vector2d(this.y, -this.x);
  }

  /**
   * 求单位向量
   */
  normalize(): Vector2d {
    return new Vector2d(this.x / this.magnitude, this.y / this.magnitude);
  }

  /**
   * 求法向量
   */
  normal(): Vector2d {
    return this.perpendicular().normalize();
  }

  /**
   * 求与目标向量的夹角余弦值
   * @param target 
   */
  cosAngle(target: Vector2d): number {
    return this.dotProduct(target) / (this.magnitude * target.magnitude);
  }

  /**
   * 求与目标向量的夹角 弧度值
   * @param target 
   */
  angle(target: Vector2d): number {
    return Math.acos(this.cosAngle(target));
  }

  /**
   * 与x轴夹角(顺时针为正)
   */
  xAxisAngle(): number {
    const xAxis = new Vector2d(1, 0)
    const angle = this.angle(xAxis)
    return this.y > 0 ? angle : -angle
  }

  /**
   * 对向量进行旋转(参数为弧度值)
   * @param deg 
   */
  rotate(deg: number): Vector2d {
    const { x, y } = this
    return new Vector2d(x * Math.cos(deg) - y * Math.sin(deg), x * Math.sin(deg) + y * Math.cos(deg))
  }
}