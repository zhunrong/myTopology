import { Vector2d, RectDomNode, IRectDomNodeOptions } from '../../graphics/index'
import style from './node.less'
interface IOptions extends IRectDomNodeOptions {
  text: string
  id: number
}
export default class Node extends RectDomNode {
  text: string
  cacheText: string
  width: number = 146
  height: number = 53
  id: number
  constructor(options: IOptions) {
    super(options)
    this.cacheText = this.text = options.text
    this.id = options.id
  }
  get joinPoint() {
    const { x, y } = this.position
    return new Vector2d(x + this.width / 2, y + this.height / 2)
  }
  get vertexes(): Vector2d[] {
    const { x, y } = this.position
    return [
      this.position,
      new Vector2d(x + this.width, y),
      new Vector2d(x + this.width, y + this.height),
      new Vector2d(x, y + this.height)
    ]
  }
  render(): void {
    // if (this.cacheText !== this.text) {
    //   this.cacheText = this.text
    //   this.$el.innerHTML = this.text
    // }
    // Object.assign(this.$el.style, {
    //   // borderColor: this.active ? '#e96160' : '#29c1f8',
    //   zIndex: this.zIndex,
    //   transform: `translate3d(${this.position.x}px,${this.position.y}px,0)`
    // })
    this.$el.innerHTML = this.text
    this.$el.className = style.node
  }
  updateRender() { }
}