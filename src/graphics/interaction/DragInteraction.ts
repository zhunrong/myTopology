import Interaction from './Interaction'
import Canvas from '../core/Canvas'
import Node from '../graph/Node'
import Vector2d from '../utils/vector2d'

/**
 * 可拖拽图元或整个画布
 * 前置依赖：selectInteraction
 */
export class DragInteraction extends Interaction {
  // 最小拖动距离
  minDragDistance: number = 3
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

    this.lastCoordinate.copy(canvas.mousedownPosition)
  }
  onMouseMove = (canvas: Canvas) => {
    if (!this.mousedown) return
    // 移动距离太小，认为是误操作，过滤掉
    if (Vector2d.copy(canvas.mousemovePosition).substract(canvas.mousedownPosition).magnitude < this.minDragDistance) return
    const offset = Vector2d.copy(canvas.mousemovePosition).substract(this.lastCoordinate)
    this.lastCoordinate.copy(canvas.mousemovePosition)
    const pixelOffset = offset.scale(1 / canvas.canvasScale)
    this.moveNodes.forEach(node => {
      node.translate(pixelOffset)
    })
    canvas.repaint = true
  }
  onMouseUp = (canvas: Canvas) => {
    if (this.moveNodes.length === 1) {
      const activeNode = this.moveNodes[0]
      let wrap = false
      canvas.rootNode.getDescendantDF(node => {
        if (!node.visible) return
        if (node === activeNode) return
        if (!node.isGroup) return
        if (activeNode.hasDescendant(node)) return
        if (activeNode.isWrappedInRect(node.boundingRect)) {
          node.addChild(activeNode)
          return wrap = true
        }
      })
      if (!wrap) {
        canvas.rootNode.addChild(activeNode)
      }
    }
    this.moveNodes = []
    this.mousedown = false
  }
}

export const dragInteraction = new DragInteraction()
export default dragInteraction