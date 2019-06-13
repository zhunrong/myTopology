import Edge, { IEdgeOptions } from '../../graphics/core/Edge'
import Canvas from '../../graphics/Canvas'
import Math2d from '../../utils/math2d';
import Vector2d from '../../utils/vector2d';
export interface ILineOptions extends IEdgeOptions { }
export default class Line extends Edge {
  // 缓存canvas(离屏canvas)
  constructor(options: ILineOptions) {
    super(options)
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
          // 法向量
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
      canvasContext.stroke()
      // 画箭头
      canvasContext.beginPath()
      canvasContext.save()
      const rotate = sourceToTarget.xAxisAngle()
      canvasContext.translate(arrowStart.x, arrowStart.y)
      canvasContext.rotate(rotate)
      canvasContext.moveTo(0, 0)
      canvasContext.lineTo(- 8, + 3)
      canvasContext.lineTo(- 8, - 3)
      canvasContext.closePath()
      canvasContext.fillStyle = this.active ? 'red' : 'grey'
      canvasContext.fill()
      canvasContext.restore()
    }
  }
}