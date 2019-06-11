import Node, { INodeOptions } from './Node'
export interface IVirtualNodeOptions extends INodeOptions { }
export default class VirtualNode extends Node {
  renderType: string = 'NONE'
  constructor(options: IVirtualNodeOptions) {
    super(options)
  }
  get joinPoint() {
    return this.position
  }
  isInRect() { return false }
  isPointIn() { return false }
  render() { }
}