import Element from './Element'
import Vector2d from '../utils/Vector2d'
import Math2d from '../utils/Math2d'
import Rect from './Rect'

const ctx = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D

export class Text extends Element {
  text: string
  font: string = '14px sans-serif'
  backgroundColor: string = ''
  readonly textAlign: CanvasTextAlign = 'center'
  readonly textBaseline: CanvasTextBaseline = 'middle'
  rectElement = new Rect({
    width: 0,
    height: 0
  })

  constructor(text: string) {
    super()
    this.text = text
  }

  render(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.position
    const { x: offsetX, y: offsetY } = this.offset
    ctx.save()
    if (this.backgroundColor) {
      this.rectElement.width = this.width
      this.rectElement.height = this.height
      this.rectElement.fillStyle = this.backgroundColor
      this.rectElement.position.copy(this.position)
      this.rectElement.offset.copy(this.offset)
      this.rectElement.rotate = this.rotate
      this.rectElement.render(ctx)
    }
    ctx.font = this.font
    ctx.textAlign = this.textAlign
    ctx.textBaseline = this.textBaseline
    ctx.translate(x, y)
    ctx.rotate(this.rotate)
    ctx.fillText(this.text, offsetX, offsetY)
    ctx.restore()
  }

  get width() {
    ctx.font = this.font
    ctx.textAlign = this.textAlign
    ctx.textBaseline = this.textBaseline
    return ctx.measureText(this.text).width
  }

  get height() {
    ctx.font = this.font
    return parseInt(ctx.font)
  }

  isPointIn(point: Vector2d) {
    const textRectWidth = this.width
    const textRectHeight = this.height
    const p0 = new Vector2d(-textRectWidth / 2, -textRectHeight / 2).add(this.offset).rotate(this.rotate)
    const p1 = new Vector2d(-textRectWidth / 2, textRectHeight / 2).add(this.offset).rotate(this.rotate)
    const p2 = new Vector2d(textRectWidth / 2, textRectHeight / 2).add(this.offset).rotate(this.rotate)
    const p3 = new Vector2d(textRectWidth / 2, -textRectHeight / 2).add(this.offset).rotate(this.rotate)
    return Math2d.isPointInPolygon(Vector2d.copy(point).substract(this.position), [p0, p1, p2, p3])
  }
}

export default Text