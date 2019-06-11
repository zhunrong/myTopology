import CanvasNode, { ICanvasNodeOptions } from '../../graphics/core/CanvasNode'
import Canvas from '../../graphics/Canvas'
import Vector2d from '../../utils/vector2d'
import Math2d from '../../utils/math2d'
interface INodeOptions extends ICanvasNodeOptions {
  text: string
}
export default class Node extends CanvasNode {
  width: number = 50
  height: number = 50
  text: string
  constructor(options: INodeOptions) {
    super(options)
    // this.width = options.width
    // this.height = options.height
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
    const viewCoordinate = new Vector2d(canvas.nativeEvent.clientX, canvas.nativeEvent.clientY)
    const pixelCoordinate = canvas.viewPortTopixelCoordinate(viewCoordinate)
    return Math2d.isPointInPolygon(pixelCoordinate, this.vertexes)
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
    const { canvasContext } = canvas
    canvasContext.drawImage(this.cacheCanvas, this.position.x, this.position.y)
  }
}