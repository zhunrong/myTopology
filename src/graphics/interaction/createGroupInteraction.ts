import Interaction from './Interaction'
import Canvas from '../core/Canvas'
import RectDomGroup from '../node/RectDomGroup'
import RectCanvasGroup from '../node/RectCanvasGroup'
import Node from '../graph/Node'
import ContextMenu from '../plugin/ContextMenu'
import { isRectNode, isCircleNode } from '../utils/utils'

interface ICreateGroupInteraction {
  onCreate: () => Node
}
/**
 * 创建组
 */
export class CreateGroupInteraction extends Interaction {
  canvas!: Canvas
  // 父节点
  parentNode: Node | undefined
  onCreate: () => Node
  constructor(onCreate?: () => Node) {
    super()
    this.onCreate = onCreate || (() => {
      if (this.canvas.renderType === 'CANVAS') {
        return new RectCanvasGroup({
          id: Math.random()
        })
      } else {
        return new RectDomGroup({
          id: Math.random()
        })
      }
    })
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
    const activeNodes = this.canvas.getActiveNodes()
    if (!activeNodes.length) return

    const group = this.onCreate()

    activeNodes.forEach(node => group.addChild(node))
    const { xMin, yMin, xMax, yMax } = getActiveNodesBoundingRect(activeNodes)

    if (isRectNode(group)) {
      group.width = xMax - xMin + 40
      group.height = yMax - yMin + 40
    }

    // to be continue
    if (isCircleNode(group)) { }

    group.position.x = xMin - 20
    group.position.y = yMin - 20
    if (this.parentNode) {
      this.parentNode.addChild(group)
      this.canvas.setNodeTop(group)
      this.canvas.repaint = true
    } else {
      this.canvas.addNode(group)
    }
  }

  handleEvent(canvas: Canvas, event: Event) {
    switch (event.type) {
      case 'contextmenu':
        this.onContextMenu(canvas, event)
        break
    }
  }
}

function getActiveNodesBoundingRect(activeNodes: Node[]) {
  let xMin = Number.MAX_SAFE_INTEGER
  let yMin = Number.MAX_SAFE_INTEGER
  let xMax = Number.MIN_SAFE_INTEGER
  let yMax = Number.MIN_SAFE_INTEGER
  activeNodes.forEach(node => {
    node.boundingRect.forEach(point => {
      xMin = Math.min(xMin, point.x)
      yMin = Math.min(yMin, point.y)
      xMax = Math.max(xMax, point.x)
      yMax = Math.max(yMax, point.y)
    })
  })
  return { xMin, yMin, xMax, yMax }
}

export const createGroupInteraction = new CreateGroupInteraction()

export default CreateGroupInteraction