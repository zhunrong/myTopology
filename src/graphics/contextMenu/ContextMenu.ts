import style from './style.less'
import { Vector2d } from '../utils/vector2d'
import { Canvas } from '../core/Canvas'
const menu = [{
  label: '放大',
  command: 'zoomIn'
}, {
  label: '缩小',
  command: 'zoomOut'
}]
interface IMenu {
  label: string
  command: string
}
export class ContextMenu {
  mouseX: number = 0
  mouseY: number = 0
  canvas: Canvas
  mounted: boolean = false
  container: HTMLDivElement = document.createElement('div')
  menu: IMenu[] = menu
  constructor(canvas: Canvas) {
    this.canvas = canvas
    this.container.className = style.menu
    this.container.addEventListener('click', this.handleClick)
    document.addEventListener('click', this.handleDocumentClick)
  }
  destroy() {
    this.container.removeEventListener('click', this.handleClick)
    document.removeEventListener('click', this.handleDocumentClick)
    this.unmount()
  }
  handleClick = (e: MouseEvent) => {
    e.stopPropagation()
    const target = e.target as HTMLElement
    if (!target) return
    if (target === this.container) return
    const command = target.dataset.command
    switch (command) {
      case 'zoomIn':
        this.canvas.zoomIn(new Vector2d(this.mouseX, this.mouseY))
        break
      case 'zoomOut':
        this.canvas.zoomOut(new Vector2d(this.mouseX, this.mouseY))
        break
      default:
        this.canvas.eventEmitter.emit('canvas:menu', command)
    }
    this.hide()
  }
  handleDocumentClick = (e: MouseEvent) => {
    this.hide()
  }
  show(x: number, y: number) {
    this.mouseX = x
    this.mouseY = y
    let left = x
    let top = y
    Object.assign(this.container.style, {
      left: `${left}px`,
      top: `${top}px`
    })
    this.mount()
  }
  hide() {
    this.unmount()
  }
  mount() {
    if (this.mounted) return
    const menuList = [...this.menu]
    const html = menuList.map(item => {
      return `<div class="item" data-command="${item.command}">${item.label}</div>`
    })
    this.container.innerHTML = html.join('')
    document.body.appendChild(this.container)
    this.mounted = true
  }
  unmount() {
    if (!this.mounted) return
    document.body.removeChild(this.container)
    this.mounted = false
  }
}

export default ContextMenu