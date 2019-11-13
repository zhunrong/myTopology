import Layout from './Layout'
import Vector2d from '../utils/Vector2d'
import Node from '../graph/Node'
import { globalClock } from '../core/Clock'

class Transport {
  destination = new Vector2d()
  distance = new Vector2d()
  speed = new Vector2d()
  node: Node | null = null
  duration = 0
  pass = 0
  complete = false
  update() {
    if (!this.node || this.complete) return
    const timeDelta = globalClock.getDelta()
    this.pass += timeDelta
    const timeRemain = this.duration > this.pass ? this.duration - this.pass : 0
    this.distance.copy(this.destination).substract(this.node.centerPoint)
    if (timeDelta < timeRemain) {
      if (this.distance.magnitude > 1) {
        this.speed.copy(this.distance).scale(1 / timeRemain * timeDelta)
        this.node.translate(this.speed)
      } else {
        this.complete = true
      }
    } else {
      this.node.translate(this.distance)
      this.complete = true
    }
  }
}

/**
 * 环形布局
 */
export class CircularLayout extends Layout {
  center = new Vector2d()
  radius = 0
  clockwise = true
  startAngle = 0
  endAngle = Math.PI * 1.5
  transports: Transport[] = []
  duration = 0
  gap = 10

  layout() {
    this.canvas.layout = this
    const count = this.canvas.rootNode.children.length
    if (count === 0) return
    this.transports = []
    const origin = new Vector2d(this.canvas.canvasWidth / 2, this.canvas.canvasHeight / 2)
    const totalAngle = this.endAngle - this.startAngle
    const angleInterval = totalAngle / count

    if /* 圆形或扇形 */ (totalAngle <= Math.PI * 2 || true) {
      let radius = this.radius
      let maxCircumradius = 0
      if /* 自动计算半径 */ (this.radius <= 0) {
        let length = 0
        this.canvas.rootNode.children.forEach(node => {
          length += node.circumradius * 2 + this.gap
          if (node.circumradius > maxCircumradius) {
            maxCircumradius = node.circumradius
          }
        })
        // R(1) = radius + 0 = radius + maxCircumradius * 2 * 0
        // R(2) = R(0) + maxCircumradius * 2 = radius + maxCircumradius * 2 * 1
        // R(3) = R(1) +  maxCircumradius * 2 = radius + maxCircumradius * 2 * 2
        // R(n) = R(n-1) + maxCircumradius * 2 = radius + maxCircumradius * 2 * (n - 1)
        // F(n-1) = R(1) + R(2) + ... R(n-1) = radius * (n-1) + maxCircumradius * (n-2) * (n-1)
        // F(n-1) * 2*PI + R(n) * m = length
        // radius * (n-1) * 2*PI + maxCircumradius * (n-2) * (n-1) * 2*PI + radius * m + maxCircumradius * 2 * (n - 1) * m = length
        // radius = (length - (maxCircumradius * (n-2) * (n-1) * 2*PI) - (maxCircumradius * 2 * (n - 1) * m))/((n-1)*2*PI + m)
        const n = Math.ceil(totalAngle / (Math.PI * 2))
        const m = totalAngle % (Math.PI * 2)
        radius = length / totalAngle
      }
      let rotateRadian = this.startAngle
      this.canvas.rootNode.children.forEach((node, index) => {
        const halfRadian = (node.circumradius + this.gap / 2) / radius
        // 先加上半个弧度，表示节点中心对应得旋转弧度
        rotateRadian += this.clockwise ? halfRadian : -halfRadian
        const v = Vector2d.xAxis.clone().scale(radius).rotate(rotateRadian).add(origin)
        rotateRadian += this.clockwise ? halfRadian : -halfRadian
        const transport = new Transport()
        transport.duration = this.duration
        transport.node = node
        transport.destination = v
        this.transports.push(transport)
      })
    } /* 螺旋形 */ else {
      // const radius = 50
      // this.canvas.rootNode.children.forEach((node, index) => {
      //   const rotateRadian = this.startAngle + (this.clockwise ? index * angleInterval : -index * angleInterval)
      //   const v = Vector2d.xAxis.clone().scale(radius + index * 20).rotate(rotateRadian).add(origin)
      //   const transport = new Transport()
      //   transport.duration = this.duration
      //   transport.node = node
      //   transport.destination = v
      //   this.transports.push(transport)
      // })
    }
  }

  update() {
    const activeTrans = this.transports.filter(item => !item.complete)
    if (activeTrans.length) {
      this.canvas.optimizeNode()
      activeTrans.forEach(transport => transport.update())
    }
  }

}

export default CircularLayout