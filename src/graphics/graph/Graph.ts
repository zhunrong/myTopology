import { Vector2d } from '../utils/vector2d'
import { Canvas } from '../core/Canvas'

export interface IStyle {
  color: string
  activeColor: string
  [key: string]: any
}

export interface IGraphOptions {
  visible?: boolean
  zIndex?: number
  data?: any
}
let graphId = 1

export abstract class Graph {
  canvas: Canvas | undefined
  active: boolean = false
  _visible: boolean
  /**
   * 可见性
   */
  get visible(): boolean {
    return this._visible
  }
  set visible(visible: boolean) {
    this._visible = visible
  }
  /**
   * 在鹰眼地图上是否可见
   */
  get miniMapVisible(): boolean {
    return this.visible
  }
  // 渲染层级
  zIndex: number
  // 是否更新
  isUpdate: boolean = true
  // 图元id
  graphId: number = graphId++

  /**
   * 用户数据
   */
  data: any

  /**
   * 样式属性
   */
  style: IStyle = {
    color: '#29c1f8',
    activeColor: '#e96160'
  }

  // 渲染签名,用于判断在同一个渲染周期内，图元是否已渲染
  renderSign: any
  constructor(options: IGraphOptions) {
    this._visible = options.visible || true
    this.zIndex = options.zIndex || 0
    this.data = options.data
  }

  /**
   * 判断点是否在图形内
   * @param canvas 
   */
  abstract isPointIn(): boolean

  /**
   * 是否在一个矩形内
   * @param points 
   */
  isInRect(points: Vector2d[]): boolean {
    return false
  }

  /**
   * 是否被指定矩形包围
   * @param rect 
   */
  isWrappedInRect(rect: Vector2d[]): boolean { return false }

  /**
   * 是否被指定圆包围
   */
  isWrappedInCircle(): boolean { return false }

  /**
   * 绘制缩略图
   */
  abstract drawThumbnail(ctx: CanvasRenderingContext2D): void

  /**
   * hook:渲染时调用
   */
  render(ctx?: CanvasRenderingContext2D) { }

  /**
   * hook:更新时调用
   */
  update(ctx?: CanvasRenderingContext2D) { }

  /**
   * hook:销毁时调用
   */
  destroy() { }

  /**
   * hook:销毁前调用
   */
  beforeDestroy() { }

  /**
   * 导出配置json
   */
  exportJson(): any { }
}

export default Graph