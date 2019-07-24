import Interaction from './Interaction'
import { Canvas } from '../core/Canvas'
class MenuInteraction extends Interaction {
  onContextMenu = (canvas: Canvas, e: Event) => {
    const event = e as MouseEvent
    canvas.contextMenu.hide()
    if(canvas.activeNodes.length){
      canvas.contextMenu.menu = [{
        label: '重命名',
        command: 'rename'
      }]
    }else{
      canvas.contextMenu.menu = [{
        label: '放大',
        command: 'zoomIn'
      }, {
        label: '缩小',
        command: 'zoomOut'
      }]
    }
    canvas.contextMenu.show(event.clientX, event.clientY)
  }
}

export const menuInteration = new MenuInteraction()
export default menuInteration