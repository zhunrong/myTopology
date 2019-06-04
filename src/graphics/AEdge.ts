export default abstract class AEdge {
  abstract hitTest(): boolean
  abstract render(parentNode: HTMLElement, canvasCtx: CanvasRenderingContext2D): void
}