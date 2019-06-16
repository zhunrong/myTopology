import Interaction from './Interaction'
import { Canvas } from '../core/Canvas'
import { Vector2d } from '../utils/vector2d'
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

export const dropInteraction = new DropInteraction()
export default dropInteraction