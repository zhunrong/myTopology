import Edge, { IEdgeOptions } from '../../graphics/core/Edge'
import Canvas from '../../graphics/Canvas'
import Math2d from '../../utils/math2d';
import Vector2d from '../../utils/vector2d';
export interface ILineOptions extends IEdgeOptions { }
export default class Line extends Edge {
  constructor(options: ILineOptions) {
    super(options)
  }
  isInRect() {
    return true
  }
  isPointIn() {
    return false
  }
  render(canvas: Canvas) {
    const { canvasContext } = canvas
    const { sourceNode, targetNode } = this
    if (sourceNode && targetNode) {

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
      canvasContext.fillStyle = 'black'
      canvasContext.fill()
      canvasContext.restore()
    }
  }
}