import Interaction from './Interaction'
import Canvas from '../core/Canvas'
import ContextMenu, { IMenu } from '../plugin/ContextMenu'
import Vector2d from '../utils/Vector2d'

/**
 * 手动对齐
 */
export class ManualAlignInteraction extends Interaction {

  canvas!: Canvas

  handleEvent(canvas: Canvas, event: Event) {
    switch (event.type) {
      case 'contextmenu':
        this.onContextMenu(canvas, event)
        break
    }
  }

  onContextMenu(canvas: Canvas, event: Event) {
    const contextMenu = canvas.plugins.find(plugin => plugin instanceof ContextMenu) as ContextMenu | undefined
    if (!contextMenu) return
    const activeNodes = canvas.rootNode.children.filter(child => child.active)
    if (activeNodes.length) {
      const menu = [...contextMenu.menu]
      menu.push({
        label: '靠左对齐',
        command: 'leftAlign'
      }, {
        label: '水平居中对齐',
        command: 'horizontalCenterAlign'
      }, {
        label: '靠右对齐',
        command: 'rightAlign'
      }, {
        label: '靠上对齐',
        command: 'topAlign'
      }, {
        label: '垂直居中对齐',
        command: 'verticalCenterAlign'
      }, {
        label: '靠下对齐',
        command: 'bottomAlign'
      })
      contextMenu.show(menu)
    }
  }

  onInstall = (canvas: Canvas) => {
    this.canvas = canvas
    canvas.eventEmitter.on('canvas:menu', this.onCanvasMenu)
  }
  onUninstall = (canvas: Canvas) => {
    canvas.eventEmitter.off('canvas:menu', this.onCanvasMenu)
  }

  onCanvasMenu = (menu: IMenu) => {
    const activeNodes = this.canvas.rootNode.children.filter(child => child.active)
    const { canvasWidth, canvasHeight } = this.canvas
    let targetBounding!: Vector2d[]
    let targetCenter!: Vector2d
    if (activeNodes.length > 1) {
      targetBounding = activeNodes[0].boundingJoinPoints
      targetCenter = activeNodes[0].centerPoint
    } else {
      targetBounding = [
        new Vector2d(canvasWidth / 2, 0),
        new Vector2d(canvasWidth, canvasHeight / 2),
        new Vector2d(canvasWidth / 2, canvasHeight),
        new Vector2d(0, canvasHeight / 2)
      ]
      targetCenter = new Vector2d(canvasWidth / 2, canvasHeight / 2)
    }
    activeNodes.forEach(node => {
      const bounding = node.boundingJoinPoints
      const center = node.centerPoint
      const offset = new Vector2d()
      switch (menu.command) {
        case 'leftAlign':
          offset.x = targetBounding[3].x - bounding[3].x
          break
        case 'rightAlign':
          offset.x = targetBounding[1].x - bounding[1].x
          break
        case 'horizontalCenterAlign':
          offset.x = targetCenter.x - center.x
          break
        case 'topAlign':
          offset.y = targetBounding[0].y - bounding[0].y
          break
        case 'bottomAlign':
          offset.y = targetBounding[2].y - bounding[2].y
          break
        case 'verticalCenterAlign':
          offset.y = targetCenter.y - center.y
          break
      }
      node.translate(offset)
    })
  }

}

export default ManualAlignInteraction