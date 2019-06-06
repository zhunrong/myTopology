import ANode, { IANodeOptions } from '../ANode'
import Canvas from '../Canvas'
import Vector2d from '../../utils/vector2d';
import Math2d from '../../utils/math2d'
export interface IRectOptions extends IANodeOptions {
  id: number
  width: number
  height: number
  fillStyle?: string
  text?: string
}
export default class Rect extends ANode {
  id: number
  width: number
  height: number
  cacheCanvas: HTMLCanvasElement = document.createElement('canvas')
  fillStyle: string
  text: string
  readonly renderType: string = 'canvas'
  constructor(options: IRectOptions) {
    super(options)
    this.width = options.width
    this.height = options.height
    this.fillStyle = options.fillStyle || '#ccc'
    this.text = options.text || ''
    this.id = options.id
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
  get joinPoint() {
    return this.position.add(new Vector2d(this.width / 2, this.height / 2))
  }
  hitTest(canvas: Canvas) {
    if (!canvas.nativeEvent) return false
    const viewCoordinate = new Vector2d(canvas.nativeEvent.clientX, canvas.nativeEvent.clientY)
    const pixelCoordinate = canvas.viewPortTopixelCoordinate(viewCoordinate)
    return Math2d.isPointInPolygon(pixelCoordinate, this.vertexes)
  }
  isInVisibleRect(points: Vector2d[]) {
    return true
  }
  draw() {
    this.cacheCanvas.width = this.width
    this.cacheCanvas.height = this.height
    const ctx = this.cacheCanvas.getContext('2d')
    if (!ctx) return
    ctx.rect(0, 0, this.width, this.height)
    ctx.fillStyle = '#ccc'
    ctx.fill()
  }
  render(canvas: Canvas) {
    if (!this.visible) return
    const { canvasContext } = canvas
    // canvasContext.save()
    // canvasContext.rect(this.position.x, this.position.y, this.width, this.height)
    // canvasContext.fillStyle = '#ccc'
    // canvasContext.fill()
    // canvasContext.restore()
    canvasContext.drawImage(this.cacheCanvas, this.position.x, this.position.y)
  }
}