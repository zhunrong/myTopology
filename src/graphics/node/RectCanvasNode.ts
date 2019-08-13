import CanvasNode, { ICanvasNodeOptions } from '../graph/CanvasNode'
import RectShape from '../shape/RectShape'
import Canvas from '../core/Canvas';
import Vector2d from '../utils/vector2d';
import { imgLoad, applyMixins } from '../utils/utils'
import Math2d from '../utils/math2d'

export interface IRectCanvasNodeOptions extends ICanvasNodeOptions {
  width?: number
  height?: number
  text?: string
}
export class RectCanvasNode extends CanvasNode implements RectShape {
  shapeType = 'rect'
  width: number
  height: number
  text: string
  constructor(options: IRectCanvasNodeOptions) {
    super(options)
    this.width = options.width || 146
    this.height = options.height || 53
    this.text = options.text || ''
  }
  getBoundingJoinPoints(): Vector2d[] {
    return []
  }
  getBoundingRect(): Vector2d[] {
    return []
  }
  getCenterPoint(): Vector2d {
    return new Vector2d(0, 0)
  }
  get vertexes(): Vector2d[] {
    return this.getBoundingRect()
  }
  get boundingRect() {
    return this.getBoundingRect()
  }
  get boundingJoinPoints() {
    return this.getBoundingJoinPoints()
  }
  get centerPoint() {
    return this.getCenterPoint()
  }
  isInRect(points: Vector2d[]): boolean {
    return false
  }
  isPointIn() {
    const { canvas } = this
    if (!canvas) return false
    if (!canvas.nativeEvent) return false
    const event = canvas.nativeEvent as MouseEvent
    const point = canvas.viewPortTopixelCoordinate(new Vector2d(event.clientX, event.clientY))
    return Math2d.isPointInRect(point, this.position, this.width, this.height)
  }
  get joinPoint(): Vector2d {
    const { x, y } = this.position
    return new Vector2d(x + this.width / 2, y + this.height / 2)
  }
  render() {
    if (!this.canvas) return
    const ctx = this.cacheCanvas.getContext('2d') as CanvasRenderingContext2D
    this.cacheCanvas.width = this.width + 4
    this.cacheCanvas.height = this.height + 4

    ctx.rect(2, 2, this.width, this.height)
    ctx.strokeStyle = '#29c1f8'
    ctx.fillStyle = '#fff'
    ctx.lineWidth = 1
    ctx.fill()
    ctx.stroke()
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.font = "14px serif"
    ctx.fillStyle = '#29c1f8'
    ctx.fillText(this.text, this.width / 2 + 2, this.height / 2 + 2)

    this.canvas.repaint = true
  }

  updatePosition() {
    if (!this.canvas) return
    const { graphCanvasCtx } = this.canvas
    const { x, y } = this.position
    if (this.active) {
      graphCanvasCtx.shadowBlur = 5
      graphCanvasCtx.shadowColor = 'rgba(255,0,0,0.8)'
    } else {
      graphCanvasCtx.shadowBlur = 0
      graphCanvasCtx.shadowColor = 'rgba(0, 0, 0, 0)'
    }
    graphCanvasCtx.drawImage(this.cacheCanvas, x - 2, y - 2)
  }

  updateRender() { }
}

applyMixins(RectCanvasNode, [RectShape])

export default RectCanvasNode