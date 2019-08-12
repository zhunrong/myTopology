import Node, { INodeOptions } from './Node'
export interface IDomNodeOptions extends INodeOptions { }

export abstract class DomNode extends Node {
  renderType: string = 'DOM'
  mounted: boolean = false
  $el: HTMLDivElement = document.createElement('div')
  constructor(options: IDomNodeOptions) {
    super(options)
  }
  /**
   * 挂载到文档中
   */
  mount(): void {
    if (this.mounted || !this.canvas) return
    this.mounted = true
    this.canvas.domCanvas.appendChild(this.$el)
  }
  /**
   * 卸载
   */
  unmount(): void {
    if (!this.mounted || !this.canvas) return
    this.mounted = false
    this.canvas.domCanvas.removeChild(this.$el)
  }
  isPointIn(): boolean {
    const { canvas } = this
    if (!canvas) return false
    if (!canvas.nativeEvent) return false
    let el = canvas.nativeEvent.target as HTMLElement
    let isHit = false
    while (el && !isHit) {
      if (el === this.$el) {
        isHit = true
      }
      el = el.parentElement as HTMLElement
    }
    return isHit
  }
  /**
   * 更新节点位置
   */
  updatePosition() {
    const { x, y } = this.position
    this.$el.style.transform = `translate3d(${x}px,${y}px,0)`
  }

  destroy() {
    this.beforeDestroy()
    this.unmount()
  }
}

export default DomNode