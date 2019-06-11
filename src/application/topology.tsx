import React, { Component } from 'react'
import Canvas from '../graphics/Canvas'
// import Node from '../graphics/Circle'
import Node from '../components/nodes/Node3'
import Edge from '../graphics/Line'
import Vector2d from '../utils/vector2d'
import Math2d from '../utils/math2d'
import { globalEvent } from '../events/eventEmitter'
import { nodeDatas } from '../data/topoData'
import "./topology.scss"
interface IProps { }

export default class Topology extends Component<IProps> {
  nodeDatas: any[] = nodeDatas
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
  canvas: Canvas | undefined
  constructor(props: IProps) {
    super(props)
  }
  componentDidMount() {
    if (this.containerRef.current) {
      this.canvas = new Canvas({
        container: this.containerRef.current
      })
      this.canvas.eventEmitter.on('canvas:mounted', () => {
        // this.nodes = this.nodeDatas.map((item: any) => {
        //   const node = new Node({
        //     text: item.name,
        //     x: item.x,
        //     y: item.y,
        //     // radius: 25,
        //     // width: 50,
        //     // height: 50
        //   })
        //   if (this.canvas) {
        //     this.canvas.addNode(node)
        //   }
        //   return node
        // })
        // this.edges = this.edgeDatas.map((item: any) => {
        //   const { targetId, sourceId } = item
        //   const sourceNode = this.nodes.find(node => node.id === sourceId)
        //   const targetNode = this.nodes.find(node => node.id === targetId)
        //   const edge = new Edge({
        //     targetId: targetId,
        //     sourceId: sourceId,
        //     sourceNode,
        //     targetNode
        //   })
        //   if (this.canvas) {
        //     this.canvas.addEdge(edge)
        //   }
        //   return edge
        // })
      })
      this.canvas.eventEmitter.on('canvas:drop', (params) => {
        console.log('drop', params)
        const { coordinate } = params
        const node = new Node({
          text: '',
          x: coordinate.x - 75,
          y: coordinate.y - 50
        })
        if (this.canvas) {
          this.canvas.addNode(node)
        }
      })
      this.canvas.start()
    }
  }
  addNode = () => {
    if (this.canvas) {
      // const node = new Node({
      //   // name: 'node-??',
      //   x: 500,
      //   y: 500,
      //   id: 4,
      //   // radius: 25
      // })
      // this.canvas.addNode(node)
    }
  }
  zoomOut = () => {
    if (this.canvas) {
      this.canvas.zoomOut()
    }
  }
  zoomIn = () => {
    if (this.canvas) {
      this.canvas.zoomIn()
    }
  }
  optimize = () => {
    if (this.canvas) {
      this.canvas.optimize = true
    }
  }
  notOptimize = () => {
    if (this.canvas) {
      this.canvas.optimize = false
    }
  }
  handleDragStart = (e: React.DragEvent<HTMLSpanElement>) => {
    e.dataTransfer.setData('node', 'type 1')
  }
  render() {
    return (
      <div className="topology">
        <div className="topo-bar">
          <button onClick={this.zoomOut}>缩小</button>
          <button onClick={this.zoomIn}>放大</button>
          <button onClick={this.optimize}>优化</button>
          <button onClick={this.notOptimize}>取消优化</button>
          <span draggable={true} onDragStart={this.handleDragStart}>N</span>
        </div>
        <div ref={this.containerRef} className="topo-chart" />
      </div>

    )
  }
}