import { RectCanvasNode, IRectCanvasNodeOptions } from './RectCanvasNode'

export interface IRectCanvasGroupOptions extends IRectCanvasNodeOptions {
  isExpanded?: boolean
}

/**
 * 矩形组
 */
export class RectCanvasGroup extends RectCanvasNode {
  static shape = 'rect'
  // 是组
  isGroup = true
  // 默认可调接尺寸
  canResize = true

  constructor(options: IRectCanvasGroupOptions) {
    super(options)
    if (typeof options.isExpanded === 'boolean') {
      this.isExpanded = options.isExpanded
    }
  }

  render(ctx?: CanvasRenderingContext2D) { }

  update(ctx?: CanvasRenderingContext2D) {
    ctx = ctx || (this.canvas && this.canvas.graphCanvasCtx)
    if (!ctx) return

    const width = this.getWidth()
    const height = this.getHeight()
    const { x, y } = this.getPosition()
    const center = this.centerPoint

    ctx.beginPath()
    ctx.rect(x, y, width, height)

    if (!this.isExpanded) {
      ctx.moveTo(center.x, center.y - 10)
      ctx.lineTo(center.x, center.y + 10)
      ctx.moveTo(center.x - 10, center.y)
      ctx.lineTo(center.x + 10, center.y)
    }

    ctx.save()
    if (this.active) {
      ctx.shadowBlur = 5
      ctx.shadowColor = this.active ? this.style.activeColor : this.style.color
    }
    ctx.strokeStyle = this.active ? this.style.activeColor : this.style.color
    ctx.stroke()
    ctx.restore()
  }

  drawThumbnail(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.getPosition()
    const width = this.getWidth()
    const height = this.getHeight()
    ctx.save()
    ctx.beginPath()
    ctx.rect(x, y, width, height)
    ctx.strokeStyle = this.active ? this.style.activeColor : this.style.color
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.restore()
  }
}

export default RectCanvasGroup

