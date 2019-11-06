import RectCanvasNode, { IRectCanvasNodeOptions } from '../../graphics/node/RectCanvasNode'
import { imgLoad } from '../../graphics/utils/utils'

const deviceMap: { [key: string]: string } = {
  '主机1': require('../../assets/device/主机1.png'),
  '主机2': require('../../assets/device/主机2.png'),
  '主机3': require('../../assets/device/主机2.png'),
  '服务器': require('../../assets/device/服务器.png'),
  '交换机1': require('../../assets/device/交换机1.png'),
  '交换机2': require('../../assets/device/交换机2.png'),
}

interface IOptions extends IRectCanvasNodeOptions {
  deviceType?: string
}

export class CanvasNode extends RectCanvasNode {
  deviceType: string
  constructor(options: IOptions) {
    super(options)
    this.deviceType = options.deviceType || '主机1'
    this.width = options.width || 80
    this.height = options.height || 80
  }

  async render(ctx?: CanvasRenderingContext2D) {
    if (!this.canvas) return
    const width = this.getWidth()
    const height = this.getHeight()
    ctx = ctx || this.cacheCanvas.getContext('2d') as CanvasRenderingContext2D
    this.cacheCanvas.width = width
    this.cacheCanvas.height = height

    ctx.rect(0, 0, width, height)
    ctx.fillStyle = '#ccc'
    ctx.fill()

    const img = await imgLoad(deviceMap[this.deviceType])
    img.width = img.width * (40 / img.height)
    img.height = 40
    ctx.drawImage(img, (width - img.width) / 2, (height - img.height) / 2, img.width, img.height)
    this.canvas.repaint = true
  }
}

export default CanvasNode