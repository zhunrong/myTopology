import Vector2d from '../utils/vector2d'
export default abstract class ANode {
  public isUpdate: boolean = true
  private _position: Vector2d = new Vector2d(0, 0)
  abstract hitTest(event: MouseEvent): boolean
  abstract render(parentNode: HTMLElement, canvasCtx: CanvasRenderingContext2D): void
  get position() {
    return this._position
  }
  set position(p: Vector2d) {
    this._position = p
    this.isUpdate = true
  }
}