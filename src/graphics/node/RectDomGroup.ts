import RectDomNode, { IRectDomNodeOptions } from './RectDomNode'

export interface IRectDomGroupOptions extends IRectDomNodeOptions {
  isExpanded?: boolean
}
export class RectDomGroup extends RectDomNode {
  // 是组
  isGroup = true
  // 默认可调接尺寸
  canResize = true

  constructor(options: IRectDomGroupOptions) {
    super(options)
    if (typeof options.isExpanded === 'boolean') {
      this.isExpanded = options.isExpanded
    }
  }

  render() {
    this.$el.innerHTML = `<div style="height:100%;
                                      display:flex;
                                      align-items:center;
                                      justify-content:center;
                                      border:1px solid #066df2;
                                      box-sizing:border-box;">
                            ${this.isExpanded?'':'...'}
                          </div>`
  }
}

export default RectDomGroup