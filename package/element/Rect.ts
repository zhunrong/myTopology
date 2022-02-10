import Element from './Element';
import Vector2d from '../utils/Vector2d';
import Math2d from '../utils/Math2d';

interface IRectOptions {
  width: number
  height: number
}

export class Rect extends Element {
  width: number;
  height: number;
  fillStyle = '';
  strokeStyle = '';

  constructor(options: IRectOptions) {
    super();
    this.width = options.width;
    this.height = options.height;
  }

  render(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.position;
    const { x: offsetX, y: offsetY } = this.offset;
    ctx.beginPath();
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(this.rotate);
    ctx.translate(offsetX, offsetY);
    if (this.fillStyle) {
      ctx.fillStyle = this.fillStyle;
      ctx.fillRect(- this.width / 2, - this.height / 2, this.width, this.height);
    }
    if (this.strokeStyle) {
      ctx.strokeStyle = this.strokeStyle;
      ctx.strokeRect(- this.width / 2, - this.height / 2, this.width, this.height);
    }
    ctx.restore();
  }

  isPointIn(point: Vector2d) {
    const p0 = new Vector2d(-this.width / 2, -this.height / 2).add(this.offset).rotate(this.rotate);
    const p1 = new Vector2d(-this.width / 2, this.height / 2).add(this.offset).rotate(this.rotate);
    const p2 = new Vector2d(this.width / 2, this.height / 2).add(this.offset).rotate(this.rotate);
    const p3 = new Vector2d(this.width / 2, -this.height / 2).add(this.offset).rotate(this.rotate);
    return Math2d.isPointInPolygon(Vector2d.copy(point).substract(this.position), [p0, p1, p2, p3]);
  }

}

export default Rect;
