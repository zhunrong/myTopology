import Node, { INodeOptions } from './Node';
import Vector2d from '../utils/Vector2d';
import Math2d from '../utils/Math2d';

export interface IRectNodeOptions extends INodeOptions {
  width?: number
  height?: number
  minWidth?: number
  minHeight?: number
}

export abstract class RectNode extends Node {
  shapeType = 'rect';

  /**
   * 矩形宽度
   */
  width: number;
  /**
   * 矩形高度
   */
  height: number;
  /**
   * 最小宽度
   */
  minWidth: number;
  /**
   * 最小高度
   */
  minHeight: number;
  /**
   * 折叠宽度
   */
  collapseWidth = 50;
  /**
   * 折叠高度
   */
  collapseHeight = 50;

  constructor(options: IRectNodeOptions) {
    super(options);
    this.width = options.width || 100;
    this.height = options.height || 100;
    this.minWidth = options.minWidth || 30;
    this.minHeight = options.minHeight || 30;
  }
  get vertexes(): Vector2d[] {
    return this.getBoundingRect();
  }
  get boundingRect() {
    return this.getBoundingRect();
  }
  get boundingJoinPoints() {
    return this.getBoundingJoinPoints();
  }
  get centerPoint() {
    return this.getCenterPoint();
  }

  get circumradius() {
    const width = this.getWidth();
    const height = this.getHeight();
    return Math.sqrt(width ** 2 + height ** 2) / 2;
  }

  /**
   * 获取实际位置
   */
  getPosition(): Vector2d {
    if /* 展开状态 */ (this.isExpanded) {
      return this.position;
    } /* 折叠状态 */ else {
      const { x, y } = this.position;
      return new Vector2d(x + (this.width - this.collapseWidth) / 2, y + (this.height - this.collapseHeight) / 2);
    }
  }

  /**
   * 获取计算宽度
   */
  getWidth(): number {
    return this.isExpanded ? this.width : this.collapseWidth;
  }

  /**
   * 获取计算高度
   */
  getHeight(): number {
    return this.isExpanded ? this.height : this.collapseHeight;
  }

  isPointIn() {
    const { canvas } = this;
    if (!canvas) return false;
    if (!this.visible) return false;
    if (!canvas.nativeEvent) return false;
    const event = canvas.nativeEvent as MouseEvent;
    const point = canvas.viewportToPixelCoordinate(new Vector2d(event.clientX, event.clientY));
    return Math2d.isPointInRect(point, this.getPosition(), this.getWidth(), this.getHeight());
  }

  get joinPoint(): Vector2d {
    const { x, y } = this.getPosition();
    return new Vector2d(x + this.getWidth() / 2, y + this.getHeight() / 2);
  }

  /**
   * 边界矩形坐标数组
   */
  getBoundingRect(): Vector2d[] {
    const width = this.getWidth();
    const height = this.getHeight();
    const { x, y } = this.getPosition();
    return [
      new Vector2d(x, y),
      new Vector2d(x + width, y),
      new Vector2d(x + width, y + height),
      new Vector2d(x, y + height)
    ];
  }
  /**
   * 边界矩形上的连接点坐标数组
   */
  getBoundingJoinPoints(): Vector2d[] {
    const width = this.getWidth();
    const height = this.getHeight();
    const { x, y } = this.getPosition();
    return [
      new Vector2d(x + width / 2, y),
      new Vector2d(x + width, y + height / 2),
      new Vector2d(x + width / 2, y + height),
      new Vector2d(x, y + height / 2)
    ];
  }
  /**
   * 几何中点坐标
   */
  getCenterPoint(): Vector2d {
    const width = this.getWidth();
    const height = this.getHeight();
    const { x, y } = this.getPosition();
    return new Vector2d(x + width / 2, y + height / 2);
  }

  /**
   * 是否在矩形中
   * @param points
   */
  isInRect(points: Vector2d[]): boolean {
    const vertexes = this.getBoundingRect();
    // 左
    if (points[0].x > vertexes[2].x) return false;
    // 右
    if (points[2].x < vertexes[0].x) return false;
    // 上
    if (points[0].y > vertexes[2].y) return false;
    // 下
    if (points[2].y < vertexes[0].y) return false;
    return true;
  }

  /**
   * 是否包含于某矩形
   * @param rect
   */
  isWrappedInRect(rect: Vector2d[]): boolean {
    const vertexes = this.getBoundingRect();
    return rect[0].x <= vertexes[0].x && rect[0].y <= vertexes[0].y && rect[2].x >= vertexes[2].x && rect[2].y >= vertexes[2].y;
  }

  drawThumbnail(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.getPosition();
    const width = this.getWidth();
    const height = this.getHeight();
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = this.active ? this.style.activeColor : this.style.color;
    ctx.fill();
    ctx.restore();
  }
}

export default RectNode;
