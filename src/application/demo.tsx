import React from 'react'
import GraphNode from '../graphics/node'
import GraphEdge from '../graphics/connector'
import Node from '../class/node'
import Edge from '../class/edge'
import demoData, { IData } from '../data/demoData'
import Vector2d from '../utils/vector2d'
import Application from '../class/application'
let RENDER_COUNT = 1200
let UNIT_TIME = 0.5
const CENTER = new Vector2d(window.innerWidth / 2, window.innerHeight / 2)

let totalTime = 0

interface IProps { }
interface IState {
  nodes: Node[]
  edges: Edge[]
}
class Demo extends Application<IProps, IState> {
  targetNodeIds: Set<string> = new Set()
  sourceNodeIds: Set<string> = new Set()
  // 存储所有根节点
  rootNodes: Set<Node> = new Set()
  containerRef: React.RefObject<HTMLDivElement> = React.createRef()
  canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()
  constructor(props: IProps) {
    super(props)
    console.log('demo', this)
    this.init()
  }
  init() {
    const edges = this.generateEdges(demoData)
    const nodes = this.generateNodes(demoData)
    // 将连线与节点关联
    edges.forEach(edge => {
      const targetNode = nodes.find(node => node.id === edge.targetId)
      const sourceNode = nodes.find(node => node.id === edge.sourceId)
      if (targetNode && sourceNode) {
        edge.targetNode = targetNode
        edge.sourceNode = sourceNode
      }
    })
    this.state = {
      edges,
      nodes
    }
  }
  componentDidMount() {
    const canvas = this.canvasRef.current
    const container = this.containerRef.current
    if (canvas && container) {
      this.canvasInit(container, canvas)
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    this.loop()
  }
  // 渲染循环
  loop = () => {
    if (RENDER_COUNT-- < 0) {
      return console.log(totalTime)
    }

    this.calculateNodeForce()

    if (!this.canvasContext) return
    this.canvasContext.clearRect(0, 0, window.innerWidth, window.innerHeight)
    this.updateEdges()
    const start = Date.now()
    this.updateNodes()
    totalTime += Date.now() - start


    if (RENDER_COUNT > 1200) {
      this.loop()
    } else {
      requestAnimationFrame(this.loop)
    }

  }
  /**
   * 生成节点,初始化节点
   */
  generateNodes(data: IData): Node[] {
    const { nodes: nodeDatas, edges } = data
    let rootNodeCount = 0
    const nodes: Node[] = nodeDatas.map(nodeData => {
      const rootNode: boolean = !this.targetNodeIds.has(nodeData.id)
      const node = new Node({
        id: nodeData.id,
        name: nodeData.name,
        rootNode
      })
      if (rootNode) {
        node.inited = true
        node.position = CENTER.add(
          new Vector2d(rootNodeCount * 5, 0).rotate(((rootNodeCount * 10) / 180) * Math.PI)
        )
        this.rootNodes.add(node)
        rootNodeCount++
      }
      return node
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
      nodes.push(
        new Node({
          position: new Vector2d(horizontalUnitDistance * horizontalCount, 0),
          name: '固定节点',
          id: `fixed-top-${horizontalCount}`,
          rootNode: true,
          hidden: true,
          fixed: true,
          inited: true
        }),
        new Node({
          position: new Vector2d(window.innerWidth, window.innerHeight).add(new Vector2d(-horizontalUnitDistance * horizontalCount, 0)),
          name: '固定节点',
          id: `fixed-bottom-${horizontalCount}`,
          rootNode: true,
          hidden: true,
          fixed: true,
          inited: true
        })
      )
    }
    while (vertitalCount-- > 0) {
      nodes.push(
        new Node({
          position: new Vector2d(0, window.innerHeight).add(new Vector2d(0, -vertitalCount * vertitalUnitDistance)),
          name: '固定节点',
          id: `fixed-left-${vertitalCount}`,
          rootNode: true,
          hidden: true,
          fixed: true,
          inited: true
        }),
        new Node({
          position: new Vector2d(window.innerWidth, 0).add(new Vector2d(0, vertitalCount * vertitalUnitDistance)),
          name: '固定节点',
          id: `fixed-right-${vertitalCount}`,
          rootNode: true,
          hidden: true,
          fixed: true,
          inited: true
        })
      )
    }
    return nodes
  }
  // 生成连线
  generateEdges(data: IData): Edge[] {
    const { edges } = data
    return edges.map(edge => {
      this.targetNodeIds.add(edge.target)
      this.sourceNodeIds.add(edge.source)
      return new Edge({
        targetId: edge.target,
        sourceId: edge.source
      })
    })
  }
  // 计算节点受力
  calculateNodeForce() {
    const { nodes } = this.state
    nodes.forEach(node => {
      if (node.fixed || !node.inited) return
      node.force = new Vector2d(0, 0)
      // 斥力
      nodes.forEach(target => {
        if (node === target || !node.inited) return
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
        if (!target.inited) return
        // 弹性系数
        const k: number = 0.005
        // 拉力绳自然长度
        const L: number = 100
        const v = target.position.substract(node.position)
        // 节点间的距离
        let distance = v.magnitude
        if (distance < L) return
        // 限制最大距离防止跑飞
        distance = distance < 120 ? distance : 120
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

    })
  }
  // 更新节点
  updateNodes() {
    const { nodes } = this.state
    nodes.forEach(node => {
      if (node.fixed || node.hidden || !node.inited) return
      node.calculateAcceleration()
      node.calculateVelocity(UNIT_TIME)
      node.calculatePosition(UNIT_TIME)
      if (this.canvasContext) {
        node.render(RENDER_COUNT, this.canvasContext)
      }
    })

    // const self = this
    // function update(nodes: Set<Node>) {
    //   nodes.forEach(node => {
    //     if (node.fixed || node.hidden || !node.inited || node.renderId === RENDER_COUNT) return
    //     node.calculateAcceleration()
    //     node.calculateVelocity(UNIT_TIME)
    //     node.calculatePosition(UNIT_TIME)
    //     if (self.canvasContext) {
    //       node.render(RENDER_COUNT, self.canvasContext)
    //     }
    //     if (node.expanded && node.target.size) {
    //       update(node.target)
    //     }
    //   })
    // }
    // update(this.rootNodes)
    // this.setState({ nodes })
  }
  // 更新连线
  updateEdges() {

    const { edges } = this.state
    edges.forEach(edge => {
      if (this.canvasContext) {
        edge.render(this.canvasContext)
      }
    })
    // this.setState({ edges })
  }
  render() {
    const { nodes, edges } = this.state
    return (
      <div
        ref={this.containerRef}
        style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0
        }}
      >
        <canvas ref={this.canvasRef} style={{ transform: 'translate3d(0,0,0)' }}></canvas>
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
            const { name, position, id, rootNode, hidden, inited } = node
            if (hidden || !inited) return null
            return (
              <GraphNode
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
              <GraphEdge
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
