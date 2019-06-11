import Interaction from './Interaction'
import Canvas from '../Canvas'
import DomNode from '../core/DomNode'
import CanvasNode from '../core/CanvasNode'
import Vector2d from '../../utils/vector2d'
/**
 * 可拖拽单个元素或整个画布
 */
class DragInteraction extends Interaction {
  cachePositions: Vector2d[] = []
  moveNodes: (DomNode | CanvasNode)[] = []
  onMouseDown = (canvas: Canvas) => {
    const nodes = [...canvas.domNodes, ...canvas.canvasNodes]
    let activeNode: DomNode | CanvasNode | undefined = nodes.find(node => node.isPointIn(canvas))
    if (activeNode) {
      this.moveNodes = [activeNode]
    } else {
      this.moveNodes = nodes
    }
    this.cachePositions = this.moveNodes.map(node => node.position)
  }
  onMouseMove = (canvas: Canvas) => {
    this.moveNodes.forEach((node, index) => {
      node.position = this.cachePositions[index].add(canvas.mousemovePosition.substract(canvas.mousedownPosition).scale(1 / canvas.canvasScale))
      node.isUpdate = true
    })
  }
  onMouseUp = () => {
    this.moveNodes = []
    this.cachePositions = []
  }
}

export default new DragInteraction()