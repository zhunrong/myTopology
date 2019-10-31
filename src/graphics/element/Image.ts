import Element from './Element'
import { imgLoad } from '../utils/utils'
import { Vector2d } from '../utils/vector2d'
import { Math2d } from '../utils/math2d'

export class Image extends Element {

  image: CanvasImageSource | undefined
  constructor(source: string | CanvasImageSource) {
    super()
    if (typeof source === 'string') {
      (async () => {
        try {
          this.image = await imgLoad(source)
        } catch (error) {
          console.error(error)
        }
      })()
    } else {
      this.image = source
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.image) return
    const { width, height } = this.image
    const { x, y } = this.position
    const { x: offsetX, y: offsetY } = this.offset
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(this.rotate)
    ctx.translate(offsetX, offsetY)
    ctx.drawImage(this.image, -width / 2, -height / 2)
    ctx.restore()
  }

  isPointIn(point: Vector2d) {
    if (!this.image) return false
    const { width, height } = this.image
    const p0 = new Vector2d(-width / 2, -height / 2).add(this.offset).rotate(this.rotate)
    const p1 = new Vector2d(-width / 2, +height / 2).add(this.offset).rotate(this.rotate)
    const p2 = new Vector2d(+width / 2, +height / 2).add(this.offset).rotate(this.rotate)
    const p3 = new Vector2d(+width / 2, -height / 2).add(this.offset).rotate(this.rotate)
    return Math2d.isPointInPolygon(Vector2d.copy(point).substract(this.position), [p0, p1, p2, p3])
  }

}

export default Image