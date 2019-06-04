import React, { Component } from 'react'
import Canvas from '../graphics/Canvas'
import Node from '../graphics/Circle'
import Edge from '../graphics/Line'
import Vector2d from '../utils/vector2d'
import { globalEvent } from '../events/eventEmitter'
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
    x: 500,
    y: 200
  }, {
    name: 'node-3',
    id: 3,
    x: 300,
    y: 150
  }]
  edgeDatas: any = [{
    targetId: 1,
    sourceId: 2
  }, {
    targetId: 2,
    sourceId: 3
  }]
  nodes: Node[] = []
  edges: Edge[] = []
  containerRef: React.RefObject<HTMLDivElement> = React.createRef()
  app: Canvas | undefined
  constructor(props: IProps) {
    super(props)

  }
  componentDidMount() {
    if (this.containerRef.current) {
      this.app = new Canvas({
        container: this.containerRef.current
      })
      this.app.eventEmitter.on('canvas:mounted', () => {
        this.nodes = this.nodeDatas.map((item: any) => {
          const node = new Node({
            id: item.id,
            name: item.name,
            x: item.x,
            y: item.y
          })
          if (this.app) {
            this.app.addNode(node)
          }
          return node
        })
        this.edges = this.edgeDatas.map((item: any) => {
          const { targetId, sourceId } = item
          const sourceNode = this.nodes.find(node => node.id === sourceId)
          const targetNode = this.nodes.find(node => node.id === targetId)
          const edge = new Edge({
            targetId: targetId,
            sourceId: sourceId,
            sourceNode,
            targetNode
          })
          if (this.app) {
            this.app.addEdge(edge)
          }
          return edge
        })
      })
      this.app.start()
    }
  }
  addNode = () => {
    if (this.app) {
      const node = new Node({
        name: 'node-??',
        x: 500,
        y: 500,
        id: 4
      })
      this.app.addNode(node)
    }
  }
  zoomOut = () => {
    // console.log('zoom out')
    // globalEvent.emit('zoomOut')
    if (this.app) {
      this.app.eventEmitter.emit('zoomOut')
    }
  }
  zoomIn = () => {
    // console.log('zoom in')
    // globalEvent.emit('zoomIn')
    if (this.app) {
      this.app.eventEmitter.emit('zoomIn')
    }
  }
  render() {
    return (
      <div className="topology">
        <div className="topo-bar">
          <button onClick={this.addNode}>添加节点</button>
          <button onClick={this.zoomOut}>缩小</button>
          <button onClick={this.zoomIn}>放大</button>
        </div>
        <div ref={this.containerRef} className="topo-chart" />
      </div>

    )
  }
}