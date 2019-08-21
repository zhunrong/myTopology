import { RectCanvasNode, IRectCanvasNodeOptions } from './RectCanvasNode'

export interface IGroupOptions extends IRectCanvasNodeOptions { }

export class Group extends RectCanvasNode {
  isGroup = true

  render() {
    // const ctx = this.cacheCanvas.getContext('2d') as CanvasRenderingContext2D
    // this.cacheCanvas.width = this.width + 4
    // this.cacheCanvas.height = this.height + 4
    // ctx.rect(2, 2, this.width, this.height)
    // ctx.strokeStyle = '#066df2'
    // ctx.stroke()
  }

  update() {
    if (!this.canvas) return
    const { graphCanvasCtx } = this.canvas
    const { x, y } = this.position

    graphCanvasCtx.rect(x, y, this.width, this.height)

    graphCanvasCtx.save()
    if (this.active) {
      graphCanvasCtx.shadowBlur = 5
      graphCanvasCtx.shadowColor = 'rgba(255,0,0,0.8)'
    }
    // graphCanvasCtx.drawImage(this.cacheCanvas, x - 2, y - 2)
    graphCanvasCtx.strokeStyle = '#066df2'
    graphCanvasCtx.stroke()
    graphCanvasCtx.restore()
  }
}

export default Group

