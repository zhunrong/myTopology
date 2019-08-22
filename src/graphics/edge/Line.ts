import { Vector2d } from '../utils/vector2d'
import { Edge, IEdgeOptions } from '../graph/Edge'
import { Canvas } from '../core/Canvas'
import { Math2d } from '../utils/math2d'

export interface ILineOptions extends IEdgeOptions {
  // 是否虚线
  dash?: boolean
  // 显示文本
  text?: string
  // 显示箭头
  arrow?: boolean
}
export class Line extends Edge {
  dash: boolean
  text: string
  arrow: boolean
  rotate: number = 0
  begin: Vector2d | undefined
  end: Vector2d | undefined
  constructor(options: ILineOptions) {
    super(options)
    this.dash = options.dash || false
    this.text = options.text || ''
    this.arrow = options.arrow || false
  }
  isInRect() {
    return true
  }
  isPointIn() {
    const { canvas } = this
    if (!canvas) return false
    if (!canvas.nativeEvent) return false
    if (!this.begin || !this.end) return false
    const event = canvas.nativeEvent as MouseEvent
    const viewCoordinate = new Vector2d(event.clientX, event.clientY)
    const pixelCoordinate = canvas.viewportToPixelCoordinate(viewCoordinate)
    // 判断点是否在线上
    if (Math2d.isPointInLineSegment(pixelCoordinate, [this.begin, this.end], 0.1)) return true
    // 判断点是否在箭头上
    if (this.arrow) {
      const p0 = new Vector2d(0, 0).rotate(this.rotate)
      const p1 = new Vector2d(- 10, + 4).rotate(this.rotate)
      const p2 = new Vector2d(- 10, - 4).rotate(this.rotate)
      if (Math2d.isPointInTriangle(pixelCoordinate.substract(this.end), p0, p1, p2)) return true
    }
    // 判断是否在文字上
    if (this.text) {
      const { graphCanvasCtx } = canvas
      graphCanvasCtx.save()
      graphCanvasCtx.font = '14px sans-serif'
      const textRectWidth = graphCanvasCtx.measureText(this.text).width
      const sourceToTarget = this.end.substract(this.begin)
      const lineNormal = sourceToTarget.normalize()
      const lineCenter = this.begin.clone().add(sourceToTarget.scale(1 / 2))
      const perpendicular = sourceToTarget.perpendicular().normalize()
      graphCanvasCtx.restore()
      if (this.rotate < Math.PI / 2 && this.rotate >= -Math.PI / 2) {
        const p0 = lineCenter.clone().substract(lineNormal.scale(textRectWidth / 2)).add(perpendicular.scale(17))
        const p1 = p0.clone().add(lineNormal.scale(textRectWidth))
        const p2 = p1.substract(perpendicular.scale(14))
        const p3 = p2.substract(lineNormal.scale(textRectWidth))
        if (Math2d.isPointInPolygon(pixelCoordinate, [p0, p1, p2, p3])) return true
      } else {
        const p0 = lineCenter.clone().substract(lineNormal.scale(textRectWidth / 2)).add(perpendicular.scale(-17))
        const p1 = p0.clone().add(lineNormal.scale(textRectWidth))
        const p2 = p1.substract(perpendicular.scale(-14))
        const p3 = p2.substract(lineNormal.scale(textRectWidth))
        if (Math2d.isPointInPolygon(pixelCoordinate, [p0, p1, p2, p3])) return true
      }
    }
    return false
  }
  render() {
    if (!this.canvas) return
    const { graphCanvasCtx } = this.canvas
    const { sourceNode, targetNode } = this
    // 两端节点至少有一个是可见的
    if (sourceNode.visible || targetNode.visible) {

      const sourceCenter = sourceNode.centerPoint
      const targetCenter = targetNode.centerPoint
      const beginToEnd: [Vector2d, Vector2d] = [sourceCenter, targetCenter]
      this.begin = sourceNode.shapeType === 'rect' ? intersectWithRect(beginToEnd, sourceNode.boundingRect) : intersectWithCircle(sourceCenter, (sourceNode as any).radius, targetCenter)
      if (!this.begin) return
      this.end = targetNode.shapeType === 'rect' ? intersectWithRect(beginToEnd, targetNode.boundingRect) : intersectWithCircle(targetCenter, (targetNode as any).radius, sourceCenter)
      if (!this.end) return

      const sourceToTarget = targetCenter.substract(sourceCenter)
      graphCanvasCtx.save()
      graphCanvasCtx.beginPath()
      // 画线
      graphCanvasCtx.moveTo(this.begin.x, this.begin.y)
      graphCanvasCtx.lineTo(this.end.x, this.end.y)
      graphCanvasCtx.strokeStyle = this.active ? '#e96160' : '#29c1f8'
      graphCanvasCtx.fillStyle = this.active ? '#e96160' : '#29c1f8'
      if/* 虚线 */ (this.dash) {
        graphCanvasCtx.setLineDash([4, 4])
      }
      graphCanvasCtx.stroke()
      this.rotate = sourceToTarget.xAxisAngle()
      if/* 文本 */ (this.text) {
        graphCanvasCtx.save()
        const lineCenter = sourceCenter.clone().add(sourceToTarget.scale(1 / 2))
        graphCanvasCtx.font = '14px sans-serif'
        graphCanvasCtx.textAlign = 'center'
        graphCanvasCtx.textBaseline = 'middle'
        graphCanvasCtx.translate(lineCenter.x, lineCenter.y)
        if (this.rotate < Math.PI / 2 && this.rotate >= -Math.PI / 2) {
          graphCanvasCtx.rotate(this.rotate)
        } else {
          graphCanvasCtx.rotate(this.rotate - Math.PI)
        }
        graphCanvasCtx.fillText(this.text, 0, -10)
        graphCanvasCtx.restore()
      }
      if/**箭头 */ (this.arrow) {
        graphCanvasCtx.beginPath()
        graphCanvasCtx.save()
        graphCanvasCtx.translate(this.end.x, this.end.y)
        graphCanvasCtx.rotate(this.rotate)
        graphCanvasCtx.moveTo(0, 0)
        graphCanvasCtx.lineTo(- 10, + 4)
        graphCanvasCtx.lineTo(- 10, - 4)
        graphCanvasCtx.closePath()
        graphCanvasCtx.fill()
        graphCanvasCtx.restore()
      }
      graphCanvasCtx.restore()
    }
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
  const line = point.substract(o)
  if (line.magnitude < radius) return undefined
  const angle = line.xAxisAngle()
  return o.add(new Vector2d(radius * Math.cos(angle), radius * Math.sin(angle)))
}

export default Line