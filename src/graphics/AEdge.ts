import Canvas from './Canvas'
export interface IAEdgeOptions {
  zIndex?: number
}
export default abstract class AEdge {
  zIndex: number
  public isUpdate: boolean = true
  abstract readonly renderType: string
  constructor(options: IAEdgeOptions) {
    this.zIndex = options.zIndex || 0
  }
  abstract hitTest(canvas: Canvas): boolean
  abstract render(canvas: Canvas): void
}