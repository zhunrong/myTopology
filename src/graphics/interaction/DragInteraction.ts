import Interaction from './Interaction'
import Canvas from '../core/Canvas'
import Node from '../graph/Node'
import Vector2d from '../utils/Vector2d'

export interface IDragInteractionOptions {
  alignEnable?: boolean
  alignGap?: number
  alignLineColor?: string
}
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

  /* 自动对齐start */
  yLocked = false
  yAlign: 'center' | 'top' | 'bottom' = 'center'
  yValue = 0
  xLocked = false
  xAlign: 'center' | 'left' | 'right' = 'center'
  xValue = 0
  alignEnable = true
  alignGap = 10
  alignLineColor = '#2EB5E5'
  /* 自动对齐end */

  constructor(options?: IDragInteractionOptions) {
    super()
    if (options) {
      if (options.alignEnable !== undefined) {
        this.alignEnable = options.alignEnable
      }
      if (options.alignGap !== undefined) {
        this.alignGap = options.alignGap
      }
      if (options.alignLineColor) {
        this.alignLineColor = options.alignLineColor
      }
    }
  }

  onInstall = (canvas: Canvas) => {
    // 显示交互画布
    canvas.topCanvasMount()
  }
  onUninstall = (canvas: Canvas) => {
    // 移除交互画布
    canvas.topCanvasCtx.clearRect(0, 0, canvas.viewWidth, canvas.viewHeight)
    canvas.topCanvasUnmount()
  }

  onMouseDown = (canvas: Canvas) => {
    const activeNodes = canvas.getActiveNodes()
    if (activeNodes.length) {
      this.moveNodes = [...activeNodes]
    } else {
      this.moveNodes = [...canvas.rootNode.children]
    }
    this.mousedown = true
    this.yLocked = false
    this.xLocked = false
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
    this.autoAlign(canvas)
  }

  onMouseUp = (canvas: Canvas) => {
    const { topCanvasCtx, viewWidth, viewHeight } = canvas
    this.joinGroupComplete(canvas)
    this.autoAlignComplete()
    this.moveNodes = []
    this.mousedown = false
    topCanvasCtx.clearRect(0, 0, viewWidth, viewHeight)
  }

  handleEvent(canvas: Canvas, event: Event) {
    switch (event.type) {
      case 'mousedown':
        this.onMouseDown(canvas)
        break
      case 'mousemove':
        this.onMouseMove(canvas)
        break
      case 'mouseup':
        this.onMouseUp(canvas)
        break
    }
  }

  /**
   * 拖动节点加入分组逻辑
   * @param canvas 
   */
  joinGroupComplete(canvas: Canvas) {
    if (this.moveNodes.length !== 1) return
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

  /**
   * 自动对齐判断逻辑
   * @param canvas 
   */
  autoAlign(canvas: Canvas) {
    if (!this.alignEnable) return
    if (this.moveNodes.length !== 1) return
    this.yLocked = false
    this.xLocked = false
    const activeNode = this.moveNodes[0]
    if (activeNode.parent) {
      const { topCanvasCtx, viewWidth, viewHeight } = canvas
      topCanvasCtx.clearRect(0, 0, viewWidth, viewHeight)
      topCanvasCtx.beginPath()
      const joinPoints = activeNode.boundingJoinPoints
      const center = activeNode.centerPoint
      const vertical = [joinPoints[0].y, joinPoints[2].y]
      const horizontal = [joinPoints[3].x, joinPoints[1].x]


      activeNode.parent.children.find(child => {
        if (child === activeNode) return
        if (!child.visible) return
        const joinPoints2 = child.boundingJoinPoints
        const center2 = child.centerPoint

        // y轴吸附辅助线(中心)
        if (!this.yLocked && this.isClose(center.y, center2.y)) {
          const point = canvas.pixelToCanvasCoordinate(center2)
          drawHorizontalPath(topCanvasCtx, point.y)
          this.yLocked = true
          this.yValue = center2.y
          this.yAlign = 'center'
        }

        // y轴吸附辅助线(上下)
        if (!this.yLocked) {
          const vertical2 = [joinPoints2[0], joinPoints2[2]]
          vertical.find((value1, index) => {
            const value2 = vertical2.find(value2 => this.isClose(value1, value2.y))
            if (value2) {
              const point = canvas.pixelToCanvasCoordinate(value2)
              drawHorizontalPath(topCanvasCtx, point.y)
              this.yLocked = true
              this.yValue = value2.y
              this.yAlign = index === 0 ? 'top' : 'bottom'
            }
            return this.yLocked
          })
        }

        // x轴吸附辅助线(中心)
        if (!this.xLocked && this.isClose(center.x, center2.x)) {
          const point = canvas.pixelToCanvasCoordinate(center2)
          drawVerticalPath(topCanvasCtx, point.x)
          this.xLocked = true
          this.xValue = center2.x
          this.xAlign = 'center'
        }
        // x轴吸附辅助线(左右)
        if (!this.xLocked) {
          const horizontal2 = [joinPoints2[3], joinPoints2[1]]
          horizontal.find((value1, index) => {
            const value2 = horizontal2.find(value2 => this.isClose(value1, value2.x))
            if (value2) {
              const point = canvas.pixelToCanvasCoordinate(value2)
              drawVerticalPath(topCanvasCtx, point.x)
              this.xLocked = true
              this.xValue = value2.x
              this.xAlign = index === 0 ? 'left' : 'right'
            }
            return this.xLocked
          })
        }
        return this.xLocked && this.yLocked
      })

      topCanvasCtx.save()
      topCanvasCtx.strokeStyle = this.alignLineColor
      topCanvasCtx.lineWidth = 1
      topCanvasCtx.setLineDash([5, 3])
      topCanvasCtx.stroke()
      topCanvasCtx.restore()
    }
  }

  /**
   * 完成对齐
   */
  autoAlignComplete() {
    if (!this.alignEnable) return
    if (this.moveNodes.length !== 1) return
    const activeNode = this.moveNodes[0]
    const [top, right, bottom, left] = activeNode.boundingJoinPoints
    const center = activeNode.centerPoint
    const offset = new Vector2d()
    if (this.yLocked) {
      switch (this.yAlign) {
        case 'center':
          offset.y = this.yValue - center.y
          break
        case 'bottom':
          offset.y = this.yValue - bottom.y
          break
        case 'top':
          offset.y = this.yValue - top.y
          break
      }
    }
    if (this.xLocked) {
      switch (this.xAlign) {
        case 'center':
          offset.x = this.xValue - center.x
          break
        case 'left':
          offset.x = this.xValue - left.x
          break
        case 'right':
          offset.x = this.xValue - right.x
          break
      }
    }
    activeNode.translate(offset)
  }

  isClose(a: number, b: number) {
    return Math.abs(a - b) <= this.alignGap
  }
}

function drawVerticalPath(ctx: CanvasRenderingContext2D, value: number) {
  ctx.moveTo(value, 0)
  ctx.lineTo(value, ctx.canvas.height)
}

function drawHorizontalPath(ctx: CanvasRenderingContext2D, value: number) {
  ctx.moveTo(0, value)
  ctx.lineTo(ctx.canvas.width, value)
}


export const dragInteraction = new DragInteraction()
export default DragInteraction