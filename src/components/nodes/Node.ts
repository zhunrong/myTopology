import { Vector2d, RectDomNode, IRectDomNodeOptions } from '../../graphics/index'
import style from './node.less'
interface IOptions extends IRectDomNodeOptions {
}
export default class Node extends RectDomNode {
  constructor(options: IOptions) {
    super(options)
    this.id = options.id
  }
  render(): void {
    this.$el.innerHTML = this.text
    this.$el.className = style.node
  }
  updateRender() { }
}