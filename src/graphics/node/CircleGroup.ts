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

  render() { }

  update() {
    if (!this.canvas) return
    const { graphCanvasCtx } = this.canvas
    const { x, y } = this.getPosition()

    graphCanvasCtx.beginPath()
    graphCanvasCtx.arc(x + this.radius, y + this.radius, this.radius, 0, 2 * Math.PI)
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

export default CircleGroup