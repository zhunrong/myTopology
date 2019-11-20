import Layout, { Transport } from './Layout'
import Vector2d from '../utils/Vector2d'

class ForceTransport extends Transport {
  /**
   * 质量
   */
  M = 1
  /**
   * 电荷
   */
  Q = 32
  /**
   * 受力
   */
  force = new Vector2d()
  /**
   * 加速度
   */
  accelerate = new Vector2d()

  update() {
    if (!this.node) return
    this.accelerate.copy(this.force).scale(1 / this.M)
    this.speed.add(this.accelerate)
    this.node.translate(this.speed)
  }
}

/**
 * 节点中心最小距离
 */
const MIN_DISTANCE_BETWEEN_NODE = 30

/**
 * 力导布局
 */
export class ForceLayout extends Layout {
  transports: ForceTransport[] = []
  /**
   * 弹性系数
   */
  elasticity = 0.01
  /**
   * 中心吸引系数
   */
  attractive = 0.005
  /**
   * 斥力系数
   */
  repulsion = 20
  /**
   * 阻尼系数
   */
  damping = 0.1
  /**
   * 连线自然长度
   */
  edgeLength = 100
  /**
   * 布局完成?
   */
  complete = false
  /**
   * 布局动画?
   */
  animate = true
  layout() {
    this.canvas.layout = this
    const nodes = this.canvas.rootNode.children
    const count = nodes.length
    if (count === 0) return
    this.complete = false
    this.transports = nodes.map(node => {
      const transport = new ForceTransport()
      transport.node = node
      return transport
    })
    this.canvas.repaint = true
  }

  update(): boolean {
    if (this.complete) return false
    this.calculateForce()
    let complete = true
    this.transports.forEach(transport => {
      transport.update()
      if (complete) {
        complete = complete && transport.speed.magnitude < 0.1
      }
    })
    this.complete = complete
    this.canvas.optimizeNode()
    return this.animate ? true : this.update()
  }

  /**
   * 计算受力
   */
  calculateForce() {

    const canvasCenter = new Vector2d(this.canvas.canvasWidth / 2, this.canvas.canvasHeight / 2)

    this.transports.forEach(source => {
      const sourceNode = source.node!
      source.force.x = 0
      source.force.y = 0
      /**
       * 1.库仑力
       * F = (Q1 * Q2) / (distance ** 2) * k 
       */
      this.transports.forEach(target => {
        if (source === target) return
        const targetNode = target.node!
        const targetToSource = sourceNode.centerPoint.substract(targetNode.centerPoint)
        let distance = targetToSource.magnitude
        distance = distance < MIN_DISTANCE_BETWEEN_NODE ? MIN_DISTANCE_BETWEEN_NODE : distance
        const forceSize = (source.Q * target.Q) / distance ** 2 * this.repulsion
        const coulombForce = targetToSource.normalize().scale(forceSize)
        source.force.add(coulombForce)
      })

      /**
       * 2.拉力
       * F = L * K
       */
      sourceNode.edges.forEach(edge => {
        let targetNode = edge.sourceNode === sourceNode ? edge.targetNode : edge.sourceNode
        // 鼠标虚拟节点
        if (targetNode.renderType === 'NONE') return
        const sourceToTarget = targetNode.centerPoint.substract(sourceNode.centerPoint)
        let L = sourceToTarget.magnitude
        L = L > this.edgeLength ? L - this.edgeLength : this.edgeLength
        const forceSize = L * this.elasticity
        const pullForce = sourceToTarget.normalize().scale(forceSize)
        source.force.add(pullForce)
      })

      /**
       * 阻尼力
       * F = V * K
       */
      {
        const forceSize = source.speed.magnitude * this.damping
        const dampingForce = source.speed.clone().normalize().scale(-forceSize)
        source.force.add(dampingForce)
      }

      /**
       * 3.聚向画布中心的力
       * F = d * K
       */
      const sourceToCenter = canvasCenter.clone().substract(sourceNode.centerPoint)
      const forceSize = sourceToCenter.magnitude * this.attractive
      const F = sourceToCenter.normalize().scale(forceSize)
      source.force.add(F)
    })
  }

}

export default ForceLayout