import Node from './Circle'
import AEdge from './AEdge'
import { globalEvent } from '../events/eventEmitter'
interface IOptions {
  targetId: string
  sourceId: string
  targetNode?: Node
  sourceNode?: Node
}
export default class Line extends AEdge {
  targetId: string
  sourceId: string
  targetNode: Node | undefined
  sourceNode: Node | undefined
  constructor(options: IOptions) {
    super()
    this.targetId = options.targetId
    this.sourceId = options.sourceId
    this.targetNode = options.targetNode
    this.sourceNode = options.sourceNode
    // globalEvent.emit('register:edge', this)
  }
  hitTest() {
    return false
  }
  render(parentNode: HTMLElement, canvasCtx: CanvasRenderingContext2D) {
    const { sourceNode, targetNode } = this
    if (sourceNode && targetNode) {
      canvasCtx.beginPath()
      // 画线
      canvasCtx.moveTo(sourceNode.joinPoint.x, sourceNode.joinPoint.y)
      canvasCtx.lineTo(targetNode.joinPoint.x, targetNode.joinPoint.y)
      canvasCtx.stroke()
      // 画箭头
      const sourceToTarget = targetNode.joinPoint.substract(sourceNode.joinPoint)
      const arrowStart = targetNode.joinPoint.substract(sourceToTarget.normalize().scale(25))
      canvasCtx.beginPath()
      canvasCtx.save()
      const rotate = sourceToTarget.xAxisAngle()
      canvasCtx.translate(arrowStart.x, arrowStart.y)
      canvasCtx.rotate(rotate)
      canvasCtx.moveTo(0, 0)
      canvasCtx.lineTo(- 8, + 3)
      canvasCtx.lineTo(- 8, - 3)
      canvasCtx.closePath()
      canvasCtx.fillStyle = 'black'
      canvasCtx.fill()
      canvasCtx.restore()
    }
  }
}