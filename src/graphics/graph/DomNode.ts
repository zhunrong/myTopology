import Node, { INodeOptions } from './Node'
import { Canvas } from '../core/Canvas'
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
   * @param canvas 
   */
  mount(canvas: Canvas): void {
    if (this.mounted) return
    this.mounted = true
    canvas.domCanvas.appendChild(this.$el)
  }
  /**
   * 卸载
   * @param canvas 
   */
  unmount(canvas: Canvas): void {
    if (!this.mounted) return
    this.mounted = false
    canvas.domCanvas.removeChild(this.$el)
  }
  isPointIn(): boolean {
    const {canvas} = this
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
}

export default DomNode