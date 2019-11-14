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

const PI2 = Math.PI * 2

/**
 * 环形布局
 */
export class CircularLayout extends Layout {
  center = new Vector2d()
  clockwise = true
  radius = 0
  startAngle = 0
  endAngle = Math.PI * 2
  transports: Transport[] = []
  duration = 0
  gap = 10
  nodeRadius = 50

  layout() {
    this.canvas.layout = this
    const count = this.canvas.rootNode.children.length
    if (count === 0) return
    this.transports = []
    const origin = new Vector2d(this.canvas.canvasWidth / 2, this.canvas.canvasHeight / 2)
    let totalAngle = Math.abs(this.endAngle - this.startAngle)
    // 第一圈半径
    let radius = this.radius
    let angleInterval = 0

    // 圈数
    let rounds = 1
    // 每圈节点数
    let num = 0
    if /* 圈数大于1 */ (totalAngle > PI2) {
      rounds = Math.ceil(totalAngle / PI2)
      num = Math.floor(count / (totalAngle / PI2))
      angleInterval = PI2 / num
      radius = (this.nodeRadius + this.gap / 2) / Math.sin(angleInterval / 2)
    } /* 圈数等于1 */ else if (totalAngle > 0) {
      angleInterval = totalAngle / count
      radius = (this.nodeRadius + this.gap / 2) / Math.sin(angleInterval / 2)
      num = Math.floor(PI2 / angleInterval)
      rounds = 1
    } /* 给定布局半径 */ else if (radius) {
      angleInterval = Math.asin((this.nodeRadius + this.gap / 2) / radius) * 2
      totalAngle = angleInterval * count
      num = Math.floor(PI2 / angleInterval)
      rounds = Math.ceil(totalAngle / PI2)
    } else {
      totalAngle = PI2
      angleInterval = totalAngle / count
      radius = (this.nodeRadius + this.gap / 2) / Math.sin(angleInterval / 2)
      rounds = 1
      num = Math.floor(PI2 / angleInterval)
    }

    if /* 自动计算半径 */ (radius <= 0) {
      radius = (this.nodeRadius + this.gap / 2) / Math.sin(angleInterval / 2)
    }
    let rotateRadian = this.startAngle
    this.canvas.rootNode.children.forEach((node, index) => {
      let halfRadian = 0
      let curRound = 0
      // 判断是否最后一圈
      if ((index + 1) > (rounds - 1) * num) {
        const lastNum = count - num * (rounds - 1)
        halfRadian = (totalAngle % PI2 || PI2) / lastNum / 2
        rotateRadian = this.startAngle + ((index + 1 - num * (rounds - 1)) % lastNum * 2 + 1) * halfRadian
        curRound = rounds
      } else {
        halfRadian = angleInterval / 2
        rotateRadian = (index % num) * angleInterval + halfRadian + this.startAngle
        curRound = Math.floor((index + 1) / num)
      }
      // 先加上半个弧度，表示节点中心对应得旋转弧度
      // rotateRadian += this.clockwise ? halfRadian : -halfRadian
      const r = radius + (curRound - 1) * (this.nodeRadius * 2 + this.gap)
      const v = Vector2d.xAxis.clone().scale(r).rotate(rotateRadian).add(origin)
      // rotateRadian += this.clockwise ? halfRadian : -halfRadian
      const transport = new Transport()
      transport.duration = this.duration
      transport.node = node
      transport.destination = v
      this.transports.push(transport)
    })
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