import Interaction from './Interaction'
import Canvas from '../Canvas'
import Vector2d from '../../utils/vector2d'

/**
 * drop
 */
class DropInteration extends Interaction {
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

export default new DropInteration()