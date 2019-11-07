import Element from './Element'
import Vector2d from '../utils/Vector2d'
import Math2d from '../utils/Math2d'

interface ITriangleOptions {
  width: number
  height: number
}
export class Triangle extends Element {
  width: number
  height: number

  constructor(options: ITriangleOptions) {
    super()
    this.width = options.width
    this.height = options.height
  }

  render(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.position
    const { x: offsetX, y: offsetY } = this.offset
    ctx.beginPath()
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(this.rotate)
    ctx.translate(offsetX, offsetY)
    ctx.moveTo(0, 0)
    ctx.lineTo(- this.height, + this.width / 2)
    ctx.lineTo(- this.height, - this.width / 2)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  isPointIn(point: Vector2d) {
    const p0 = new Vector2d(0, 0).add(this.offset).rotate(this.rotate)
    const p1 = new Vector2d(- this.height, + this.width / 2).add(this.offset).rotate(this.rotate)
    const p2 = new Vector2d(- this.height, - this.width / 2).add(this.offset).rotate(this.rotate)
    return Math2d.isPointInTriangle(Vector2d.copy(point).substract(this.position), p0, p1, p2)
  }
}

export default Triangle