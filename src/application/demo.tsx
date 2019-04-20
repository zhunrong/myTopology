import React, { Component } from 'react'
import Node from '../graphics/node'
import Connector from '../graphics/connector'
import demoData, { IData } from '../data/demoData'
import Vector2d from '../utils/vector2d'
interface IProps {}
interface IState {
  nodes: any[]
}
class Demo extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      nodes: this.convertData(demoData)
    }
  }
  componentDidMount() {
    this.layout()
  }
  /**
   * 数据结构转换
   */
  convertData(data: IData): any[] {
    const { nodes, edges } = data
    // const sourceIds: Set<string> = new Set()
    // const targetIds: Set<string> = new Set()
    nodes.forEach(node => {
      node.source = new Set()
      node.target = new Set()
      node.position = new Vector2d(
        300 + Math.random() * 10,
        300 + Math.random() * 10
      )
      node.v = new Vector2d(0, 0)
      node.a = new Vector2d(0, 0)
    })
    edges.forEach(edge => {
      // sourceIds.add(edge.source)
      // targetIds.add(edge.target)
      const sourceNode = nodes.find(node => node.id === edge.source)
      const targetNode = nodes.find(node => node.id === edge.target)
      if (sourceNode && targetNode) {
        sourceNode.target.add(targetNode)
        targetNode.source.add(sourceNode)
      }
    })
    // console.log(nodes)
    return nodes
  }
  layout() {
    const { nodes } = this.state
    nodes.forEach(node => {
      const { position } = node
      node.target.forEach((item: any) => {
        const { position: targetPostion } = item
        const distance = position.substract(targetPostion).magnitude
        const q1: number = 1
        const q2: number = 1
        const k: number = 1
        const m: number = 1
        const f = (k * q1 * q2) / distance / distance
        const a = m / f
        const t = 1
        const v = a * t
        const movement = v * t
        console.log(node.name, position, distance)
      })
    })
  }
  render() {
    const { nodes } = this.state
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
          <Connector x1={0} y1={0} x2={100} y2={100} />
        </svg>
      </div>
    )
  }
}

export default Demo
