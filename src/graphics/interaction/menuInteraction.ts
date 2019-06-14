import Interaction from './Interaction'
import Canvas from '../Canvas'

class MenuInteraction extends Interaction {
  onContextMenu = (canvas: Canvas, e: Event) => {
    const event = e as MouseEvent
    canvas.contextMenu.hide()
    canvas.contextMenu.show(event.clientX, event.clientY)
  }
}

export default new MenuInteraction