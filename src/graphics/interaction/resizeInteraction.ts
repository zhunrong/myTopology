import Interaction from './Interaction'
import Canvas from '../core/Canvas'
import Node from '../graph/Node'
import Vector2d from '../utils/vector2d'
import Math2d from '../utils/math2d'
import selectInteraction from './selectInteraction'
import dragInteraction from './dragInteraction'
import RectDomNode from '../node/RectDomNode'

class ResizeInteraction extends Interaction {
  activeNode: Node | undefined
  flag: boolean = false
  activeAnchorIndex: number = -1
  onInstall = (canvas: Canvas) => {
    // 显示交互画布
    canvas.topCanvasMount()
  }
  onUninstall = (canvas: Canvas) => {
    // 移除交互画布
    canvas.topCanvasCtx.clearRect(0, 0, canvas.viewWidth, canvas.viewHeight)
    canvas.topCanvasUnmount()
  }

  onMouseUp = (canvas: Canvas) => {
    this.activeAnchorIndex = -1
    dragInteraction.onMouseUp()
  }

  onMouseDown = (canvas: Canvas) => {
    this.activeAnchorIndex = this.getActiveAnchorIndex(canvas)
    if (this.activeAnchorIndex === -1) {
      selectInteraction.onMouseDown(canvas)
      dragInteraction.onMouseDown(canvas)
      this.activeNode = canvas.getActiveNodes()[0]
    }
  }

  onMouseMove = (canvas: Canvas, e: Event) => {
    const activeNode = this.activeNode as RectDomNode
    if (this.activeAnchorIndex > -1 && activeNode) {
      const event = e as MouseEvent
      const coordinate = canvas.viewportToPixelCoordinate(new Vector2d(event.clientX, event.clientY))
      const nodeBoundingRect = activeNode.boundingRect
      activeNode.isUpdate = true
      canvas.repaint = true

      let currentWidth: number = activeNode.width
      let currentHeight: number = activeNode.height
      switch (this.activeAnchorIndex) {
        case 0: // 西北
          currentWidth = nodeBoundingRect[2].x - coordinate.x
          currentHeight = nodeBoundingRect[2].y - coordinate.y
          if (currentWidth >= activeNode.minWidth) {
            activeNode.position.x = coordinate.x
            activeNode.width = currentWidth
          }
          if (currentHeight >= activeNode.minHeight) {
            activeNode.position.y = coordinate.y
            activeNode.height = currentHeight
          }
          break
        case 1: // 东北
          currentWidth = coordinate.x - nodeBoundingRect[3].x
          currentHeight = nodeBoundingRect[3].y - coordinate.y
          if (currentWidth >= activeNode.minWidth) {
            activeNode.width = currentWidth
          }
          if (currentHeight >= activeNode.minHeight) {
            activeNode.position.y = coordinate.y
            activeNode.height = currentHeight
          }
          break
        case 2: // 东南
          currentWidth = coordinate.x - nodeBoundingRect[0].x
          currentHeight = coordinate.y - nodeBoundingRect[0].y
          if (currentWidth >= activeNode.minWidth) {
            activeNode.width = currentWidth
          }
          if (currentHeight >= activeNode.minHeight) {
            activeNode.height = currentHeight
          }
          break
        case 3: // 西南
          currentWidth = nodeBoundingRect[1].x - coordinate.x
          currentHeight = coordinate.y - nodeBoundingRect[1].y
          if (currentWidth >= activeNode.minWidth) {
            activeNode.position.x = coordinate.x
            activeNode.width = currentWidth
          }
          if (currentHeight >= activeNode.minHeight) {
            activeNode.height = currentHeight
          }
          break
        case 4: // 北
          currentHeight = nodeBoundingRect[2].y - coordinate.y
          if (currentHeight >= activeNode.minHeight) {
            activeNode.position.y = coordinate.y
            activeNode.height = currentHeight
          }
          break
        case 5: // 东
          currentWidth = coordinate.x - nodeBoundingRect[0].x
          if (currentWidth >= activeNode.minWidth) {
            activeNode.width = currentWidth
          }
          break
        case 6: // 南
          currentHeight = coordinate.y - nodeBoundingRect[0].y
          if (currentHeight >= activeNode.minHeight) {
            activeNode.height = currentHeight
          }
          break
        case 7: // 西
          currentWidth = nodeBoundingRect[2].x - coordinate.x
          if (currentWidth >= activeNode.minWidth) {
            activeNode.position.x = coordinate.x
            activeNode.width = currentWidth
          }
          break
      }
      activeNode.render()
    } else {
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
        dragInteraction.onMouseMove(canvas)
      }
      canvas.wrapper.style.cursor = mouseCursor
    }
  }

  onUpdate = (canvas: Canvas) => {
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