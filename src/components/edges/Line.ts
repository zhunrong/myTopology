import Edge, { IEdgeOptions } from '../../graphics/core/Edge'
import Canvas from '../../graphics/Canvas'
import Math2d from '../../utils/math2d';
import Vector2d from '../../utils/vector2d';
export interface ILineOptions extends IEdgeOptions {
  // 是否虚线
  dash?: boolean
  // 显示文本
  text?: string
  // 显示箭头
  arrow?: boolean
}
export default class Line extends Edge {
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
    if (Math2d.isPointInLineSegment(pixelCoordinate, [this.sourceNode.joinPoint, this.targetNode.joinPoint], 0.1)) return true
    // 判断点是否在箭头上
    if (this.arrow && this.arrowStart) {
      const p0 = new Vector2d(0, 0).rotate(this.rotate)
      const p1 = new Vector2d(- 10, + 4).rotate(this.rotate)
      const p2 = new Vector2d(- 10, - 4).rotate(this.rotate)
      if (Math2d.isPointInTriangle(pixelCoordinate.substract(this.arrowStart), p0, p1, p2)) return true
    }
    // 判断是否在文字上
    if (this.text) {
      const { canvasContext } = canvas
      canvasContext.save()
      canvasContext.font = '14px sans-serif'
      canvasContext.textAlign = 'center'
      canvasContext.textBaseline = 'middle'
      const textRectWidth = canvasContext.measureText(this.text).width
      const sourceToTarget = this.targetNode.joinPoint.substract(this.sourceNode.joinPoint)
      const lineNormal = sourceToTarget.normalize()
      const lineCenter = this.sourceNode.joinPoint.add(sourceToTarget.scale(1 / 2))
      const perpendicular = sourceToTarget.perpendicular().normalize()
      canvasContext.restore()
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
  render(canvas: Canvas) {
    const { canvasContext } = canvas
    const { sourceNode, targetNode } = this
    // 两端节点都存在且至少有一个是可见的
    if (sourceNode && targetNode && (sourceNode.visible || targetNode.visible)) {
      const sourceToTarget = targetNode.joinPoint.substract(sourceNode.joinPoint)

      canvasContext.beginPath()
      // 画线
      canvasContext.moveTo(sourceNode.joinPoint.x, sourceNode.joinPoint.y)
      canvasContext.lineTo(targetNode.joinPoint.x, targetNode.joinPoint.y)
      canvasContext.strokeStyle = this.active ? 'red' : 'grey'
      canvasContext.fillStyle = this.active ? 'red' : 'grey'
      if/* 虚线 */ (this.dash) {
        canvasContext.setLineDash([4, 4])
      }
      canvasContext.stroke()
      this.rotate = sourceToTarget.xAxisAngle()
      if/* 文本 */ (this.text) {
        canvasContext.save()
        const lineCenter = sourceNode.joinPoint.add(sourceToTarget.scale(1 / 2))
        canvasContext.font = '14px sans-serif'
        canvasContext.textAlign = 'center'
        canvasContext.textBaseline = 'middle'
        canvasContext.translate(lineCenter.x, lineCenter.y)
        if (this.rotate < Math.PI / 2 && this.rotate >= -Math.PI / 2) {
          canvasContext.rotate(this.rotate)
        } else {
          canvasContext.rotate(this.rotate - Math.PI)
        }
        canvasContext.fillText(this.text, 0, -10)
        canvasContext.restore()
      }
      if/**箭头 */ (this.arrow) {
        // 计算箭头顶点位置
        const targetNodeVertexes = targetNode.vertexes
        for (let i = 0; i < targetNodeVertexes.length; i++) {
          const A = targetNodeVertexes[i]
          const B = i === targetNodeVertexes.length - 1 ? targetNodeVertexes[0] : targetNodeVertexes[i + 1]
          const r = Math2d.isIntersect([sourceNode.joinPoint, targetNode.joinPoint], [A, B])
          if (r) {
            this.arrowStart = Math2d.getLineIntersect([A, B], [sourceNode.joinPoint, targetNode.joinPoint])
            break
          }
        }
        if (!this.arrowStart) return
        // 画箭头
        canvasContext.beginPath()
        canvasContext.save()
        canvasContext.translate(this.arrowStart.x, this.arrowStart.y)
        canvasContext.rotate(this.rotate)
        canvasContext.moveTo(0, 0)
        canvasContext.lineTo(- 10, + 4)
        canvasContext.lineTo(- 10, - 4)
        canvasContext.closePath()
        canvasContext.fill()
        canvasContext.restore()
      }
    }
  }
}