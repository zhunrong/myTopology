import Interaction from './Interaction'
import Canvas from '../core/Canvas'
import Vector2d from '../utils/Vector2d'
import Node from '../graph/Node'

/**
 * 框选交互
 */
export class AreaPickInteraction extends Interaction {
  minDragDistance: number = 5
  mouseDown: boolean = false
  activeNodes: Node[] = []
  dragMove: boolean = false
  lastCoordinate: Vector2d = new Vector2d()
  onInstall = (canvas: Canvas) => {
    // 显示交互画布
    canvas.topCanvasMount()
  }
  onUninstall = (canvas: Canvas) => {
    // 移除交互画布
    canvas.topCanvasCtx.clearRect(0, 0, canvas.viewWidth, canvas.viewHeight)
    canvas.topCanvasUnmount()
  }
  onMouseDown = (canvas: Canvas, e: Event) => {
    // const { button } = e as MouseEvent
    // if (button !== 0) return
    this.dragMove = false

    this.lastCoordinate.copy(canvas.mousedownPosition)
    const activeNodes = canvas.getActiveNodes()

    if /* 选中已激活元素 */ (activeNodes.length && activeNodes.find(node => node.visible && node.isPointIn())) {
      this.dragMove = true
      this.activeNodes = activeNodes
    } else {
      this.activeNodes = []
      canvas.rootNode.getDescendantDF(node => {
        node.isUpdate = true
        if (!this.activeNodes.length && node.visible && node.isPointIn()) {
          this.activeNodes.push(node)
          this.dragMove = true
          node.active = true
        } else {
          node.active = false
        }
      })
      canvas.repaint = true
    }


    this.mouseDown = true
    canvas.topCanvasCtx.fillStyle = 'rgba(41, 193, 248, 0.3)'
    canvas.topCanvasCtx.strokeStyle = 'rgb(41, 193, 248)'
  }
  onMouseMove = (canvas: Canvas, e: Event) => {
    if (!this.mouseDown) return
    if (this.dragMove) {
      const offset = Vector2d.copy(canvas.mousemovePosition).substract(this.lastCoordinate)
      this.lastCoordinate.copy(canvas.mousemovePosition)
      const pixelOffset = offset.scale(1 / canvas.canvasScale)
      this.activeNodes.forEach(node => {
        node.translate(pixelOffset)
      })
      canvas.repaint = true
    } else {
      const { mousedownPosition, mousemovePosition, topCanvasCtx, viewWidth, viewHeight } = canvas
      const offset = Vector2d.copy(mousemovePosition).substract(mousedownPosition)
      if (offset.magnitude < this.minDragDistance) return
      const p0 = canvas.viewportToCanvasCoordinate(mousedownPosition)
      const p2 = canvas.viewportToCanvasCoordinate(mousemovePosition)
      const p1 = new Vector2d(p0.x, p2.y)
      const p3 = new Vector2d(p2.x, p0.y)
      // 绘制拖选框
      topCanvasCtx.clearRect(0, 0, viewWidth, viewHeight)
      topCanvasCtx.beginPath()
      topCanvasCtx.moveTo(p0.x, p0.y)
      topCanvasCtx.lineTo(p1.x, p1.y)
      topCanvasCtx.lineTo(p2.x, p2.y)
      topCanvasCtx.lineTo(p3.x, p3.y)
      topCanvasCtx.closePath()
      topCanvasCtx.fill()
      topCanvasCtx.stroke()

      let v0!: Vector2d
      let v1!: Vector2d
      let v2!: Vector2d
      let v3!: Vector2d

      if (mousedownPosition.x > mousemovePosition.x) {
        if (mousedownPosition.y > mousemovePosition.y) {
          v0 = canvas.viewportToPixelCoordinate(mousemovePosition)
          v2 = canvas.viewportToPixelCoordinate(mousedownPosition)
          v1 = new Vector2d(v2.x, v0.y)
          v3 = new Vector2d(v0.x, v2.y)
        } else {
          v1 = canvas.viewportToPixelCoordinate(mousedownPosition)
          v3 = canvas.viewportToPixelCoordinate(mousemovePosition)
          v0 = new Vector2d(v3.x, v1.y)
          v2 = new Vector2d(v1.x, v3.y)
        }
      } else {
        if (mousedownPosition.y > mousemovePosition.y) {
          v1 = canvas.viewportToPixelCoordinate(mousemovePosition)
          v3 = canvas.viewportToPixelCoordinate(mousedownPosition)
          v0 = new Vector2d(v3.x, v1.y)
          v2 = new Vector2d(v1.x, v3.y)
        } else {
          v0 = canvas.viewportToPixelCoordinate(mousedownPosition)
          v2 = canvas.viewportToPixelCoordinate(mousemovePosition)
          v1 = new Vector2d(v2.x, v0.y)
          v3 = new Vector2d(v0.x, v2.y)
        }
      }

      const rect: Vector2d[] = [v0, v1, v2, v3]
      canvas.rootNode.getDescendantBF(node => {
        const status = node.active
        if (node.hasActiveAncestor()) {
          node.active = false
        } else if (node.isWrappedInRect(rect)) {
          node.active = true
        } else {
          node.active = false
        }
        if (status !== node.active) {
          node.isUpdate = true
        }
      })
      canvas.repaint = true
    }

  }
  onMouseUp = (canvas: Canvas, e: Event) => {
    if (!this.mouseDown) return
    this.dragMove = false
    const { topCanvasCtx, viewWidth, viewHeight } = canvas
    this.mouseDown = false
    topCanvasCtx.clearRect(0, 0, viewWidth, viewHeight)
  }
  handleEvent(canvas: Canvas, event: Event) {
    switch (event.type) {
      case 'mousedown':
        this.onMouseDown(canvas, event)
        break
      case 'mousemove':
        this.onMouseMove(canvas, event)
        break
      case 'mouseup':
        this.onMouseUp(canvas, event)
        break
    }
  }
}
export const areaPickInteraction = new AreaPickInteraction()
export default AreaPickInteraction