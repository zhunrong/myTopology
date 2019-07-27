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
  arrowStart: Vector2d | undefined
  rotate: number = 0
  // 缓存canvas(离屏canvas)
  constructor(options: ILineOptions) {
    super(options)
    this.dash = options.dash || false
    this.text = options.text || ''
    this.arrow = options.arrow || false
  }
  isInRect() {
    return true
  }
  isPointIn(canvas: Canvas) {
    if (!canvas.nativeEvent) return false
    if (!this.sourceNode || !this.targetNode) return false
    const event = canvas.nativeEvent as MouseEvent
    const viewCoordinate = new Vector2d(event.clientX, event.clientY)
    const pixelCoordinate = canvas.viewPortTopixelCoordinate(viewCoordinate)
    // 判断点是否在线上
    if (Math2d.isPointInLineSegment(pixelCoordinate, [this.sourceNode.centerPoint, this.targetNode.centerPoint], 0.1)) return true
    // 判断点是否在箭头上
    if (this.arrow && this.arrowStart) {
      const p0 = new Vector2d(0, 0).rotate(this.rotate)
      const p1 = new Vector2d(- 10, + 4).rotate(this.rotate)
      const p2 = new Vector2d(- 10, - 4).rotate(this.rotate)
      if (Math2d.isPointInTriangle(pixelCoordinate.substract(this.arrowStart), p0, p1, p2)) return true
    }
    // 判断是否在文字上
    if (this.text) {
      const { graphCanvasCtx } = canvas
      graphCanvasCtx.save()
      graphCanvasCtx.font = '14px sans-serif'
      // graphCanvasCtx.textAlign = 'center'
      // graphCanvasCtx.textBaseline = 'middle'
      const textRectWidth = graphCanvasCtx.measureText(this.text).width
      const sourceToTarget = this.targetNode.centerPoint.substract(this.sourceNode.centerPoint)
      const lineNormal = sourceToTarget.normalize()
      const lineCenter = this.sourceNode.centerPoint.add(sourceToTarget.scale(1 / 2))
      const perpendicular = sourceToTarget.perpendicular().normalize()
      graphCanvasCtx.restore()
      if (this.rotate < Math.PI / 2 && this.rotate >= -Math.PI / 2) {
        const p0 = lineCenter.substract(lineNormal.scale(textRectWidth / 2)).add(perpendicular.scale(17))
        const p1 = p0.add(lineNormal.scale(textRectWidth))
        const p2 = p1.substract(perpendicular.scale(14))
        const p3 = p2.substract(lineNormal.scale(textRectWidth))
        if (Math2d.isPointInPolygon(pixelCoordinate, [p0, p1, p2, p3])) return true
      } else {
        const p0 = lineCenter.substract(lineNormal.scale(textRectWidth / 2)).add(perpendicular.scale(-17))
        const p1 = p0.add(lineNormal.scale(textRectWidth))
        const p2 = p1.substract(perpendicular.scale(-14))
        const p3 = p2.substract(lineNormal.scale(textRectWidth))
        if (Math2d.isPointInPolygon(pixelCoordinate, [p0, p1, p2, p3])) return true
      }
    }
    return false
  }
  render() {
    const { graphCanvasCtx } = this.canvas
    const { sourceNode, targetNode } = this
    // 两端节点都存在且至少有一个是可见的
    if (sourceNode && targetNode && (sourceNode.visible || targetNode.visible)) {
      const sourceToTarget = targetNode.centerPoint.substract(sourceNode.centerPoint)

      graphCanvasCtx.beginPath()
      // 画线
      graphCanvasCtx.moveTo(sourceNode.centerPoint.x, sourceNode.centerPoint.y)
      graphCanvasCtx.lineTo(targetNode.centerPoint.x, targetNode.centerPoint.y)
      graphCanvasCtx.strokeStyle = this.active ? '#e96160' : '#29c1f8'
      graphCanvasCtx.fillStyle = this.active ? '#e96160' : '#29c1f8'
      if/* 虚线 */ (this.dash) {
        graphCanvasCtx.setLineDash([4, 4])
      }
      graphCanvasCtx.stroke()
      this.rotate = sourceToTarget.xAxisAngle()
      if/* 文本 */ (this.text) {
        graphCanvasCtx.save()
        const lineCenter = sourceNode.centerPoint.add(sourceToTarget.scale(1 / 2))
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
        // 计算箭头顶点位置
        const targetNodeVertexes = targetNode.vertexes
        for (let i = 0; i < targetNodeVertexes.length; i++) {
          const A = targetNodeVertexes[i]
          const B = i === targetNodeVertexes.length - 1 ? targetNodeVertexes[0] : targetNodeVertexes[i + 1]
          const r = Math2d.isIntersect([sourceNode.centerPoint, targetNode.centerPoint], [A, B])
          if (r) {
            this.arrowStart = Math2d.getLineIntersect([A, B], [sourceNode.centerPoint, targetNode.centerPoint])
            break
          }
        }
        if (!this.arrowStart) return
        // 画箭头
        graphCanvasCtx.beginPath()
        graphCanvasCtx.save()
        graphCanvasCtx.translate(this.arrowStart.x, this.arrowStart.y)
        graphCanvasCtx.rotate(this.rotate)
        graphCanvasCtx.moveTo(0, 0)
        graphCanvasCtx.lineTo(- 10, + 4)
        graphCanvasCtx.lineTo(- 10, - 4)
        graphCanvasCtx.closePath()
        graphCanvasCtx.fill()
        graphCanvasCtx.restore()
      }
    }
  }
}

export default Line