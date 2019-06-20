import Interaction from './Interaction'
import Canvas from '../core/Canvas';
import Vector2d from '../utils/vector2d';

class AreaPickInteraction extends Interaction {
  minDragDistance: number = 5
  mouseDown: boolean = false
  onInstall = (canvas: Canvas) => {
    console.log('install', canvas)
    // 显示交互画布
    canvas.wrapper.appendChild(canvas.topCanvas)
  }
  onUninstall = (canvas: Canvas) => {
    console.log('uninstall', canvas)
    // 移除交互画布
    canvas.wrapper.removeChild(canvas.topCanvas)
  }
  onMouseDown = (canvas: Canvas, e: Event) => {
    const { button } = e as MouseEvent
    if (button !== 0) return
    this.mouseDown = true
    canvas.topCanvasCtx.fillStyle = 'rgba(41, 193, 248,0.3)'
    canvas.topCanvasCtx.strokeStyle = 'rgb(41, 193, 248)'
  }
  onMouseMove = (canvas: Canvas, e: Event) => {
    const { mousedownPosition, mousemovePosition, topCanvasCtx, viewWidth, viewHeight } = canvas
    if (!this.mouseDown) return
    const offset = mousemovePosition.substract(mousedownPosition)
    if (offset.magnitude < this.minDragDistance) return
    const p0 = canvas.viewportToCanvasCoordinate(mousedownPosition)
    const p2 = canvas.viewportToCanvasCoordinate(mousemovePosition)
    const p1 = new Vector2d(p0.x, p2.y)
    const p3 = new Vector2d(p2.x, p0.y)
    // 绘制拖选框
    topCanvasCtx.clearRect(0, 0, viewWidth, viewHeight)
    topCanvasCtx.beginPath()
    topCanvasCtx.moveTo(p0.x, p0.y)
    topCanvasCtx.lineTo(p1.x, p1.y)
    topCanvasCtx.lineTo(p2.x, p2.y)
    topCanvasCtx.lineTo(p3.x, p3.y)
    topCanvasCtx.closePath()
    topCanvasCtx.fill()
    topCanvasCtx.stroke()
  }
  onMouseUp = (canvas: Canvas, e: Event) => {
    if (!this.mouseDown) return
    const { topCanvasCtx, viewWidth, viewHeight } = canvas
    this.mouseDown = false
    topCanvasCtx.clearRect(0, 0, viewWidth, viewHeight)
  }
}
export const areaPickInteraction = new AreaPickInteraction()
export default areaPickInteraction