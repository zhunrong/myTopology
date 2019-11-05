import Canvas from '../core/Canvas'

export class MiniMap {

  rootElement = document.createElement('div')
  canvasElement = document.createElement('canvas')
  container: HTMLElement | null = null
  width = 320
  height = 240
  canvas: Canvas | null = null
  private _frameRequestId = 0

  constructor() {
    this.rootElement.appendChild(this.canvasElement)
  }

  mount(container: HTMLElement) {
    this.container = container
    this.container.appendChild(this.rootElement)
    this.canvasElement.width = this.width
    this.canvasElement.height = this.height
  }

  /**
   * 连接到画布
   * @param canvas 
   */
  connect(canvas: Canvas) {
    this.canvas = canvas
    this.update()
  }

  update = () => {
    this.render()
    this._frameRequestId = requestAnimationFrame(this.update)
  }

  render() {
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

    // 绘制节点与连线的缩略图
    const num = Math.random()
    this.canvas.rootNode.getDescendantBF(node => {
      node.edges.forEach(edge => {
        if (edge.renderSign === num) return
        if (edge.sourceNode === node) {
          if (edge.targetNode.depth <= node.depth) {
            edge.drawThumbnail(ctx)
            edge.renderSign = num
          }
        } else {
          if (edge.sourceNode.depth <= node.depth) {
            edge.drawThumbnail(ctx)
            edge.renderSign = num
          }
        }
      })
      if (node.miniMapVisible) {
        node.drawThumbnail(ctx)
      }
    })

    // 非可视区域在地图中以阴影表示
    ctx.translate(-offsetX, -offsetY)
    ctx.beginPath()
    ctx.rect(0, 0, this.width / scale, this.height / scale)
    // 绘制画布可视区域在小地图上的映射窗口
    ctx.rect(offsetX, offsetY, this.canvas.canvasWidth, this.canvas.canvasHeight)
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.fill('evenodd')
    ctx.restore()
  }

  /**
   * 销毁
   */
  destroy() {
    cancelAnimationFrame(this._frameRequestId)
    if (this.container) {
      this.container.removeChild(this.rootElement)
    }
  }
}

export default MiniMap