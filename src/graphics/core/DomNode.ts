import Node, { INodeOptions } from './Node'
import Canvas from '../Canvas'
export interface IDomNodeOptions extends INodeOptions { }

export default abstract class DomNode extends Node {
  renderType: string = 'DOM'
  mounted: boolean = false
  abstract containerEl: HTMLElement
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
    canvas.root.appendChild(this.containerEl)
  }
  /**
   * 卸载
   * @param canvas 
   */
  unmount(canvas: Canvas): void {
    if (!this.mounted) return
    this.mounted = false
    canvas.root.removeChild(this.containerEl)
  }
  isPointIn(canvas: Canvas): boolean {
    if (!canvas.nativeEvent) return false
    let el = canvas.nativeEvent.target as HTMLElement
    let isHit = false
    while (el && !isHit) {
      if (el === this.containerEl) {
        isHit = true
      }
      el = el.parentElement as HTMLElement
    }
    return isHit
  }
}