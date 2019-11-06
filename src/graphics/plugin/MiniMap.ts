import Plugin from './Plugin'
import Canvas from '../core/Canvas'
import Vector2d from '../utils/vector2d'
import { throttle } from '../utils/utils'

const lastPoint = new Vector2d()
const currentPoint = new Vector2d()
const offset = new Vector2d()

export class MiniMap extends Plugin {

  canvasElement = document.createElement('canvas')

  /**
   * 地图宽度
   */
  get width() {
    return this.canvasElement.width
  }

  set width(value: number) {
    this.canvasElement.width = value
  }

  /**
   * 地图高度
   */
  get height() {
    return this.canvasElement.height
  }

  set height(value: number) {
    this.canvasElement.height = value
  }

  constructor(width = 200, height = 200) {
    super()
    this.canvasElement.width = width
    this.canvasElement.height = height
    this.canvasElement.draggable = false
  }

  install(canvas: Canvas) {
    this.canvas = canvas
    this.canvasElement.addEventListener('mousemove', this.handleMouseMove)
  }

  destroy() {
    this.canvasElement.removeEventListener('mousemove', this.handleMouseMove)
    this.canvas = null
  }

  update() {
    this.render()
  }

  render() {
    if (!this.canvas) return
    const boundingRect = this.canvas.getContentBoundingRect()
    const width = boundingRect[2].x - boundingRect[0].x
    const height = boundingRect[2].y - boundingRect[0].y
    // scale = 地图尺寸 / 画布尺寸
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

  handleMouseMove = throttle(e => {
    if (e.buttons !== 1 || !this.canvas || lastPoint.magnitude === 0) {
      lastPoint.x = e.offsetX
      lastPoint.y = e.offsetY
      return
    }
    currentPoint.x = e.offsetX
    currentPoint.y = e.offsetY
    // do...
    const boundingRect = this.canvas.getContentBoundingRect()
    const width = boundingRect[2].x - boundingRect[0].x
    const height = boundingRect[2].y - boundingRect[0].y
    const scale = Math.max(width / this.width, height / this.height)
    offset.copy(currentPoint).substract(lastPoint).scale(-scale)
    this.canvas.rootNode.translate(offset)
    this.canvas.repaint = true
    // done
    lastPoint.copy(currentPoint)
  })

  /**
   * 挂载
   * @param container 
   */
  mount(container: HTMLElement) {
    container.appendChild(this.canvasElement)
  }

  /**
   * 卸载
   */
  unmount() {
    if (this.canvasElement.parentElement) {
      this.canvasElement.parentElement.removeChild(this.canvasElement)
    }
  }

}

export default MiniMap