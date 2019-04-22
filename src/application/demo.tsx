import React, { Component } from 'react'
import Node from '../graphics/node'
import Edge from '../graphics/edge'
import demoData, { IData } from '../data/demoData'
import Vector2d from '../utils/vector2d'
let RENDER_COUNT = 1200
let UNIT_TIME = 0.5
let x = 800
let y = 300

interface IProps {}
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
  constructor(props: IProps) {
    super(props)
    this.state = {
      nodes: this.generateNodes(demoData),
      edges: this.generateEdges(demoData)
    }
  }
  componentDidMount() {
    this.loop()
  }
  // 渲染循环
  loop = () => {
    if (RENDER_COUNT-- < 0) return
    requestAnimationFrame(this.loop)
    this.calculateNodeForce()
    // 下面这两个步骤耗时比较久
    // const start = Date.now()
    this.updateNodes()
    this.updateEdges()
    // console.log(Date.now() - start)
  }
  /**
   * 生成节点
   */
  generateNodes(data: IData): INode[] {
    const { nodes: nodeData, edges } = data
    const nodes: INode[] = nodeData.map(node => {
      x = x + Math.random() * 5 + 20
      y = y + Math.random() * 5 + 20
      return {
        source: new Set(),
        target: new Set(),
        position: new Vector2d(x, y),
        velocity: new Vector2d(0, 0),
        acceleration: new Vector2d(0, 0),
        force: new Vector2d(0, 0),
        M: 1,
        Q: 16,
        name: node.name,
        id: node.id
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
    return nodes
  }
  // 生成连线
  generateEdges(data: IData): IEdge[] {
    const { edges } = data
    return edges.map(edge => {
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
      node.force = new Vector2d(0, 0)
      // 斥力
      nodes.forEach(target => {
        if (node === target) return
        const v = node.position.substract(target.position)
        // 节点间的距离
        const distance = v.magnitude
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
        const L: number = 150
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
    })
  }
  // 更新节点
  updateNodes() {
    const { nodes } = this.state
    nodes.forEach(node => {
      node.acceleration = node.force.scale(1 / node.M)
      node.velocity = node.velocity.add(node.acceleration.scale(UNIT_TIME))
      node.position = node.position.add(node.velocity.scale(UNIT_TIME))
    })
    this.setState({ nodes })
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
    })
    this.setState({ edges })
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
        <div
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
            const { name, position, id } = node
            return <Node x={position.x} y={position.y} name={name} key={id} />
          })}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0
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
        </svg>
      </div>
    )
  }
}

export default Demo
