import CanvasNode, { ICanvasNodeOptions } from '../graph/CanvasNode'
import { BoundingRect } from '../graph/Node'
import Canvas from '../core/Canvas';
import Vector2d from '../utils/vector2d';
import { imgLoad } from '../utils/utils'
import Math2d from '../utils/math2d'

interface IRectOptions extends ICanvasNodeOptions {
  width?: number
  height?: number
  text?: string
  id: number
}
export class Rect extends CanvasNode {
  width: number
  height: number
  id: number
  text: string
  init: boolean = false
  constructor(options: IRectOptions) {
    super(options)
    this.width = options.width || 146
    this.height = options.height || 53
    this.id = options.id
    this.text = options.text || ''
    this.draw()
  }
  get vertexes(): Vector2d[] {
    const { x, y } = this.position
    return [
      this.position,
      new Vector2d(x + this.width, y),
      new Vector2d(x + this.width, y + this.height),
      new Vector2d(x, y + this.height)
    ]
  }
  get boundingRect(): BoundingRect {
    const { x, y } = this.position
    return [
      this.position,
      new Vector2d(x + this.width, y),
      new Vector2d(x + this.width, y + this.height),
      new Vector2d(x, y + this.height)
    ]
  }
  get boundingJoinPoints(): Vector2d[] {
    const { x, y } = this.position
    const { width, height } = this
    return [
      new Vector2d(x + width / 2, y),
      new Vector2d(x + width, y + height / 2),
      new Vector2d(x + width / 2, y + height),
      new Vector2d(x, y + height / 2)
    ]
  }
  isInRect(points: Vector2d[]): boolean {
    const vertexes = this.vertexes
    // 左
    if (points[0].x > vertexes[2].x) return false
    // 右
    if (points[2].x < vertexes[0].x) return false
    // 上
    if (points[0].y > vertexes[2].y) return false
    // 下
    if (points[2].y < vertexes[0].y) return false
    return true
  }
  isPointIn(canvas: Canvas) {
    if (!canvas.nativeEvent) return false
    const event = canvas.nativeEvent as MouseEvent
    const point = canvas.viewPortTopixelCoordinate(new Vector2d(event.clientX, event.clientY))
    return Math2d.isPointInRect(point, this.position, this.width, this.height)
  }
  get joinPoint(): Vector2d {
    const { x, y } = this.position
    return new Vector2d(x + this.width / 2, y + this.height / 2)
  }
  async draw() {
    const img = await imgLoad(require('../../assets/node_bg.png'))
    const ctx = this.cacheCanvas.getContext('2d')
    this.cacheCanvas.width = this.width
    this.cacheCanvas.height = this.height
    if (ctx) {
      // ctx.clearRect(0, 0, this.width, this.height)
      ctx.rect(3, 3, this.width - 6, this.height - 6)
      ctx.fillStyle = '#fff'
      ctx.fill()
      ctx.drawImage(img, 0, 0)
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      ctx.font = "14px serif"
      ctx.fillText(this.text, this.width / 2, this.height / 2)
    }
    if (this.canvas) {
      this.canvas.repaint = true
    }
    this.init = true
  }
  render(canvas: Canvas) {
    const { graphCanvasCtx } = canvas
    if (this.init) {
      graphCanvasCtx.drawImage(this.cacheCanvas, this.position.x, this.position.y)
    }
  }

}

export default Rect