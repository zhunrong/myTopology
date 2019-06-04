export default abstract class AEdge {
  public isUpdate: boolean = true
  abstract hitTest(): boolean
  abstract render(parentNode: HTMLElement, canvasCtx: CanvasRenderingContext2D): void
}