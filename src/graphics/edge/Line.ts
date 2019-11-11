import { IStyle } from '../graph/Graph'
import Vector2d from '../utils/Vector2d'
import { Edge, IEdgeOptions } from '../graph/Edge'
import Math2d from '../utils/Math2d'
import Element from '../element/Element'
import Triangle from '../element/Triangle'
import Text from '../element/Text'
import Polyline from '../element/Polyline'
import PathAnimate from '../animate/PathAnimate'

const ARROW_SIZE = { width: 8, height: 10 }

export interface ILineOptions extends IEdgeOptions {
  // 是否虚线
  dash?: boolean
  // 显示箭头
  arrow?: boolean
  // 双箭头
  doubleArrow?: boolean
  // 动画元素
  animateElement?: Element
  /**
   * 动画持续时间
   */
  animateDuration?: number
}

export interface ILineStyle extends IStyle {
  lineWidth: number
}

export class Line extends Edge {
  dash: boolean
  arrow: boolean
  doubleArrow: boolean
  begin: Vector2d | undefined
  end: Vector2d | undefined
  lineElement = new Polyline()
  sourceArrowElement: Triangle = new Triangle(ARROW_SIZE)
  targetArrowElement: Triangle = new Triangle(ARROW_SIZE)
  textElement: Text = new Text('')
  animate = new PathAnimate()
  constructor(options: ILineOptions) {
    super(options)
    this.dash = options.dash || false
    this.arrow = options.arrow || false
    this.doubleArrow = options.doubleArrow || false
    this.textElement.text = this.text
    this.textElement.offset.y = -10
    this.style.lineWidth = 2
    this.animate.element = options.animateElement || null
    this.animate.duration = options.animateDuration || 0
  }
  isInRect() {
    return true
  }
  isPointIn() {
    const targetNode = this.getTargetNode()
    const sourceNode = this.getSourceNode()
    if (!targetNode.visible && !sourceNode.visible) return false
    const { canvas } = this
    if (!canvas) return false
    if (!canvas.nativeEvent) return false
    if (!this.begin || !this.end) return false
    const event = canvas.nativeEvent as MouseEvent
    const viewCoordinate = new Vector2d(event.clientX, event.clientY)
    const pixelCoordinate = canvas.viewportToPixelCoordinate(viewCoordinate)
    // 判断点是否在线上
    if (this.lineElement.isPointIn(pixelCoordinate)) return true
    // 判断点是否在箭头上
    if (this.doubleArrow) {
      if (this.sourceArrowElement.isPointIn(pixelCoordinate)) return true
      if (this.targetArrowElement.isPointIn(pixelCoordinate)) return true
    } else if (this.arrow) {
      if (this.targetArrowElement.isPointIn(pixelCoordinate)) return true
    }
    // 判断是否在文字上
    if (this.text && this.textElement.isPointIn(pixelCoordinate)) return true
    return false
  }
  render(ctx?: CanvasRenderingContext2D) {
    ctx = ctx || (this.canvas && this.canvas.graphCanvasCtx)
    if (!ctx) return

    const targetNode = this.getTargetNode()
    const sourceNode = this.getSourceNode()
    if (sourceNode.visible || targetNode.visible) {

      const sourceCenter = sourceNode.centerPoint
      const targetCenter = targetNode.centerPoint
      const beginToEnd: [Vector2d, Vector2d] = [sourceCenter, targetCenter]
      this.begin = sourceNode.shapeType === 'rect' ? intersectWithRect(beginToEnd, sourceNode.boundingRect) : intersectWithCircle(sourceCenter, (sourceNode as any).radius, targetCenter)
      if (!this.begin) return
      this.end = targetNode.shapeType === 'rect' ? intersectWithRect(beginToEnd, targetNode.boundingRect) : intersectWithCircle(targetCenter, (targetNode as any).radius, sourceCenter)
      if (!this.end) return

      const sourceToTarget = Vector2d.copy(this.end).substract(this.begin)
      ctx.save()
      ctx.strokeStyle = this.active ? this.style.activeColor : this.style.color
      ctx.fillStyle = this.active ? this.style.activeColor : this.style.color
      if /* 虚线 */ (this.dash) {
        ctx.setLineDash([4, 4])
      }

      // 画线
      this.lineElement.lineWidth = this.style.lineWidth
      this.lineElement.points = [this.begin, this.end]
      this.lineElement.render(ctx)

      const rotate = sourceToTarget.xAxisAngle()

      if /* 文本 */ (this.text) {
        this.textElement.text = this.text
        const lineCenter = Vector2d.copy(this.begin).add(Vector2d.copy(sourceToTarget).scale(1 / 2))
        this.textElement.position.copy(lineCenter)
        this.textElement.rotate = (-Math.PI / 2 <= rotate && rotate < Math.PI / 2) ? rotate : rotate - Math.PI
        this.textElement.render(ctx)
      }

      if /* 双向箭头 */ (this.doubleArrow) {
        this.sourceArrowElement.position.copy(this.begin)
        this.sourceArrowElement.rotate = rotate + Math.PI
        this.sourceArrowElement.render(ctx)
        this.targetArrowElement.position.copy(this.end)
        this.targetArrowElement.rotate = rotate
        this.targetArrowElement.render(ctx)
      } else if /* 单向箭头 */ (this.arrow) {
        this.targetArrowElement.position.copy(this.end)
        this.targetArrowElement.rotate = rotate
        this.targetArrowElement.render(ctx)
      }

      this.animate.path = [this.begin, this.end]
      this.animate.update()
      this.animate.render(ctx)

      ctx.restore()
    }
  }

  drawThumbnail(ctx: CanvasRenderingContext2D) {
    this.render(ctx)
  }
}

/**
 * 获取线段与矩形的交点
 * @param line 
 * @param rect 
 */
function intersectWithRect(line: [Vector2d, Vector2d], rect: Vector2d[]) {
  const length = rect.length
  for (let i = 0; i < length; i++) {
    const A = rect[i]
    const B = i === length - 1 ? rect[0] : rect[i + 1]
    if (Math2d.isIntersect(line, [A, B])) {
      return Math2d.getLineIntersect([A, B], line)
    }
  }
  return undefined
}

/**
 * 获取从圆心出发的线段与该圆的交点
 * @param o 圆心坐标 
 * @param radius 半径
 * @param point 线段的另一端点
 */
function intersectWithCircle(o: Vector2d, radius: number, point: Vector2d) {
  const line = Vector2d.copy(point).substract(o)
  if (line.magnitude < radius) return undefined
  const angle = line.xAxisAngle()
  return Vector2d.copy(o).add(new Vector2d(radius * Math.cos(angle), radius * Math.sin(angle)))
}

export default Line