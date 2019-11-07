import Interaction from './Interaction'
import Canvas from '../core/Canvas'
import Node from '../graph/Node'
import Vector2d from '../utils/Vector2d'
import Math2d from '../utils/Math2d'
import { selectInteraction } from './selectInteraction'
import { dragInteraction } from './dragInteraction'
import RectCanvasNode from '../node/RectCanvasNode'
import CircleCanvasNode from '../node/CircleCanvasNode'

const anchorPositionOffset = new Vector2d(-3, -3)
/**
 * resize
 */
export class ResizeInteraction extends Interaction {
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
    dragInteraction.onMouseUp(canvas)
  }

  onMouseDown = (canvas: Canvas) => {
    this.activeAnchorIndex = this.getActiveAnchorIndex(canvas)
    if (this.activeAnchorIndex === -1) {
      selectInteraction.onMouseDown(canvas)
      dragInteraction.onMouseDown(canvas)
      const activeNode = canvas.getActiveNodes()[0]
      if (activeNode && activeNode.canResize && activeNode.isExpanded) {
        this.activeNode = activeNode
      } else {
        this.activeNode = undefined
      }
    }
  }

  onMouseMove = (canvas: Canvas, e: Event) => {
    const activeNode = this.activeNode
    if (this.activeAnchorIndex > -1 && activeNode) {
      const event = e as MouseEvent
      const coordinate = canvas.viewportToPixelCoordinate(new Vector2d(event.clientX, event.clientY))
      activeNode.isUpdate = true
      canvas.repaint = true
      if (activeNode.shapeType === 'rect') {
        resizeRectNode(activeNode as RectCanvasNode, this.activeAnchorIndex, coordinate)
      } else {
        resizeCircleNode(activeNode as CircleCanvasNode, this.activeAnchorIndex, coordinate)
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
      const anchorRectPosition = canvas.pixelToViewportCoordinate(point).add(anchorPositionOffset)
      index = i
      return Math2d.isPointInRect(canvas.mousemovePosition, anchorRectPosition, 6, 6)
    })
    if (!anchor) return -1
    return index
  }
}

/**
 * 矩形
 * @param activeNode 
 * @param anchorIndex 
 * @param coordinate 
 */
function resizeRectNode(activeNode: RectCanvasNode, anchorIndex: number, coordinate: Vector2d): void {
  const nodeBoundingRect = activeNode.boundingRect
  let currentWidth: number = activeNode.getWidth()
  let currentHeight: number = activeNode.getHeight()
  switch (anchorIndex) {
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
}

/**
 * 圆形
 * @param activeNode 
 * @param anchorIndex 
 * @param coordinate 
 */
function resizeCircleNode(activeNode: CircleCanvasNode, anchorIndex: number, coordinate: Vector2d): void {
  let currentRadius: number = activeNode.radius
  let minRadius: number = activeNode.minRadius
  const center = activeNode.centerPoint
  switch (anchorIndex) {
    case 0: // 西北
    case 1: // 东北
    case 2: // 东南
    case 3: // 西南
      currentRadius = Vector2d.copy(coordinate).substract(center).magnitude / Math.sqrt(2)
      break
    case 4: // 北
    case 5: // 东
    case 6: // 南
    case 7: // 西
      currentRadius = Vector2d.copy(coordinate).substract(center).magnitude
      break
  }
  if (currentRadius >= minRadius) {
    activeNode.radius = currentRadius
    activeNode.position.y = center.y - currentRadius
    activeNode.position.x = center.x - currentRadius
  }
}

export const resizeInteraction = new ResizeInteraction()
export default ResizeInteraction