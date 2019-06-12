import Edge, { IEdgeOptions } from '../../graphics/core/Edge'
import Canvas from '../../graphics/Canvas'
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
      canvasContext.beginPath()
      // 画线
      canvasContext.moveTo(sourceNode.joinPoint.x, sourceNode.joinPoint.y)
      canvasContext.lineTo(targetNode.joinPoint.x, targetNode.joinPoint.y)
      canvasContext.stroke()
      // 画箭头
      const sourceToTarget = targetNode.joinPoint.substract(sourceNode.joinPoint)
      const arrowStart = targetNode.joinPoint.substract(sourceToTarget.normalize().scale(50))
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