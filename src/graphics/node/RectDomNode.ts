import RectNode, { IRectNodeOptions } from '../graph/RectNode'
import style from './rectDomNode.less'

export interface IRectDomNodeOptions extends IRectNodeOptions { }

export class RectDomNode extends RectNode {
  renderType: 'DOM' = 'DOM'
  $el = document.createElement('div')

  constructor(options: IRectDomNodeOptions) {
    super(options)
    this.$el.className = style.node
  }

  mount(force = false): void {
    if (this.mounted && !force) return
    if (this.canvas) {
      this.mounted = true
      this.canvas.wrapper.appendChild(this.$el)
    }
  }

  unmount(): void {
    if (!this.mounted || !this.canvas) return
    this.mounted = false
    if (this.$el.parentElement) {
      this.$el.parentElement.removeChild(this.$el)
    }
  }

  render(ctx?: CanvasRenderingContext2D) {
    this.$el.innerHTML = `<div style="height:100%;
                                      display:flex;
                                      align-items:center;
                                      justify-content:center;
                                      border:1px solid #29c1f8;
                                      box-sizing: border-box;
                                      font-size:12px;
                                      user-select: none;
                                      color:#29c1f8;">${this.text}</div>`
  }

  update(ctx?: CanvasRenderingContext2D) {
    if (!this.canvas) return
    const { x, y } = this.getPosition()
    const width = this.getWidth()
    const height = this.getHeight()
    Object.assign(this.$el.style, {
      transform: `scale(${this.canvas.canvasScale}) translate3d(${x}px,${y}px,0)`,
      width: `${width}px`,
      height: `${height}px`,
      boxShadow: this.active ? `0 0 5px 0 ${this.style.activeColor}` : 'none'
    })
  }
}

export default RectDomNode