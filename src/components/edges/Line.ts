import Edge, { IEdgeOptions } from '../../graphics/core/Edge'
import Canvas from '../../graphics/Canvas'
import Math2d from '../../utils/math2d';
import Vector2d from '../../utils/vector2d';
export interface ILineOptions extends IEdgeOptions {
  // 是否虚线
  dash?: boolean
  text?: string
}
export default class Line extends Edge {
  dash: boolean
  text: string
  // 缓存canvas(离屏canvas)
  constructor(options: ILineOptions) {
    super(options)
    this.dash = options.dash || false
    this.text = options.text || 'edge'
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
    return Math2d.isPointInLineSegment(pixelCoordinate, [this.sourceNode.joinPoint, this.targetNode.joinPoint])
    // return false
  }
  render(canvas: Canvas) {
    const { canvasContext } = canvas
    const { sourceNode, targetNode } = this
    // 两端节点都存在且至少有一个是可见的
    if (sourceNode && targetNode && (sourceNode.visible || targetNode.visible)) {
      // 计算箭头顶点位置
      const sourceToTarget = targetNode.joinPoint.substract(sourceNode.joinPoint)
      const targetNodeVertexes = targetNode.vertexes
      let arrowStart: Vector2d | undefined
      for (let i = 0; i < targetNodeVertexes.length; i++) {
        const A = targetNodeVertexes[i]
        const B = i === targetNodeVertexes.length - 1 ? targetNodeVertexes[0] : targetNodeVertexes[i + 1]
        const r = Math2d.isIntersect([sourceNode.joinPoint, targetNode.joinPoint], [A, B])
        if (r) {
          arrowStart = Math2d.getLineIntersect([A, B], [sourceNode.joinPoint, targetNode.joinPoint])
          break
        }
      }
      if (!arrowStart) return
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
      const rotate = sourceToTarget.xAxisAngle()
      if/* 文本 */ (this.text) {
        canvasContext.save()
        const lineCenter = sourceNode.joinPoint.add(sourceToTarget.scale(1 / 2))
        canvasContext.font = '14px sans-serif'
        canvasContext.textAlign = 'center'
        canvasContext.textBaseline = 'middle'
        canvasContext.translate(lineCenter.x, lineCenter.y)
        if (rotate < Math.PI / 2 && rotate >= -Math.PI / 2) {
          canvasContext.rotate(rotate)
        } else {
          canvasContext.rotate(rotate - Math.PI)
        }
        canvasContext.fillText(this.text, 0, -10)
        canvasContext.restore()
      }
      // 画箭头
      canvasContext.beginPath()
      canvasContext.save()
      canvasContext.translate(arrowStart.x, arrowStart.y)
      canvasContext.rotate(rotate)
      canvasContext.moveTo(0, 0)
      canvasContext.lineTo(- 8, + 3)
      canvasContext.lineTo(- 8, - 3)
      canvasContext.closePath()
      canvasContext.fill()
      canvasContext.restore()
    }
  }
}