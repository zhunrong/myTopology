import React, { Component } from 'react'
import Node from '../graphics/node'
import Connector from '../graphics/connector'
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
interface IConnector {
  x1: number
  y1: number
  x2: number
  y2: number
  target: string
  source: string
}
interface IState {
  nodes: INode[]
  connectors: IConnector[]
}
class Demo extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      nodes: this.generateNodes(demoData),
      connectors: this.generateConnectors(demoData)
    }
  }
  componentDidMount() {
    this.loop()
  }
  loop = () => {
    if (RENDER_COUNT-- < 0) return
    requestAnimationFrame(this.loop)
    this.calculateForce()
    this.calculateAccelation()
    this.calculateVelocity()
    this.calculatePosition()
    this.updateConnectors()
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
  generateConnectors(data: IData): IConnector[] {
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
  // 计算受力
  calculateForce() {
    const { nodes } = this.state
    nodes.forEach(node => {
      node.force = new Vector2d(0, 0)
      // 斥力
      nodes.forEach(target => {
        if (node === target) return
        const v = node.position.substract(target.position)
        // 节点间的距离
        const distance = v.magnitude
        // console.log(distance)
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
      const k = 0.1
      // 阻尼
      // const F = node.velocity.scale(-1 * k)
      const F = node.velocity
        .normalize()
        .scale(-1 * Math.pow(node.velocity.magnitude, 2) * k)
      node.force = node.force.add(F)
    })
  }
  // 计算加速度
  calculateAccelation() {
    const { nodes } = this.state
    nodes.forEach(node => {
      // if (node.force.magnitude < 0.04) return
      // console.log(node.force.magnitude)
      node.acceleration = node.force.scale(1 / node.M)
    })
  }
  // 计算速度
  calculateVelocity() {
    const { nodes } = this.state
    nodes.forEach(node => {
      node.velocity = node.velocity.add(node.acceleration.scale(UNIT_TIME))
    })
  }
  // 计算位置
  calculatePosition() {
    const { nodes } = this.state
    nodes.forEach(node => {
      node.position = node.position.add(node.velocity.scale(UNIT_TIME))
    })
    this.setState({ nodes })
  }
  updateConnectors() {
    const { connectors, nodes } = this.state
    connectors.forEach(connector => {
      const target = nodes.find(node => node.id === connector.target)
      const source = nodes.find(node => node.id === connector.source)
      if (target && source) {
        connector.x1 = source.position.x
        connector.y1 = source.position.y
        connector.x2 = target.position.x
        connector.y2 = target.position.y
      }
    })
    this.setState({ connectors })
  }
  render() {
    const { nodes, connectors } = this.state
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
          {connectors.map(connector => {
            return (
              <Connector
                key={`${connector.source}-${connector.target}`}
                x1={connector.x1}
                y1={connector.y1}
                x2={connector.x2}
                y2={connector.y2}
              />
            )
          })}
        </svg>
      </div>
    )
  }
}

export default Demo
