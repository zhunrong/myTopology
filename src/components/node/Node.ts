import { IRectDomNodeOptions } from '../../graphics/index'
import RectDomNode from '../../graphics/node/RectDomNode'
import style from './node.less'

const deviceMap: { [key: string]: string } = {
  '主机1': require('../../assets/device/主机1.png'),
  '主机2': require('../../assets/device/主机2.png'),
  '主机3': require('../../assets/device/主机2.png'),
  '服务器': require('../../assets/device/服务器.png'),
  '交换机1': require('../../assets/device/交换机1.png'),
  '交换机2': require('../../assets/device/交换机2.png'),
}

interface IOptions extends IRectDomNodeOptions {
  deviceType?: string
}
export default class Node extends RectDomNode {
  deviceType: string
  constructor(options: IOptions) {
    super(options)
    this.deviceType = options.deviceType || '主机1'
    this.width = options.width || 80
    this.height = options.height || 80
    this.$el.addEventListener('mouseenter', this.handleMouseEnter)
    this.$el.addEventListener('mouseleave', this.handleMouseLeave)
  }
  render(): void {
    this.$el.innerHTML = `
      <div class="${style.node}">
        <img draggable="false" src="${deviceMap[this.deviceType]}" />
        <span>${this.text}</span>
        <div class="tool-tip">
          this is tool tip!!!
        </div>
      </div>
    `
  }

  beforeDestroy() {
    console.log('beforeDestroy')
    this.$el.removeEventListener('mouseenter', this.handleMouseEnter)
    this.$el.removeEventListener('mouseleave', this.handleMouseLeave)
  }

  handleMouseEnter = () => {
    this.$el.style.zIndex = '1'
  }
  handleMouseLeave = () => {
    this.$el.style.zIndex = '0'
  }
}