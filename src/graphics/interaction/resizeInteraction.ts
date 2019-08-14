import Interaction from './Interaction'
import Canvas from '../core/Canvas'

class ResizeInteraction extends Interaction {
  onInstall = (canvas: Canvas) => {
    // 显示交互画布
    canvas.topCanvasMount()
  }
  onUninstall = (canvas: Canvas) => {
    // 移除交互画布
    canvas.topCanvasUnmount()
  }
}

export const resizeInteraction = new ResizeInteraction()
export default resizeInteraction