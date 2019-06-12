import Canvas from '../Canvas'
import Vector2d from '../../utils/vector2d'
export interface IGraphOptions {
  visible?: boolean
  zIndex?: number
}
let graphId = 1
export default abstract class Graph {
  active: boolean = false
  // 是否可见
  visible: boolean
  // 渲染层级
  zIndex: number
  // 是否更新
  isUpdate: boolean = true
  // 图元id
  graphId: number = graphId++
  // 渲染类型
  abstract renderType: string
  constructor(options: IGraphOptions) {
    this.visible = options.visible || true
    this.zIndex = options.zIndex || 0
  }
  /**
   * 判断点是否在图形内
   * @param canvas 
   */
  abstract isPointIn(canvas: Canvas): boolean
  /**
   * 是否在一个矩形内
   * @param points 
   */
  abstract isInRect(points: Vector2d[]): boolean
  /**
   * 渲染到主画布上
   * @param canvas 
   */
  abstract render(canvas: Canvas): void
}