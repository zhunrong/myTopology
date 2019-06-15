import Interaction from './Interaction'
import { Canvas, Vector2d } from '../index'
/**
 * drop
 */
class DropInteraction extends Interaction {
  onDrop = (canvas: Canvas, e: Event) => {
    const event = e as DragEvent
    canvas.eventEmitter.emit('canvas:drop', {
      coordinate: canvas.viewPortTopixelCoordinate(new Vector2d(event.clientX, event.clientY)),
      dataTransfer: event.dataTransfer
    })
  }
  onDragOver = (canvas: Canvas, e: Event) => {
    e.preventDefault()
  }
}

export const dropInteraction=new DropInteraction()
export default dropInteraction