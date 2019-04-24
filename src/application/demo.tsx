import React, { Component } from 'react'
import Node from '../graphics/node'
import Edge from '../graphics/connector'
import demoData, { IData } from '../data/demoData'
import Vector2d from '../utils/vector2d'
let RENDER_COUNT = 1200
let UNIT_TIME = 0.5
const CENTER = new Vector2d(window.innerWidth / 2, window.innerHeight / 2)

let totalTime = 0

interface IProps { }
interface INode {
  id: string
  name: string
  M: number
  Q: number
  force: Vector2d
  acceleration: Vector2d
  velocity: Vector2d
  position: Vector2d
  source: Set<INode>
  target: Set<INode>
  rootNode: boolean
  // 隐藏，不用渲染
  hidden?: boolean
  // 位置固定
  fixed?: boolean
}
interface IEdge {
  x1: number
  y1: number
  x2: number
  y2: number
  target: string
  source: string
}
interface IState {
  nodes: INode[]
  edges: IEdge[]
}
class Demo extends Component<IProps, IState> {
  targetNodeIds: Set<string> = new Set()
  rootNodeIds: Set<string> = new Set()
  canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()
  canvasCtx: CanvasRenderingContext2D | null = null
  constructor(props: IProps) {
    super(props)
    this.state = {
      edges: this.generateEdges(demoData),
      nodes: this.generateNodes(demoData)
    }
  }
  componentDidMount() {
    const canvas = this.canvasRef.current
    if (canvas) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      this.canvasCtx = canvas.getContext('2d')
    }
    this.loop()
  }
  // 渲染循环
  loop = () => {
    if (RENDER_COUNT-- < 0) {
      return console.log(totalTime)
    }

    const start = Date.now()
    this.calculateNodeForce()

    if (!this.canvasCtx) return
    this.canvasCtx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    // 下面这两个步骤耗时比较久
    this.updateEdges()
    this.updateNodes()
    totalTime += Date.now() - start


    if (RENDER_COUNT > 1200) {
      this.loop()
    } else {
      requestAnimationFrame(this.loop)
    }

  }
  /**
   * 生成节点
   */
  generateNodes(data: IData): INode[] {
    const { nodes: nodeData, edges } = data
    const nodes: INode[] = nodeData.map((node, index) => {
      const rootNode: boolean = !this.targetNodeIds.has(node.id)
      return {
        source: new Set(),
        target: new Set(),
        // 初始布局：螺旋分布
        position: CENTER.add(
          new Vector2d(index * 5, 0).rotate(((index * 10) / 180) * Math.PI)
        ),
        velocity: new Vector2d(0, 0),
        acceleration: new Vector2d(0, 0),
        force: new Vector2d(0, 0),
        M: 1,
        Q: 6,
        name: node.name,
        id: node.id,
        rootNode
      }
    })
    edges.forEach(edge => {
      const sourceNode = nodes.find(node => node.id === edge.source)
      const targetNode = nodes.find(node => node.id === edge.target)
      if (sourceNode && targetNode) {
        sourceNode.target.add(targetNode)
        targetNode.source.add(sourceNode)
      }
    })

    // 生成屏幕四周的固定节点
    let horizontalCount = Math.floor(window.innerWidth / 60) - 1
    const horizontalUnitDistance = window.innerWidth / horizontalCount
    let vertitalCount = Math.floor(window.innerHeight / 60) - 1
    const vertitalUnitDistance = window.innerHeight / vertitalCount
    while (horizontalCount-- > 0) {
      nodes.push({
        source: new Set(),
        target: new Set(),
        position: new Vector2d(horizontalUnitDistance * horizontalCount, 0),
        velocity: new Vector2d(0, 0),
        acceleration: new Vector2d(0, 0),
        force: new Vector2d(0, 0),
        M: 1,
        Q: 6,
        name: '固定节点',
        id: `fixed-top-${horizontalCount}`,
        rootNode: true,
        hidden: true,
        fixed: true
      },
        {
          source: new Set(),
          target: new Set(),
          position: new Vector2d(window.innerWidth, window.innerHeight).add(new Vector2d(-horizontalUnitDistance * horizontalCount, 0)),
          velocity: new Vector2d(0, 0),
          acceleration: new Vector2d(0, 0),
          force: new Vector2d(0, 0),
          M: 1,
          Q: 6,
          name: '固定节点',
          id: `fixed-bottom-${horizontalCount}`,
          rootNode: true,
          hidden: true,
          fixed: true
        }
      )
    }
    while (vertitalCount-- > 0) {
      nodes.push({
        source: new Set(),
        target: new Set(),
        position: new Vector2d(0, window.innerHeight).add(new Vector2d(0, -vertitalCount * vertitalUnitDistance)),
        velocity: new Vector2d(0, 0),
        acceleration: new Vector2d(0, 0),
        force: new Vector2d(0, 0),
        M: 1,
        Q: 6,
        name: '固定节点',
        id: `fixed-left-${vertitalCount}`,
        rootNode: true,
        hidden: true,
        fixed: true
      },
        {
          source: new Set(),
          target: new Set(),
          position: new Vector2d(window.innerWidth, 0).add(new Vector2d(0, vertitalCount * vertitalUnitDistance)),
          velocity: new Vector2d(0, 0),
          acceleration: new Vector2d(0, 0),
          force: new Vector2d(0, 0),
          M: 1,
          Q: 6,
          name: '固定节点',
          id: `fixed-right-${vertitalCount}`,
          rootNode: true,
          hidden: true,
          fixed: true
        }
      )
    }
    return nodes
  }
  // 生成连线
  generateEdges(data: IData): IEdge[] {
    const { edges } = data
    return edges.map(edge => {
      this.targetNodeIds.add(edge.target)
      return {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        target: edge.target,
        source: edge.source
      }
    })
  }
  // 计算节点受力
  calculateNodeForce() {
    const { nodes } = this.state
    nodes.forEach(node => {
      if (node.fixed) return
      node.force = new Vector2d(0, 0)
      // 斥力
      nodes.forEach(target => {
        if (node === target) return
        const v = node.position.substract(target.position)
        // 节点间的距离 限制最小距离，避免跑飞
        const distance = v.magnitude < 59 ? 59 : v.magnitude
        // 系数
        const k: number = 100
        // 斥力
        const F = v
          .normalize()
          .scale((k * node.Q * target.Q) / Math.pow(distance, 2))
        node.force = node.force.add(F)
      })
      const relationNode = [
        ...Array.from(node.source),
        ...Array.from(node.target)
      ]
      // 拉力
      relationNode.forEach(target => {
        // 弹性系数
        const k: number = 0.005
        // 拉力绳自然长度
        const L: number = 100
        const v = target.position.substract(node.position)
        // 节点间的距离
        const distance = v.magnitude
        if (distance < L) return
        // 拉力
        const F = v.scale((distance - L) * k)
        node.force = node.force.add(F)
      })
      // 阻尼系数
      const k: number = 0.1
      // 阻尼
      // const F = node.velocity.scale(-1 * k)
      const F = node.velocity
        .normalize()
        .scale(-1 * Math.pow(node.velocity.magnitude, 2) * k)
      node.force = node.force.add(F)

      // if (node.force.magnitude > 100) {
      //   // debugger
      //   node.force = node.force.normalize().scale(100)
      // }
    })
  }
  // 更新节点
  updateNodes() {
    const { nodes } = this.state
    nodes.forEach(node => {
      if (node.fixed || node.hidden) return
      node.acceleration = node.force.scale(1 / node.M)
      node.velocity = node.velocity.add(node.acceleration.scale(UNIT_TIME))
      node.position = node.position.add(node.velocity.scale(UNIT_TIME))

      if (this.canvasCtx) {
        const { x, y } = node.position
        this.canvasCtx.beginPath()
        this.canvasCtx.arc(x, y, 30, 0, Math.PI * 2)
        this.canvasCtx.fillStyle = '#ccc'
        this.canvasCtx.fill()
        this.canvasCtx.textAlign = 'center'
        this.canvasCtx.textBaseline = 'middle'
        this.canvasCtx.fillStyle = '#fff'
        this.canvasCtx.font = '12px sans-serif'
        this.canvasCtx.fillText(node.name, x, y)
      }
    })
    // this.setState({ nodes })
  }
  // 更新连线
  updateEdges() {

    const { edges, nodes } = this.state
    edges.forEach(edge => {
      const target = nodes.find(node => node.id === edge.target)
      const source = nodes.find(node => node.id === edge.source)
      if (target && source) {
        edge.x1 = source.position.x
        edge.y1 = source.position.y
        edge.x2 = target.position.x
        edge.y2 = target.position.y
      }
      if (this.canvasCtx) {
        this.canvasCtx.beginPath()
        this.canvasCtx.moveTo(edge.x1, edge.y1)
        this.canvasCtx.lineTo(edge.x2, edge.y2)
        this.canvasCtx.stroke()
      }
    })
    // this.setState({ edges })
  }
  render() {
    const { nodes, edges } = this.state
    return (
      <div
        style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0
        }}
      >
        <canvas ref={this.canvasRef}></canvas>
        {/* <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            zIndex: 1
          }}
        >
          {nodes.map(node => {
            const { name, position, id, rootNode, hidden } = node
            if (hidden) return null
            return (
              <Node
                x={position.x}
                y={position.y}
                name={name}
                key={id}
                rootNode={rootNode}
              />
            )
          })}
        </div> */}
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            transform:'translate3d(0,0,0)'
          }}
        >
          {edges.map(edge => {
            return (
              <Edge
                key={`${edge.source}-${edge.target}`}
                x1={edge.x1}
                y1={edge.y1}
                x2={edge.x2}
                y2={edge.y2}
              />
            )
          })}
        </svg> */}
      </div>
    )
  }
}

export default Demo
