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
    // this.draw()
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
  async render() {
    const ctx = this.cacheCanvas.getContext('2d') as CanvasRenderingContext2D
    this.cacheCanvas.width = this.width
    this.cacheCanvas.height = this.height

    ctx.rect(0, 0, this.width, this.height)
    ctx.fillStyle = '#ccc'
    ctx.fill()
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.font = "14px serif"
    ctx.fillStyle = '#fff'
    ctx.fillText(this.text, this.width / 2, this.height / 2)

    this.canvas.repaint = true
  }
  updatePosition() {
    const { graphCanvasCtx } = this.canvas
    graphCanvasCtx.drawImage(this.cacheCanvas, this.position.x, this.position.y)
  }
  updateRender() { }
}

applyMixins(RectCanvasNode, [RectShape])

export default RectCanvasNode