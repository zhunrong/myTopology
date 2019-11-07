import Plugin from './Plugin'
import Canvas from '../core/Canvas'
import Node from '../graph/Node'
import Edge from '../graph/Edge'
import Vector2d from '../utils/Vector2d'
import style from './ContextMenu.less'

export interface IMenu {
  label: string
  command: string
  [key: string]: any
}

export class ContextMenu extends Plugin {
  position = new Vector2d()
  mounted = false
  container = document.createElement('div')
  onContextMenu: ((instance: this, target: Node | Edge | null, nodes: Node[], edges: Edge[]) => IMenu[]) | null = null
  menu: IMenu[] = []
  constructor() {
    super()
    this.container.className = style.menu
  }

  install(canvas: Canvas) {
    this.canvas = canvas
    this.canvas.wrapper.addEventListener('contextmenu', this.handleContextMenu)
    this.container.addEventListener('click', this.handleClick)
    document.addEventListener('click', this.hide)
  }

  destroy() {
    if (!this.canvas) return
    this.canvas.wrapper.removeEventListener('contextmenu', this.handleContextMenu)
    this.container.removeEventListener('click', this.handleClick)
    document.removeEventListener('click', this.hide)
    this.canvas = null
  }

  update() { }

  /**
   * 显示
   */
  show(menu: IMenu[] = [], left?: number, top?: number) {
    if (!menu.length) return
    this.menu = menu
    let { x, y } = this.position
    x = left !== undefined ? left : x
    y = top !== undefined ? top : y

    const html = this.menu.map(item => {
      return `<div class="item" data-command="${item.command}">${item.label}</div>`
    })
    this.container.innerHTML = html.join('')
    Object.assign(this.container.style, {
      left: `${x}px`,
      top: `${y}px`
    })
    document.body.appendChild(this.container)
  }

  /**
   * 隐藏
   */
  hide = () => {
    if (this.container.parentElement) {
      this.container.parentElement.removeChild(this.container)
    }
  }

  /**
   * 处理上下文菜单事件
   */
  handleContextMenu = (e: MouseEvent) => {
    if (!this.canvas || !this.onContextMenu) return
    this.position.x = e.clientX
    this.position.y = e.clientY
    const activeNodes = this.canvas.getActiveNodes()
    const activeEdges = this.canvas.getActiveEdges()
    let target = activeNodes.find(node => node.isPointIn()) || activeEdges.find(edge => edge.isPointIn()) || null
    this.menu = this.onContextMenu(this, target, activeNodes, activeEdges)
    this.hide()
    this.show(this.menu)
  }

  /**
   * 处理菜单点击事件
   */
  handleClick = (e: MouseEvent) => {
    if (!this.canvas) return
    e.stopPropagation()
    const target = e.target as HTMLElement
    if (!target) return
    if (target === this.container) return
    const command = target.dataset.command
    const menu = this.menu.find(item => item.command === command)
    this.canvas.eventEmitter.emit('canvas:menu', menu)
    this.hide()
  }
}

export default ContextMenu