import CanvasNode, { ICanvasNodeOptions } from '../graph/CanvasNode'
import RectShape from '../shape/RectShape'
import Canvas from '../core/Canvas';
import Vector2d from '../utils/vector2d';
import { imgLoad, applyMixins } from '../utils/utils'
import Math2d from '../utils/math2d'

interface IRectOptions extends ICanvasNodeOptions {
  width?: number
  height?: number
  text?: string
  id: number
}
export class RectCanvasNode extends CanvasNode implements RectShape {
  shapeType = 'rect'
  width: number
  height: number
  id: number
  text: string
  constructor(options: IRectOptions) {
    super(options)
    this.width = options.width || 146
    this.height = options.height || 53
    this.id = options.id
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
    if (!canvas.nativeEvent) return false
    const event = canvas.nativeEvent as MouseEvent
    const point = canvas.viewPortTopixelCoordinate(new Vector2d(event.clientX, event.clientY))
    return Math2d.isPointInRect(point, this.position, this.width, this.height)
  }
  get joinPoint(): Vector2d {
    const { x, y } = this.position
    return new Vector2d(x + this.width / 2, y + this.height / 2)
  }
  async render() {
    const ctx = this.cacheCanvas.getContext('2d') as CanvasRenderingContext2D
    this.cacheCanvas.width = this.width + 2
    this.cacheCanvas.height = this.height + 2

    ctx.rect(1, 1, this.width, this.height)
    ctx.strokeStyle = '#29c1f8'
    ctx.fillStyle = '#fff'
    ctx.lineWidth = 2
    ctx.fill()
    ctx.stroke()
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.font = "14px serif"
    ctx.fillStyle = '#29c1f8'
    ctx.fillText(this.text, this.width / 2 + 1, this.height / 2 + 1)

    this.canvas.repaint = true
  }

  updatePosition() {
    const { graphCanvasCtx } = this.canvas
    const { x, y } = this.position
    if (this.active) {
      graphCanvasCtx.shadowBlur = 5
      graphCanvasCtx.shadowColor = 'rgba(255,0,0,0.8)'
    }
    graphCanvasCtx.drawImage(this.cacheCanvas, x - 1, y - 1)
  }

  updateRender() { }
}

applyMixins(RectCanvasNode, [RectShape])

export default RectCanvasNode