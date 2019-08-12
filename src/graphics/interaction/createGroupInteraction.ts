import Interaction from './Interaction'
import Canvas from '../core/Canvas'
import Group from '../node/Group'
import Vector2d from '../utils/vector2d';

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
    const activeNodes = this.canvas.rootNode.children.filter(node => node.active)
    if (!activeNodes.length) return
    const group = new Group({
      width: 200,
      height: 200,
      id: 'group',
      x: 0,
      y: 0
    })

    let xMin = Number.MAX_SAFE_INTEGER
    let yMin = Number.MAX_SAFE_INTEGER
    let xMax = Number.MIN_SAFE_INTEGER
    let yMax = Number.MIN_SAFE_INTEGER
    activeNodes.forEach(node => {
      node.boundingRect.forEach(point => {
        if (point.x < xMin) {
          xMin = point.x
        }
        if (point.x > xMax) {
          xMax = point.x
        }
        if (point.y < yMin) {
          yMin = point.y
        }
        if (point.y > yMax) {
          yMax = point.y
        }
      })
      // 将节点从原来的父节点中删除
      if (node.parent) {
        node.parent.removeChild(node, false)
      }
      group.addChild(node)
    })
    group.width = xMax - xMin + 40
    group.height = yMax - yMin + 40
    group.position.x = xMin - 20
    group.position.y = yMin - 20
    this.canvas.addNode(group)
  }
}

export const createGroupInteraction = new CreateGroupInteraction()

export default createGroupInteraction