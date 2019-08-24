import Node, { INodeOptions } from './Node'

export interface ICanvasNodeOptions extends INodeOptions { }
export abstract class CanvasNode extends Node {
  renderType: string = "CANVAS"
  cacheCanvas: HTMLCanvasElement = document.createElement('canvas')
  constructor(options: ICanvasNodeOptions) {
    super(options)
  }
  destroy() {
    this.removeAllChild()
    this.beforeDestroy()
  }
}

export default CanvasNode