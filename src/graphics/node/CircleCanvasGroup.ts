import CircleCanvasNode, { ICircleCanvasNodeOptions } from './CircleCanvasNode'

interface IGroupOptions extends ICircleCanvasNodeOptions {
  isExpanded?: boolean
}

/**
 * 圆形组
 */
export class CircleGroup extends CircleCanvasNode {
  static shape = 'circle'
  isGroup = true
  canResize = true

  constructor(options: IGroupOptions) {
    super(options)
    if (typeof options.isExpanded === 'boolean') {
      this.isExpanded = options.isExpanded
    }
  }

  render(ctx?: CanvasRenderingContext2D) { }

  update(ctx?: CanvasRenderingContext2D) {
    ctx = ctx || (this.canvas && this.canvas.graphCanvasCtx)
    if (!ctx) return

    const { x, y } = this.getPosition()
    ctx.beginPath()
    ctx.arc(x + this.radius, y + this.radius, this.radius, 0, 2 * Math.PI)
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
    const { x, y } = this.centerPoint
    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, this.radius, 0, Math.PI * 2)
    ctx.strokeStyle = this.active ? this.style.activeColor : this.style.color
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.restore()
  }

}

export default CircleGroup