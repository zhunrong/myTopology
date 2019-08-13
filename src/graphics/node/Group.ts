import { RectCanvasNode, IRectCanvasNodeOptions } from './RectCanvasNode'

export interface IGroupOptions extends IRectCanvasNodeOptions { }

export class Group extends RectCanvasNode {
  isGroup = true

  render() {
    // if (!this.canvas) return
    const ctx = this.cacheCanvas.getContext('2d') as CanvasRenderingContext2D
    this.cacheCanvas.width = this.width + 4
    this.cacheCanvas.height = this.height + 4
    ctx.rect(2, 2, this.width, this.height)
    ctx.fillStyle = '#cccccc'
    ctx.fill()
  }
}

export default Group

