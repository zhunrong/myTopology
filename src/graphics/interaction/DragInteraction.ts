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
  minDragDistance: number = 1
  moveNodes: Node[] = []
  mousedown: boolean = false
  // 记录上一次鼠标位置
  lastCoordinate: Vector2d = new Vector2d()

  onMouseDown = (canvas: Canvas) => {
    const activeNodes = canvas.getActiveNodes()
    if (activeNodes.length) {
      this.moveNodes = [...activeNodes]
    } else {
      this.moveNodes = [...canvas.rootNode.children]
    }
    this.mousedown = true

    this.lastCoordinate = canvas.mousedownPosition
  }
  onMouseMove = (canvas: Canvas) => {
    if (!this.mousedown) return
    const offset = canvas.mousemovePosition.substract(this.lastCoordinate)
    this.lastCoordinate = canvas.mousemovePosition
    if (offset.magnitude < this.minDragDistance) return
    const pixelOffset = offset.scale(1 / canvas.canvasScale)
    this.moveNodes.forEach(node => {
      node.translate(pixelOffset)
    })
    canvas.repaint = true
  }
  onMouseUp = (canvas: Canvas) => {
    this.moveNodes = []
    this.mousedown = false
  }
}

export const dragInteraction = new DragInteraction()
export default dragInteraction