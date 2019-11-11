import Circle, { ICircleNodeOptions } from '../graph/CircleNode'

export interface ICircleCanvasNodeOptions extends ICircleNodeOptions { }

export class CircleCanvasNode extends Circle {
  renderType = 'CANVAS'
  cacheCanvas = document.createElement('canvas')

  constructor(options: ICircleCanvasNodeOptions) {
    super(options)
  }

  render() {
    const { radius, canvas, active } = this
    if (!canvas) return
    const diameter = 2 * radius
    this.cacheCanvas.width = diameter + 2
    this.cacheCanvas.height = diameter + 2
    const ctx = this.cacheCanvas.getContext('2d') as CanvasRenderingContext2D

    ctx.beginPath()

    ctx.arc(radius + 1, radius + 1, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = '#29c1f8'
    ctx.fillStyle = '#fff'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fill()

    if (this.text) {
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      ctx.font = "14px serif"
      ctx.fillStyle = '#29c1f8'
      ctx.fillText(this.text, radius + 1, radius + 1)
    }


    canvas.repaint = true
  }

  update() {
    if (!this.canvas) return
    const { graphCanvasCtx } = this.canvas
    const { x, y } = this.getPosition()
    graphCanvasCtx.save()
    if (this.active) {
      graphCanvasCtx.shadowBlur = 5
      graphCanvasCtx.shadowColor = 'rgba(255,0,0,0.8)'
    }
    graphCanvasCtx.drawImage(this.cacheCanvas, x - 1, y - 1)
    graphCanvasCtx.restore()
  }
}

export default CircleCanvasNode