import Interaction from './Interaction'
import Canvas from '../core/Canvas'
import Group from '../node/Group'

class CreateGroupInteraction extends Interaction {
  canvas!: Canvas
  onContextMenu = (canvas: Canvas, e: Event) => {
    const event = e as MouseEvent
    const activeNodes = canvas.getActiveNodes()
    canvas.contextMenu.hide()
    if (activeNodes.length) {
      canvas.contextMenu.menu = [{
        label: '添加到组',
        command: 'addToGroup'
      }]
      canvas.contextMenu.show(event.clientX, event.clientY)
    }
  }
  onInstall = (canvas: Canvas) => {
    this.canvas = canvas
    canvas.eventEmitter.on('canvas:menu', this.onAddToGroup)
  }
  onUninstall = (canvas: Canvas) => {
    canvas.eventEmitter.off('canvas:menu', this.onAddToGroup)
  }
  //
  onAddToGroup = (command: string) => {
    if (command !== 'addToGroup') return
    const activeNodes = this.canvas.getActiveNodes()
    const group = new Group({
      width: 200,
      height: 200,
      id: '123',
      x: 0,
      y: 0
    })
    activeNodes.forEach(node => {
      // 将节点从原来的父节点中删除
      if (node.parent) {
        node.parent.removeChild(node, false)
      }
      group.addChild(node)
    })
    this.canvas.addNode(group)
  }
}

export const createGroupInteraction = new CreateGroupInteraction()

export default createGroupInteraction