import RectDomNode, { IRectDomNodeOptions } from './RectDomNode'

export interface IRectDomGroupOptions extends IRectDomNodeOptions {
  isExpanded?: boolean
}
export class RectDomGroup extends RectDomNode {
  // 是组
  isGroup = true
  // 默认可调接尺寸
  canResize = true

  constructor(options: IRectDomGroupOptions) {
    super(options)
    if (typeof options.isExpanded === 'boolean') {
      this.isExpanded = options.isExpanded
    }
  }

  render() {
    this.$el.style.backgroundColor = 'white'
    this.$el.innerHTML = `<div style="height:100%;
                                      display:flex;
                                      align-items:center;
                                      justify-content:center;
                                      border:1px solid #066df2;
                                      box-sizing:border-box;">
                            ${this.isExpanded?'':'...'}
                          </div>`
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

export default RectDomGroup