import Element from './Element'
import Vector2d from '../utils/vector2d'
import Math2d from '../utils/math2d'

const pointCopy = new Vector2d()
export class Polyline extends Element {
  points: Vector2d[] = []
  lineWidth: number = 1
  render(ctx: CanvasRenderingContext2D) {
    if (this.points.length < 2) return
    const { x: offsetX, y: offsetY } = this.offset
    ctx.save()
    ctx.lineWidth = this.lineWidth
    ctx.beginPath()
    ctx.translate(offsetX, offsetY)
    this.points.forEach((point, index) => {
      const { x, y } = point
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()
    ctx.restore()
  }
  isPointIn(point: Vector2d) {
    return Math2d.isPointInPolyline(pointCopy.copy(point).substract(this.offset), this.points, 0.1)
  }
}

export default Polyline