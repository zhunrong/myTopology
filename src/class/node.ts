import Vector2d from '../utils/vector2d'
interface INodeOptions {
  id: string
  name: string
  M?: number
  Q?: number
  position?: Vector2d
  rootNode?: boolean
  // 隐藏，不用渲染
  hidden?: boolean
  // 位置固定
  fixed?: boolean
  inited?: boolean
}

const CENTER = new Vector2d(window.innerWidth / 2, window.innerHeight / 2)

export default class Node {
  readonly id: string
  name: string
  M: number
  Q: number
  force: Vector2d = new Vector2d(0, 0)
  acceleration: Vector2d = new Vector2d(0, 0)
  velocity: Vector2d = new Vector2d(0, 0)
  position: Vector2d
  source: Set<Node> = new Set()
  target: Set<Node> = new Set()
  rootNode: boolean
  hidden: boolean
  fixed: boolean
  inited: boolean
  renderCount: number = 0
  renderId: number = 0
  expanded: boolean = false
  constructor(options: INodeOptions) {
    this.id = options.id
    this.name = options.name
    this.M = options.M || 1
    this.Q = options.Q || 7
    this.position = options.position || new Vector2d(0, 0)
    this.rootNode = options.rootNode || false
    this.hidden = options.hidden || false
    this.fixed = options.fixed || false
    this.inited = options.inited || false
  }
  /**
   * 计算加速度
   */
  calculateAcceleration() {
    this.acceleration = this.force.scale(1 / this.M)
  }
  /**
   * 计算速度
   * @param unitTime 
   */
  calculateVelocity(unitTime: number) {
    this.velocity = this.velocity.add(this.acceleration.scale(unitTime))
  }
  /**
   * 计算位置
   * @param unitTime 
   */
  calculatePosition(unitTime: number) {
    this.position = this.position.add(this.velocity.scale(unitTime))
  }
  /**
   * 是否为叶子节点
   */
  isLeaf(): boolean {
    return this.source.size + this.target.size <= 1
  }
  /**
   * 渲染
   */
  render(renderId: number, canvasCtx?: CanvasRenderingContext2D) {
    this.renderCount++
    this.renderId = renderId
    if (this.renderCount > 90 && !this.expanded) {
      this.expand()
    }
    if (canvasCtx) {
      const { x, y } = this.position
      canvasCtx.beginPath()
      canvasCtx.arc(x, y, 30, 0, Math.PI * 2)
      canvasCtx.fillStyle = '#ccc'
      canvasCtx.fill()
      canvasCtx.textAlign = 'center'
      canvasCtx.textBaseline = 'middle'
      canvasCtx.fillStyle = '#fff'
      canvasCtx.font = '12px sans-serif'
      canvasCtx.fillText(this.name, x, y)
    }
  }
  /**
   * 展开子节点
   */
  expand() {
    if (this.target.size) {
      this.expanded = true

      // 节点展开初始方向向量
      let direction = new Vector2d(0, 0)
      if (this.rootNode) {
        direction = this.position.substract(CENTER)
      } else {
        this.source.forEach(node => {
          direction.add(this.position.substract(node.position))
        })
      }

      let index = 0
      this.target.forEach(node => {
        if (node.inited) return
        node.inited = true
        const rotate = direction.xAxisAngle() + index * Math.PI / 18
        node.position = this.position.add(
          new Vector2d(index * 5, 0).rotate(rotate)
        )
        index++
      })
    }
  }
}