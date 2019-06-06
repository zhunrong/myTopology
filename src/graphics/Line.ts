import ANode from './ANode'
import AEdge, { IAEdgeOptions } from './AEdge'
import Canvas from './Canvas'
interface IOptions extends IAEdgeOptions {
  targetId: string
  sourceId: string
  targetNode?: ANode
  sourceNode?: ANode
}
export default class Line extends AEdge {
  readonly renderType: string = 'canvas'
  targetId: string
  sourceId: string
  targetNode: ANode | undefined
  sourceNode: ANode | undefined
  constructor(options: IOptions) {
    super(options)
    this.targetId = options.targetId
    this.sourceId = options.sourceId
    this.targetNode = options.targetNode
    this.sourceNode = options.sourceNode
    // globalEvent.emit('register:edge', this)
  }
  hitTest(canvas: Canvas) {
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
      const arrowStart = targetNode.joinPoint.substract(sourceToTarget.normalize().scale(25))
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