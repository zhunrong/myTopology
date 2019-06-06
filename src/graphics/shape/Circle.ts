import ANode, { IANodeOptions } from '../ANode'
import Canvas from '../Canvas'
import Vector2d from '../../utils/vector2d';
import Math2d from '../../utils/math2d'
export interface ICircleOptions extends IANodeOptions {
  radius: number
}
export default class Circle extends ANode {
  readonly shape: string = 'circle'
  readonly renderType: string = 'canvas'
  radius: number
  constructor(options: ICircleOptions) {
    super(options)
    this.radius = options.radius
  }
  get vertexes(): Vector2d[] {
    const { x, y } = this.position
    return [
      this.position,
      new Vector2d(x + this.radius * 2, y),
      new Vector2d(x + this.radius * 2, y + this.radius * 2),
      new Vector2d(x, y + this.radius * 2)
    ]
  }
  get joinPoint() {
    return this.position.add(new Vector2d(25, 25))
  }
  /**
   * 是否在可视区域
   * @param points 
   */
  isInVisibleRect(points: Vector2d[]): boolean {
    const vertexes = this.vertexes
    for (let i = 0; i < vertexes.length; i++) {
      const P = vertexes[i]
      if (Math2d.isPointInPolygon(P, points)) {
        return true
      }
    }
    return false
  }
  hitTest(canvas: Canvas) {
    return false
  }
  render(canvas: Canvas) {

  }
}