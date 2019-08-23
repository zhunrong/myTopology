export class Vector2d {
  static xAxis = new Vector2d(1, 0)
  static yAxis = new Vector2d(0, 1)
  static copy(target: Vector2d): Vector2d {
    if (copyIndex > copys.length - 1) {
      copyIndex = 0
    }
    return copys[copyIndex++].copy(target)
  }

  x: number
  y: number
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  get magnitude(): number {
    return this.getMagnitude()
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
  add(target: Vector2d): this {
    this.x += target.x
    this.y += target.y
    return this
  }

  /**
   * 矢量减
   * @param target 
   */
  substract(target: Vector2d): this {
    this.x -= target.x
    this.y -= target.y
    return this
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
  scale(scalar: number): this {
    this.x *= scalar
    this.y *= scalar
    return this
  }

  /**
   * 求边缘向量,返回新向量
   */
  edge(target: Vector2d): Vector2d {
    return this.clone().substract(target);
  }

  /**
   * 求正交向量,返回新向量
   */
  perpendicular(): Vector2d {
    return new Vector2d(this.y, -this.x);
  }

  /**
   * 求单位向量,返回新向量
   */
  normalize(): Vector2d {
    const magnitude = this.getMagnitude()
    return new Vector2d(this.x / magnitude, this.y / magnitude);
  }

  /**
   * 求法向量,返回新向量
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
   * 与x轴夹角(顺时针为正) [-Math.PI,Math.PI]
   */
  xAxisAngle(): number {
    const angle = this.angle(Vector2d.xAxis)
    return this.y > 0 ? angle : -angle
  }

  /**
   * 对向量进行旋转(参数为弧度值)
   * @param deg 
   */
  rotate(deg: number): this {
    const { x, y } = this
    this.x = x * Math.cos(deg) - y * Math.sin(deg)
    this.y = x * Math.sin(deg) + y * Math.cos(deg)
    return this
  }

  /**
   * 在目标向量上的投影,返回新向量
   * @param target 
   */
  project(target: Vector2d): Vector2d {
    const magnitude = this.dotProduct(target) / target.magnitude
    return target.normalize().scale(magnitude)
  }

  /**
   * 是否与目标向量相等
   * @param target 
   */
  equal(target: Vector2d): boolean {
    return this.x === target.x && this.y === target.y
  }

  /**
   * 与目标向量的距离
   * @param target 
   */
  distance(target: Vector2d): number {
    return this.edge(target).magnitude
  }

  /**
   * 复制目标向量
   * @param target 
   */
  copy(target: Vector2d): this {
    this.x = target.x
    this.y = target.y
    return this
  }

  /**
   * 克隆,复制当前向量返回新的向量
   */
  clone(): Vector2d {
    return new Vector2d(this.x, this.y)
  }
}

// 用于copy向量(优化)
let copyIndex = 0
let copyCount = 200
const copys: Vector2d[] = []
while (copyCount--) {
  copys.push(new Vector2d())
}

export default Vector2d