import Vector2d from '../utils/vector2d'
import Canvas from './Canvas'
export interface IANodeOptions {
  x: number
  y: number
  zIndex?: number
}
export default abstract class ANode {
  zIndex: number
  abstract readonly renderType: string
  // 是否要更新
  public isUpdate: boolean = true
  private _visible: boolean = true
  private _position: Vector2d
  constructor(options: IANodeOptions) {
    this._position = new Vector2d(options.x, options.y)
    this.zIndex = options.zIndex || 0
  }
  abstract isInVisibleRect(points: Vector2d[]): boolean
  abstract hitTest(canvas: Canvas): boolean
  abstract render(canvas: Canvas): void
  abstract get joinPoint(): Vector2d
  // 位置
  get position() {
    return this._position
  }
  set position(value: Vector2d) {
    this._position = value
    this.isUpdate = true
  }
  // 可见性
  get visible() {
    return this._visible
  }
  set visible(value: boolean) {
    this._visible = value
    this.isUpdate = true
  }
}