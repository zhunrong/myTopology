import RectNode, { IRectNodeOptions } from '../graph/RectNode'

export interface IRectCanvasNodeOptions extends IRectNodeOptions { }

export class RectCanvasNode extends RectNode {
  readonly renderType = 'CANVAS'
  cacheCanvas = document.createElement('canvas')

  constructor(options: IRectCanvasNodeOptions) {
    super(options)
  }

  render(ctx?: CanvasRenderingContext2D) {
    if (!this.canvas) return
    const width = this.getWidth()
    const height = this.getHeight()
    ctx = ctx || this.cacheCanvas.getContext('2d') as CanvasRenderingContext2D
    this.cacheCanvas.width = width + 4
    this.cacheCanvas.height = height + 4

    ctx.rect(2, 2, width, height)
    ctx.strokeStyle = '#29c1f8'
    ctx.fillStyle = '#fff'
    ctx.lineWidth = 1
    ctx.fill()
    ctx.stroke()
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.font = "14px serif"
    ctx.fillStyle = '#29c1f8'
    ctx.fillText(this.text, width / 2 + 2, height / 2 + 2)

    this.canvas.repaint = true
  }

  update(ctx?: CanvasRenderingContext2D) {
    if (!this.canvas) return
    const { graphCanvasCtx } = this.canvas
    const { x, y } = this.getPosition()
    graphCanvasCtx.save()
    if (this.active) {
      graphCanvasCtx.shadowBlur = 5
      graphCanvasCtx.shadowColor = 'rgba(255,0,0,0.8)'
    }
    graphCanvasCtx.drawImage(this.cacheCanvas, x - 2, y - 2)
    graphCanvasCtx.restore()
  }

}

export default RectCanvasNode