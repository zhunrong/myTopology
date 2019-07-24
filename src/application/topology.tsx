import React, { Component } from 'react'
import { MODE_DEFAULT, MODE_VIEW, MODE_CREATE_EDGE, MODE_AREA_PICK, MODE_CREATE_L } from '../graphics'
// import Node from '../components/nodes/Node'
import { RectCanvasNode as Node } from '../graphics'
import Edge from '../components/edges/Line'
import { nodeDatas } from '../data/topoData'
import "./topology.scss"
import { Canvas } from '../graphics/index'
import RectDomNode from '../graphics/node/RectDomNode'
// import "./treeTest"
interface IProps { }
interface IState {
  mode: string
}

export default class Topology extends Component<IProps, IState> {
  nodeDatas: any[] = nodeDatas
  edgeDatas: any[] = []
  nodes: Node[] = []
  edges: Edge[] = []
  containerRef: React.RefObject<HTMLDivElement> = React.createRef()
  canvas: Canvas | undefined
  state = {
    mode: MODE_DEFAULT
  }
  constructor(props: IProps) {
    super(props)
  }
  componentDidMount() {
    if (this.containerRef.current) {
      this.canvas = new Canvas({
        container: this.containerRef.current,
        scale: 1
      })
      this.canvas.eventEmitter.on('canvas:mounted', () => {
        this.nodes = this.nodeDatas.map((item: any) => {
          const node = new Node({
            text: item.text,
            x: item.x,
            y: item.y,
            id: item.id,
            width: 146,
            height: 53
          })
          if (this.canvas) {
            this.canvas.addNode(node)
          }
          return node
        })
        this.edges = this.edgeDatas.map((item: any) => {
          const { targetId, sourceId } = item
          const sourceNode = this.nodes.find(node => node.id === sourceId)
          const targetNode = this.nodes.find(node => node.id === targetId)
          const edge = new Edge({
            sourceNode,
            targetNode
          })
          if (this.canvas) {
            this.canvas.addEdge(edge)
          }
          return edge
        })
      })
      this.canvas.eventEmitter.on('canvas:drop', (params) => {
        const { coordinate, dataTransfer } = params
        const node = new Node({
          id: Math.random() * 10000,
          text: '',
          x: coordinate.x - 73,
          y: coordinate.y - 26.5,
          width: 146,
          height: 53
        })
        if (this.canvas) {
          this.canvas.addNode(node)
        }
      })
      this.canvas.eventEmitter.on('canvas:menu', (command) => {
        if (this.canvas) {
          if (this.canvas.activeEdges.length) {
            const edge = this.canvas.activeEdges[0] as Edge
            setTimeout(() => {
              const result = prompt('请输入新名称', edge.text)
              if (result && this.canvas) {
                edge.text = result
                this.canvas.repaint = true
              }
            }, 100)
            return
          }
          if (this.canvas.activeNodes.length) {
            const node = this.canvas.activeNodes[0] as Node
            setTimeout(() => {
              const result = prompt('请输入新名称', node.text)
              if (result && this.canvas) {
                node.text = result
                // node.isUpdate = true
                node.render()
                this.canvas.repaint = true
              }
            }, 100)
            return
          }
        }
      })
      this.canvas.start()
      console.log(this.canvas)
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
  handleDragStart = (e: React.DragEvent<HTMLSpanElement>) => {
    e.dataTransfer.setData('nodeType', 'A')
    e.dataTransfer.setData('id', '123')
  }
  modeChange(type: string) {
    this.setState({
      mode: type
    })
    if (this.canvas) {
      this.canvas.setMode(type)
    }
  }
  render() {
    return (
      <div className="topology">
        <div className="topo-bar">
          <img onClick={this.modeChange.bind(this, MODE_DEFAULT)} className={`${this.state.mode === MODE_DEFAULT ? 'active' : ''}`} src={require('../assets/pointer.svg')} title="默认模式" />
          <img onClick={this.modeChange.bind(this, MODE_VIEW)} className={`${this.state.mode === MODE_VIEW ? 'active' : ''}`} src={require('../assets/move.svg')} title="浏览模式" />
          <img onClick={this.modeChange.bind(this, MODE_AREA_PICK)} className={`${this.state.mode === MODE_AREA_PICK ? 'active' : ''}`} src={require('../assets/area_pick.svg')} title="框选模式" />
          <img src={require('../assets/zoom_out.svg')} onClick={this.zoomOut} title="缩小" />
          <img src={require('../assets/zoom_in.svg')} onClick={this.zoomIn} title="放大" />
          <img onClick={this.modeChange.bind(this, MODE_CREATE_EDGE)} className={`${this.state.mode === MODE_CREATE_EDGE ? 'active' : ''}`} src={require('../assets/line_2.svg')} title="创建连线" />
          <img onClick={this.modeChange.bind(this, MODE_CREATE_L)} className={`${this.state.mode === MODE_CREATE_L ? 'active' : ''}`} src={require('../assets/L_line.svg')} title="创建L连线" />
          <span draggable={true} onDragStart={this.handleDragStart}>N</span>
        </div>
        <div ref={this.containerRef} className="topo-chart" />
      </div>
    )
  }
}