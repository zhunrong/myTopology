import Interaction from './Interaction'
import Canvas from '../core/Canvas'
import RectGroup from '../node/RectGroup'
import RectDomGroup from '../node/RectDomGroup'
import Node from '../graph/Node'

interface ICreateGroupInteraction {
  groupType: string
}
/**
 * 创建组
 */
export class CreateGroupInteraction extends Interaction {
  canvas!: Canvas
  // 父节点
  parentNode: Node | undefined
  groupType: string = 'rectCanvasGroup'
  constructor(options?: ICreateGroupInteraction) {
    super()
    if (options) {
      this.groupType = options.groupType
    }
  }
  onContextMenu = (canvas: Canvas, e: Event) => {
    const event = e as MouseEvent
    const activeNodes = canvas.getActiveNodes()
    canvas.contextMenu.hide()
    if (activeNodes.length) {
      this.parentNode = undefined
      const index = activeNodes.findIndex(node => {
        if (!node.parent) return false
        if (this.parentNode && this.parentNode !== node.parent) return true
        this.parentNode = node.parent
        return false
      })
      if (index === -1) {
        canvas.contextMenu.menu = [{
          label: '添加到组',
          command: 'addToGroup'
        }]
        canvas.contextMenu.show(event.clientX, event.clientY)
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

    const group = this.groupType === 'rectDomGroup' ? new RectDomGroup({
      width: 200,
      height: 200,
      id: Math.random(),
      x: 0,
      y: 0
    }) : new RectGroup({
      width: 200,
      height: 200,
      id: Math.random(),
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
      group.addChild(node)
    })
    group.width = xMax - xMin + 40
    group.height = yMax - yMin + 40
    group.position.x = xMin - 20
    group.position.y = yMin - 20
    if (this.parentNode) {
      this.parentNode.addChild(group)
      this.canvas.repaint = true
    } else {
      this.canvas.addNode(group)
    }
  }
}

export const createGroupInteraction = new CreateGroupInteraction()

export default createGroupInteraction