import { RectCanvasNode, IRectCanvasNodeOptions } from './RectCanvasNode'
import Vector2d from '../utils/vector2d';

export interface IGroupOptions extends IRectCanvasNodeOptions { }

/**
 * 矩形组
 */
export class RectGroup extends RectCanvasNode {
  // 是组
  isGroup = true
  // 默认可调接尺寸
  canResize = true

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
    const { x, y } = this.getPosition()

    graphCanvasCtx.beginPath()
    graphCanvasCtx.rect(x, y, this.width, this.height)
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

