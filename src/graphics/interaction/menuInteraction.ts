import Interaction from './Interaction'
import { Canvas } from '../index'
class MenuInteraction extends Interaction {
  onContextMenu = (canvas: Canvas, e: Event) => {
    const event = e as MouseEvent
    canvas.contextMenu.hide()
    canvas.contextMenu.show(event.clientX, event.clientY)
  }
}

export const menuInteration = new MenuInteraction()
export default menuInteration