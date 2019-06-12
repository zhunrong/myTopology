import DomNode, { IDomNodeOptions } from '../../graphics/core/DomNode'
// import Canvas from '../../graphics/Canvas'
import Vector2d from '../../utils/vector2d'
import Math2d from '../../utils/math2d'
import style from './node3.scss'
interface IOptions extends IDomNodeOptions {
  text: string
  id: number
}
export default class Node extends DomNode {
  containerEl: HTMLDivElement = document.createElement('div')
  text: string
  width: number = 150
  height: number = 100
  id: number
  constructor(options: IOptions) {
    super(options)
    this.text = options.text
    this.id = options.id
    this.containerEl.innerHTML = `
      <div class="title">标题</div>
      <div class="quota">
        <span>指标1</span>
        <span>指标2</span>
        <span>指标3</span>
        <span>指标4</span>
        <span>指标5</span>
        <span>指标6</span>
      </div>
    `
    this.containerEl.className = style.node
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
    Object.assign(this.containerEl.style, {
      borderColor: this.active ? 'red' : '#999',
      transform: `translate3d(${this.position.x}px,${this.position.y}px,0)`
    })

  }
}