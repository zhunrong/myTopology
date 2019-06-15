import Interaction from './Interaction'
import { CanvasNode, Vector2d, Canvas, DomNode } from '../index'
/**
 * 拖动整个画布
 */
class MoveCanvasInteraction extends Interaction {
  cachePositions: Vector2d[] = []
  moveNodes: (DomNode | CanvasNode)[] = []
  onMouseDown = (canvas: Canvas) => {
    const nodes = [...canvas.domNodes, ...canvas.canvasNodes]
    this.moveNodes = nodes
    this.cachePositions = this.moveNodes.map(node => node.position)
  }
  onMouseMove = (canvas: Canvas) => {
    this.moveNodes.forEach((node, index) => {
      node.position = this.cachePositions[index].add(canvas.mousemovePosition.substract(canvas.mousedownPosition).scale(1 / canvas.canvasScale))
      node.isUpdate = true
    })
    canvas.repaint = true
  }
  onMouseUp = () => {
    this.moveNodes = []
    this.cachePositions = []
  }
}

export const moveCanvasInteraction = new MoveCanvasInteraction()
export default moveCanvasInteraction