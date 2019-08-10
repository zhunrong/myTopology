import Interaction from './Interaction'
import { DomNode } from '../graph/DomNode'
import { Canvas } from '../core/Canvas'
import { CanvasNode } from '../graph/CanvasNode'
import { Vector2d } from '../utils/vector2d'
/**
 * 拖动整个画布
 */
class MoveCanvasInteraction extends Interaction {
  // 最小拖动距离
  minDragDistance: number = 5
  cachePositions: Vector2d[] = []
  moveNodes: (DomNode | CanvasNode)[] = []
  mouseDown: boolean = false
  move: boolean = false
  onMouseDown = (canvas: Canvas) => {
    this.mouseDown = true
    this.moveNodes = canvas.rootNode.getDescendantBF() as (DomNode | CanvasNode)[]
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
  onMouseUp = (canvas:Canvas) => {
    this.moveNodes = []
    this.cachePositions = []
    this.mouseDown = false
    if(this.move){
      canvas.eventEmitter.emit('interaction:canvasMoveEnd')
    }
    this.move = false
  }
}

export const moveCanvasInteraction = new MoveCanvasInteraction()
export default moveCanvasInteraction