import RectNode, { IRectNodeOptions } from '../graph/RectNode'

export interface IRectDomNodeOptions extends IRectNodeOptions { }

export class RectDomNode extends RectNode {
  renderType = 'DOM'
  $el = document.createElement('div')

  constructor(options: IRectDomNodeOptions) {
    super(options)
    Object.assign(this.$el.style, {
      position: 'absolute',
      left: 0,
      top: 0
    })
  }

  mount(): void {
    if (this.mounted || !this.canvas) return
    this.mounted = true
    this.canvas.domCanvas.appendChild(this.$el)
  }

  unmount(): void {
    if (!this.mounted || !this.canvas) return
    this.mounted = false
    this.canvas.domCanvas.removeChild(this.$el)
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
    const { x, y } = this.getPosition()
    const width = this.getWidth()
    const height = this.getHeight()
    const { active } = this
    Object.assign(this.$el.style, {
      transform: `translate3d(${x}px,${y}px,0)`,
      width: `${width}px`,
      height: `${height}px`,
      boxShadow: active ? '0 0 5px 0 rgba(255,0,0,0.8)' : 'none'
    })
  }
}

export default RectDomNode