import CanvasNode, { ICanvasNodeOptions } from '../graph/CanvasNode'
import CircleShape from '../shape/CircleShape'
import Vector2d from '../utils/vector2d'
import Math2d from '../utils/math2d'
import { applyMixins } from '../utils/utils'

export interface ICircleCanvasNodeOptions extends ICanvasNodeOptions {
  radius: number
  id: number
  text?: string
}

export class CircleCanvasNode extends CanvasNode implements CircleShape {
  radius: number
  id: number
  text: string
  get boundingJoinPoints(): Vector2d[] {
    return this.getBoundingJoinPoints()
  }
  get boundingRect(): Vector2d[] {
    return this.getBoundingRect()
  }
  get centerPoint(): Vector2d {
    return this.getCenterPoint()
  }
  get vertexes(): Vector2d[] {
    return this.getBoundingRect()
  }
  constructor(options: ICircleCanvasNodeOptions) {
    super(options)
    this.radius = options.radius
    this.id = options.id
    this.text = options.text || ''
  }
  isPointIn() {
    const { canvas, centerPoint, radius } = this
    if (!canvas.nativeEvent) return false
    const event = canvas.nativeEvent as MouseEvent
    const point = canvas.viewPortTopixelCoordinate(new Vector2d(event.clientX, event.clientY))
    return Math2d.isPointInCircle(point, centerPoint, radius)
  }
  render() {
    const { radius, canvas, active } = this
    const diameter = 2 * radius
    this.cacheCanvas.width = diameter + 2
    this.cacheCanvas.height = diameter + 2
    const ctx = this.cacheCanvas.getContext('2d') as CanvasRenderingContext2D

    ctx.beginPath()

    ctx.arc(radius + 1, radius + 1, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = '#29c1f8'
    ctx.fillStyle = '#fff'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fill()

    if (this.text) {
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      ctx.font = "14px serif"
      ctx.fillStyle = '#29c1f8'
      ctx.fillText(this.text, radius + 1, radius + 1)
    }


    canvas.repaint = true
  }
  updateRender() { }
  updatePosition() {
    const { graphCanvasCtx } = this.canvas
    const { x, y } = this.position
    if (this.active) {
      graphCanvasCtx.shadowBlur = 5
      graphCanvasCtx.shadowColor = 'rgba(255,0,0,0.8)'
    }
    graphCanvasCtx.drawImage(this.cacheCanvas, x-1, y-1)
  }

  // CircleShape mixins
  getBoundingJoinPoints(): Vector2d[] {
    return []
  }
  getBoundingRect(): Vector2d[] {
    return []
  }
  getCenterPoint(): Vector2d {
    return new Vector2d(0, 0)
  }
}

applyMixins(CircleCanvasNode, [CircleShape])
export default CircleCanvasNode