import Interaction from './Interaction'
import { Canvas, Vector2d } from '../index'
/**
 * 滚轮缩放
 */
class WheelZoomInteraction extends Interaction {
  onWheel = (canvas: Canvas, e: Event) => {
    const { deltaY, clientX, clientY } = e as WheelEvent
    if (deltaY > 0) {
      canvas.zoomOut(new Vector2d(clientX, clientY))
    } else {
      canvas.zoomIn(new Vector2d(clientX, clientY))
    }
  }
}

const wheelZoomInteraction = new WheelZoomInteraction()
export default wheelZoomInteraction