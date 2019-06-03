import Node from '../application/node'
import { globalEvent } from './eventEmitter'
interface IOptions {
  targetId: string
  sourceId: string
}
export default class Edge {
  targetId: string
  sourceId: string
  targetNode: Node | null = null
  sourceNode: Node | null = null
  constructor(options: IOptions) {
    this.targetId = options.targetId
    this.sourceId = options.sourceId
    globalEvent.emit('register:edge', this)
  }
  render(canvasCtx: CanvasRenderingContext2D) {
    const { sourceNode, targetNode } = this
    if (sourceNode && targetNode) {
      canvasCtx.beginPath()
      // 画线
      canvasCtx.moveTo(sourceNode.position.x, sourceNode.position.y)
      canvasCtx.lineTo(targetNode.position.x, targetNode.position.y)
      canvasCtx.stroke()
      // 画箭头
      const sourceToTarget = targetNode.position.substract(sourceNode.position)
      const arrowStart = targetNode.position.substract(sourceToTarget.normalize().scale(30))
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