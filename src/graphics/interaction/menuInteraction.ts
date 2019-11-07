import Interaction from './Interaction'
import { Canvas } from '../core/Canvas'

/**
 * 右键菜单
 */
export class MenuInteraction extends Interaction {
  // onContextMenu = (canvas: Canvas, e: Event) => {
  //   const event = e as MouseEvent
  //   canvas.contextMenu.hide()
  //   const activeNodes = canvas.getActiveNodes()
  //   const activeEdges = canvas.getActiveEdges()
  //   if (activeNodes.length) {
  //     canvas.contextMenu.menu = [{
  //       label: '重命名',
  //       command: 'rename'
  //     }, {
  //       label: '删除',
  //       command: 'remove'
  //     }]
  //   } else if (activeEdges.length) {
  //     canvas.contextMenu.menu = [
  //       {
  //         label: '重命名',
  //         command: 'rename'
  //       },
  //       {
  //         label: '删除',
  //         command: 'remove'
  //       }
  //     ]
  //   } else {
  //     canvas.contextMenu.menu = [{
  //       label: '放大',
  //       command: 'zoomIn'
  //     }, {
  //       label: '缩小',
  //       command: 'zoomOut'
  //     }]
  //   }
  //   canvas.contextMenu.show(event.clientX, event.clientY)
  // }
}

export const menuInteration = new MenuInteraction()
export default MenuInteraction