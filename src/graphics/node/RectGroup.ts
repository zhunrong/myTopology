import { RectCanvasNode, IRectCanvasNodeOptions } from './RectCanvasNode'

export interface IGroupOptions extends IRectCanvasNodeOptions {
  isExpanded?: boolean
}

/**
 * 矩形组
 */
export class RectGroup extends RectCanvasNode {
  // 是组
  isGroup = true
  // 默认可调接尺寸
  canResize = true

  constructor(options: IGroupOptions) {
    super(options)
    if (typeof options.isExpanded === 'boolean') {
      this.isExpanded = options.isExpanded
    }
  }

  render() {}

  update() {
    if (!this.canvas) return
    const { graphCanvasCtx } = this.canvas
    const width = this.getWidth()
    const height = this.getHeight()
    const { x, y } = this.getPosition()
    const center = this.centerPoint

    graphCanvasCtx.beginPath()
    graphCanvasCtx.rect(x, y, width, height)

    if (!this.isExpanded) {
      graphCanvasCtx.moveTo(center.x, center.y - 10)
      graphCanvasCtx.lineTo(center.x, center.y + 10)
      graphCanvasCtx.moveTo(center.x - 10, center.y)
      graphCanvasCtx.lineTo(center.x + 10, center.y)
    }

    // graphCanvasCtx.drawImage(this.cacheCanvas, x - 2, y - 2)
    graphCanvasCtx.save()
    if (this.active) {
      graphCanvasCtx.shadowBlur = 5
      graphCanvasCtx.shadowColor = 'rgba(255,0,0,0.8)'
    }
    graphCanvasCtx.strokeStyle = '#066df2'
    graphCanvasCtx.stroke()
    graphCanvasCtx.restore()

  }
}

export default RectGroup

