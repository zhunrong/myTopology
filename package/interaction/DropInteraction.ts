import Interaction from './Interaction';
import Canvas from '../core/Canvas';
import Vector2d from '../utils/Vector2d';
/**
 * drop
 */
export class DropInteraction extends Interaction {
  onDrop = (canvas: Canvas, e: Event) => {
    const event = e as DragEvent;
    canvas.eventEmitter.emit('canvas:drop', {
      coordinate: canvas.viewportToPixelCoordinate(new Vector2d(event.clientX, event.clientY)),
      dataTransfer: event.dataTransfer
    });
  };
  onDragOver = (canvas: Canvas, e: Event) => {
    e.preventDefault();
  };
  handleEvent(canvas: Canvas, event: Event) {
    switch (event.type) {
      case 'drop':
        this.onDrop(canvas, event);
        break;
      case 'dragover':
        this.onDragOver(canvas, event);
        break;
    }
  }
}

export const dropInteraction = new DropInteraction();
export default DropInteraction;
