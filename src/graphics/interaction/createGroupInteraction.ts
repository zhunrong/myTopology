import Interaction from './Interaction'
import Canvas from '../core/Canvas'
import RectGroup from '../node/RectCanvasGroup'
import Node from '../graph/Node'
import ContextMenu from '../plugin/ContextMenu'

interface ICreateGroupInteraction {
  ctor: any
}
/**
 * 创建组
 */
export class CreateGroupInteraction extends Interaction {
  canvas!: Canvas
  // 父节点
  parentNode: Node | undefined
  ctor: any = RectGroup
  constructor(options?: ICreateGroupInteraction) {
    super()
    if (options) {
      this.ctor = options.ctor
    }
  }
  onContextMenu = (canvas: Canvas, e: Event) => {
    const contextMenu = canvas.plugins.find(plugin => plugin instanceof ContextMenu) as ContextMenu | undefined
    if (!contextMenu) return
    const activeNodes = canvas.getActiveNodes()
    const event = e as MouseEvent
    if (activeNodes.length) {
      this.parentNode = undefined
      const index = activeNodes.findIndex(node => {
        if (!node.parent) return false
        if (this.parentNode && this.parentNode !== node.parent) return true
        this.parentNode = node.parent
        return false
      })
      if (index === -1) {
        contextMenu.show([
          {
            label: '添加到组',
            command: 'addToGroup'
          }
        ], event.clientX, event.clientY)
      }
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
  onAddToGroup = (menu: any) => {
    if (menu.command !== 'addToGroup') return
    // const activeNodes = this.canvas.rootNode.children.filter(node => node.active)
    const activeNodes = this.canvas.getActiveNodes()
    if (!activeNodes.length) return

    const group = new this.ctor({ id: Math.random() })

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
      group.addChild(node)
    })
    if (this.ctor.shape = 'rect') {
      group.width = xMax - xMin + 40
      group.height = yMax - yMin + 40
    } else {

    }
    group.position.x = xMin - 20
    group.position.y = yMin - 20
    if (this.parentNode) {
      this.parentNode.addChild(group)
      this.canvas.repaint = true
    } else {
      this.canvas.addNode(group)
    }
  }

  handleEvent(canvas:Canvas,event:Event){
    switch(event.type){
      case 'contextmenu':
        this.onContextMenu(canvas,event)
        break
    }
  }
}

export const createGroupInteraction = new CreateGroupInteraction()

export default CreateGroupInteraction