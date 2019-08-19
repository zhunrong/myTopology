import Interaction from './Interaction'
import Canvas from '../core/Canvas'
import Node from '../graph/Node'
import Vector2d from '../utils/vector2d'
import Math2d from '../utils/math2d'
import selectInteraction from './selectInteraction'

class ResizeInteraction extends Interaction {
  activeNode: Node | undefined
  flag: boolean = false
  onInstall = (canvas: Canvas) => {
    // 显示交互画布
    canvas.topCanvasMount()
  }
  onUninstall = (canvas: Canvas) => {
    // 移除交互画布
    canvas.topCanvasUnmount()
  }

  onMouseUp = (canvas: Canvas) => {

  }

  onMouseDown = (canvas: Canvas) => {
    const index = this.getActiveAnchorIndex(canvas)
    if (index > -1) {

    } else {
      selectInteraction.onMouseDown(canvas)
    }
  }

  onMouseMove = (canvas: Canvas, e: Event) => {
    const index = this.getActiveAnchorIndex(canvas)
    let mouseCursor: string = 'default'
    if (index > -1) {
      switch (index) {
        case 0: // 西北
          mouseCursor = 'nwse-resize'
          break
        case 1: // 东北
          mouseCursor = 'nesw-resize'
          break
        case 2: // 东南
          mouseCursor = 'nwse-resize'
          break
        case 3: // 西南
          mouseCursor = 'nesw-resize'
          break
        case 4: // 北
          mouseCursor = 'ns-resize'
          break
        case 5: // 东
          mouseCursor = 'ew-resize'
          break
        case 6: // 南
          mouseCursor = 'ns-resize'
          break
        case 7: // 西
          mouseCursor = 'ew-resize'
          break
      }
    } else {

    }
    canvas.wrapper.style.cursor = mouseCursor
  }

  onUpdate = (canvas: Canvas) => {
    this.activeNode = canvas.getActiveNodes()[0]
    canvas.topCanvasCtx.clearRect(0, 0, canvas.viewWidth, canvas.viewHeight)
    if (this.activeNode) {
      const points: Vector2d[] = [...this.activeNode.boundingRect, ...this.activeNode.boundingJoinPoints]
      canvas.topCanvasCtx.save()
      canvas.topCanvasCtx.fillStyle = '#2D8CF5'
      canvas.topCanvasCtx.beginPath()
      points.forEach(point => {
        const canvasCoordinate = canvas.pixelToCanvasCoordinate(point)
        canvas.topCanvasCtx.rect(canvasCoordinate.x - 3, canvasCoordinate.y - 3, 6, 6)

        canvas.topCanvasCtx.fill()
      })
      canvas.topCanvasCtx.restore()
    }
  }

  getActiveAnchorIndex(canvas: Canvas) {
    if (!this.activeNode) return -1
    const points: Vector2d[] = [...this.activeNode.boundingRect, ...this.activeNode.boundingJoinPoints]
    let index: number = 0
    const anchor = points.find((point, i) => {
      const viewportCoordinate = canvas.pixelToViewportCoordinate(point)
      index = i
      return Math2d.isPointInRect(canvas.mousemovePosition, viewportCoordinate.substract(new Vector2d(3, 3)), 6, 6)
    })
    if (!anchor) return -1
    return index
  }
}

export const resizeInteraction = new ResizeInteraction()
export default resizeInteraction