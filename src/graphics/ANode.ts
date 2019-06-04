export default abstract class ANode {
  abstract hitTest(event: MouseEvent): boolean
  abstract render(parentNode: HTMLElement, canvasCtx: CanvasRenderingContext2D): void
}