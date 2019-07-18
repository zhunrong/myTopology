import { Vector2d } from '../utils/vector2d'
import { Canvas } from '../core/Canvas'
export interface IGraphOptions {
  visible?: boolean
  zIndex?: number
  data?: any
}
let graphId = 1
export abstract class Graph {
  canvas: Canvas | undefined
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
  // 携带的数据
  data: any
  constructor(options: IGraphOptions) {
    this.visible = options.visible || true
    this.zIndex = options.zIndex || 0
    this.data = options.data
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

export default Graph