import { Vector2d } from '../utils/vector2d'
import { Math2d } from '../utils/math2d'

interface ITriangleOptions {
  width: number
  height: number
}
export class Triangle {
  width: number
  height: number
  position: Vector2d = new Vector2d()
  rotate: number = 0

  constructor(options: ITriangleOptions) {
    this.width = options.width
    this.height = options.height
  }

  render(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.position
    ctx.beginPath()
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(this.rotate)
    ctx.moveTo(0, 0)
    ctx.lineTo(- this.height, + this.width / 2)
    ctx.lineTo(- this.height, - this.width / 2)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  isPointIn(point: Vector2d) {
    const p0 = new Vector2d(0, 0).rotate(this.rotate)
    const p1 = new Vector2d(- this.height, + this.width / 2).rotate(this.rotate)
    const p2 = new Vector2d(- this.height, - this.width / 2).rotate(this.rotate)
    return Math2d.isPointInTriangle(Vector2d.copy(point).substract(this.position), p0, p1, p2)
  }
}

export default Triangle