import { Vector2d, RectDomNode, IRectDomNodeOptions } from '../../graphics/index'
import style from './node.less'
interface IOptions extends IRectDomNodeOptions {
}
export default class Node extends RectDomNode {
  constructor(options: IOptions) {
    super(options)
  }
  render(): void {
    // this.$el.innerHTML = this.text
    // this.$el.className = style.node
    this.$el.innerHTML = `
      <div class="${style.node}">${this.text}</div>
    `
  }
}