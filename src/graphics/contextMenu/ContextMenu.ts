import style from './style.scss'
const menu = [{
  label: '选项一',
  value: '1',
  active: false
}, {
  label: '选项二',
  value: '2',
  active: false
}]
export default class ContextMenu {
  mounted: boolean = false
  container: HTMLDivElement = document.createElement('div')
  constructor() {
    this.container.className = style.menu
    this.container.innerHTML=`
      <div class="item">选项一</div>
      <div class="item">选项二</div>
    `
  }
  show(x: number, y: number) {
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
    document.body.appendChild(this.container)
  }
  unmount() {
    if (!this.mounted) return
    document.body.removeChild(this.container)
  }
}