import Interaction from './Interaction'
import Canvas from '../core/Canvas'
import Node from '../graph/Node'
import Vector2d from '../utils/vector2d'
/**
 * 可拖拽图元或整个画布
 * 前置依赖：selectInteraction
 */
class DragInteraction extends Interaction {
  // 最小拖动距离
  minDragDistance: number = 5
  cachePositions: Vector2d[] = []
  moveNodes: Node[] = []
  mousedown: boolean = false
  onMouseDown = (canvas: Canvas) => {
    if (canvas.activeNodes.length) {
      this.moveNodes = [...canvas.activeNodes]
    } else {
      this.moveNodes = [...canvas.domNodes, ...canvas.canvasNodes]
    }
    this.cachePositions = this.moveNodes.map(node => node.position)
    this.mousedown = true
  }
  onMouseMove = (canvas: Canvas) => {
    if (!this.mousedown) return
    const offset = canvas.mousemovePosition.substract(canvas.mousedownPosition)
    if (offset.magnitude < this.minDragDistance) return
    const pixelOffset = offset.scale(1 / canvas.canvasScale)
    this.moveNodes.forEach((node, index) => {
      node.position = this.cachePositions[index].add(pixelOffset)
      node.isUpdate = true
    })
    canvas.repaint = true
  }
  onMouseUp = () => {
    this.moveNodes = []
    this.cachePositions = []
    this.mousedown = false
  }
}

export const dragInteraction = new DragInteraction()
export default dragInteraction