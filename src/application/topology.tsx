import React, { Component } from 'react'
import Application from '../graphics/application'
import Node from '../class/node2'
import Edge from '../class/edge2'
import Vector2d from '../utils/vector2d'
import { globalEvent } from '../class/eventEmitter'
import "./topology.scss"
interface IProps { }

export default class Topology extends Component<IProps> {
  nodeDatas: any[] = [{
    name: 'node-1',
    id: 1,
    x: 100,
    y: 100
  }, {
    name: 'node-2',
    id: 2,
    x: 100,
    y: 150
  }]
  edgeDatas: any = [{
    targetId: 1,
    sourceId: 2
  }]
  nodes: Node[] = []
  edges: Edge[] = []
  constructor(props: IProps) {
    super(props)

  }
  componentDidMount() {
    this.nodes = this.nodeDatas.map((item: any) => {
      return new Node({
        name: item.name,
        x: item.x,
        y: item.y
      })
    })
    this.edgeDatas.forEach((edge: any) => {
      new Edge({
        targetId: edge.targetId,
        sourceId: edge.sourceId
      })
    })
  }
  addNode = () => {
    this.nodeDatas.push({
      name: 'node-??',
      x: 500,
      y: 500
    })
    this.setState({})
  }
  zoomOut = () => {
    // console.log('zoom out')
    globalEvent.emit('zoomOut')
  }
  zoomIn = () => {
    // console.log('zoom in')
    globalEvent.emit('zoomIn')
  }
  render() {
    return (
      <div className="topology">
        <div className="topo-bar">
          <button onClick={this.addNode}>添加节点</button>
          <button onClick={this.zoomOut}>缩小</button>
          <button onClick={this.zoomIn}>放大</button>
        </div>
        <div className="topo-chart">
          <Application>
          </Application>
        </div>
      </div>

    )
  }
}