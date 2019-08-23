import Interaction from './Interaction'
import { Canvas } from '../core/Canvas'
import Node from '../graph/Node'
import { Vector2d } from '../utils/vector2d'

let mousemovePositionCopy = new Vector2d()
/**
 * 拖动整个画布
 */
class MoveCanvasInteraction extends Interaction {
  // 最小拖动距离
  minDragDistance: number = 1
  moveNodes: Node[] = []
  mouseDown: boolean = false
  move: boolean = false
  lastCoordinate: Vector2d = new Vector2d()
  onMouseDown = (canvas: Canvas) => {
    this.mouseDown = true
    this.moveNodes = [...canvas.rootNode.children]
    this.lastCoordinate = canvas.mousedownPosition
  }
  onMouseMove = (canvas: Canvas) => {
    if (!this.mouseDown) return
    mousemovePositionCopy.copy(canvas.mousemovePosition)
    const offset = mousemovePositionCopy.substract(this.lastCoordinate)
    this.lastCoordinate = canvas.mousemovePosition
    if (offset.magnitude < this.minDragDistance) return
    this.move = true
    const pixelOffset = offset.scale(1 / canvas.canvasScale)
    this.moveNodes.forEach(node => {
      node.translate(pixelOffset)
    })
    canvas.repaint = true
  }
  onMouseUp = (canvas: Canvas) => {
    this.moveNodes = []
    this.mouseDown = false
    if (this.move) {
      canvas.eventEmitter.emit('interaction:canvasMoveEnd')
      this.move = false
    }
  }
}

export const moveCanvasInteraction = new MoveCanvasInteraction()
export default moveCanvasInteraction