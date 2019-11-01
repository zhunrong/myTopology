import Canvas from '../core/Canvas'

export class MiniMap {

  rootElement = document.createElement('div')
  canvasElement = document.createElement('canvas')
  width = 320
  height = 240
  canvas: Canvas | null = null

  constructor() {
    this.rootElement.appendChild(this.canvasElement)
  }

  mount(container: HTMLElement) {
    container.appendChild(this.rootElement)
    this.canvasElement.width = this.width
    this.canvasElement.height = this.height
  }

  connect(canvas: Canvas) {
    this.canvas = canvas
    setInterval(() => {
      this.update()
    }, 1000 / 30)
  }

  update() {
    if (!this.canvas) return
    const boundingRect = this.canvas.getContentBoundingRect()
    const width = boundingRect[2].x - boundingRect[0].x
    const height = boundingRect[2].y - boundingRect[0].y
    const scale = Math.min(this.width / width, this.height / height)
    const ctx = this.canvasElement.getContext('2d') as CanvasRenderingContext2D
    const offsetX = (this.width / scale - width) / 2 - boundingRect[0].x
    const offsetY = (this.height / scale - height) / 2 - boundingRect[0].y
    ctx.clearRect(0, 0, this.width, this.height)
    ctx.save()
    ctx.scale(scale, scale)
    ctx.translate(offsetX, offsetY)
    this.canvas.rootNode.getDescendantBF(node => {
      node.drawThumbnail(ctx)
    })
    ctx.translate(-offsetX, -offsetY)
    ctx.rect(0, 0, this.width / scale, this.height / scale)
    // 绘制画布可视区域在小地图上的映射窗口
    ctx.rect(offsetX, offsetY, this.canvas.canvasWidth, this.canvas.canvasHeight)
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.fill('evenodd')
    ctx.restore()
  }

}

export default MiniMap