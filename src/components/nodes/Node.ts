import { DomNode, IDomNodeOptions, Vector2d, Math2d } from '../../graphics/index'
import style from './node.less'
interface IOptions extends IDomNodeOptions {
  text: string
  id: number
}
export default class Node extends DomNode {
  containerEl: HTMLDivElement = document.createElement('div')
  text: string
  width: number = 80
  height: number = 80
  id: number
  constructor(options: IOptions) {
    super(options)
    this.text = options.text
    this.id = options.id
    this.containerEl.className = style.node
    this.containerEl.innerHTML = this.text
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
  isInRect(points: Vector2d[]): boolean {
    const vertexes = this.vertexes
    // for (let i = 0; i < vertexes.length; i++) {
    //   const P = vertexes[i]
    //   if (Math2d.isPointInPolygon(P, points)) {
    //     return true
    //   }
    // }
    // return false
    // 左
    if (points[0].x > vertexes[2].x) return false
    // 右
    if (points[2].x < vertexes[0].x) return false
    // 上
    if (points[0].y > vertexes[2].y) return false
    // 下
    if (points[2].y < vertexes[0].y) return false
    return true
  }
  render(): void {
    // this.containerEl.innerHTML = this.text
    Object.assign(this.containerEl.style, {
      // borderColor: this.active ? '#e96160' : '#29c1f8',
      transform: `translate3d(${this.position.x}px,${this.position.y}px,0)`
    })

  }
}