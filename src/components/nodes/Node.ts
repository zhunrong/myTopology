import DomNode, { IDomNodeOptions } from '../../graphics/core/DomNode'
// import Canvas from '../../graphics/Canvas'
import Vector2d from '../../utils/vector2d'
import Math2d from '../../utils/math2d'
interface IOptions extends IDomNodeOptions {
  text: string
}
export default class Node extends DomNode {
  containerEl: HTMLDivElement = document.createElement('div')
  text: string
  width: number = 50
  height: number = 50
  constructor(options: IOptions) {
    super(options)
    this.text = options.text
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
      width: '50px',
      height: '50px',
      fontSize: '12px',
      lineHeight: '50px',
      textAlign: 'center',
      backgroundColor: 'rgb(204, 204, 204)',
      borderRadius: '25px',
      position: 'absolute',
      display: 'block',
      transform: `translate3d(${this.position.x}px,${this.position.y}px,0)`
    })
    this.containerEl.innerText = this.text
  }
}