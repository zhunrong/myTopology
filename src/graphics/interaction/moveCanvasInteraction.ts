import Interaction from './Interaction'
import { Canvas } from '../core/Canvas'
import Node from '../graph/Node'
import { Vector2d } from '../utils/vector2d'
/**
 * 拖动整个画布
 */
class MoveCanvasInteraction extends Interaction {
  // 最小拖动距离
  minDragDistance: number = 5
  cachePositions: Vector2d[] = []
  moveNodes: Node[] = []
  mouseDown: boolean = false
  move: boolean = false
  onMouseDown = (canvas: Canvas) => {
    this.mouseDown = true
    this.cachePositions = []
    this.moveNodes = canvas.rootNode.getDescendantBF()
    this.cachePositions = this.moveNodes.map(node => node.position)
  }
  onMouseMove = (canvas: Canvas) => {
    if (!this.mouseDown) return
    const offset = canvas.mousemovePosition.substract(canvas.mousedownPosition)
    if (offset.magnitude < this.minDragDistance) return
    this.move = true
    const pixelOffset = offset.scale(1 / canvas.canvasScale)
    this.moveNodes.forEach((node, index) => {
      node.position = this.cachePositions[index].add(pixelOffset)
      node.isUpdate = true
    })
    canvas.repaint = true
  }
  onMouseUp = (canvas: Canvas) => {
    this.moveNodes = []
    this.cachePositions = []
    this.mouseDown = false
    if (this.move) {
      canvas.eventEmitter.emit('interaction:canvasMoveEnd')
      this.move = false
    }
  }
}

export const moveCanvasInteraction = new MoveCanvasInteraction()
export default moveCanvasInteraction