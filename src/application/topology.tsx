import React, { Component } from 'react'
import { MODE_DEFAULT, MODE_VIEW, MODE_CREATE_EDGE, MODE_AREA_PICK, MODE_CREATE_L, MODE_BORDER } from '../graphics'
import { Canvas, CircleCanvasNode, RectCanvasNode, RectDomNode, Line as Edge, Group } from '../graphics'
import CustomNode from '../components/nodes/Node'
import { nodeDatas, edgeDatas } from '../data/topoData'
import "./topology.scss"
// import "./treeTest"
interface IProps { }
interface IState {
  mode: string
}

type Node = CircleCanvasNode | RectCanvasNode | RectDomNode | CustomNode

export default class Topology extends Component<IProps, IState> {
  nodeDatas: any[] = nodeDatas
  edgeDatas: any[] = edgeDatas
  nodes: Node[] = []
  edges: Edge[] = []
  containerRef: React.RefObject<HTMLDivElement> = React.createRef()
  canvas!: Canvas
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
          return item.isGroup ? new Group({
            width: item.width,
            height: item.height,
            id: item.id,
            x: item.x,
            y: item.y,
            data: item
          }) : new RectCanvasNode({
            width: 146,
            height: 53,
            x: item.x,
            y: item.y,
            id: item.id,
            text: item.text,
            zIndex: item.zIndex,
            data: item
          })
        })
        this.nodes.forEach(node => {
          const parentId = node.data.parentId
          if (parentId) {
            const parent = this.nodes.find(item => item.id === parentId)
            if (parent) {
              parent.addChild(node)
            }
          } else {
            this.canvas.addNode(node)
          }
        })
        this.edgeDatas.forEach((item: any) => {
          const { targetId, sourceId } = item
          const sourceNode = this.nodes.find(node => node.id === sourceId)
          const targetNode = this.nodes.find(node => node.id === targetId)
          if (sourceNode && targetNode) {
            const edge = new Edge({
              sourceNode,
              targetNode,
              arrow: true
            })
            // sourceNode.addEdge(edge)
            // targetNode.addEdge(edge)
            this.canvas.addEdge(edge)
          }
        })
      })
      this.canvas.eventEmitter.on('canvas:drop', (params) => {
        const { coordinate, dataTransfer } = params

        let node: Node | undefined
        switch (dataTransfer.getData('nodeType')) {
          case 'rect':
            node = new CustomNode({
              width: 146,
              height: 53,
              x: coordinate.x - 73,
              y: coordinate.y - 26.5,
              id: Math.random() * 10000,
              text: 'new Rect'
            })
            break
          case 'circle':
          default:
            node = new CircleCanvasNode({
              id: Math.random() * 10000,
              text: 'new Circle',
              x: coordinate.x - 40,
              y: coordinate.y - 40,
              radius: 40
            })
        }

        if (node) {
          this.canvas.addNode(node)
        }
      })
      this.canvas.eventEmitter.on('canvas:menu', (command) => {
        const activeNodes = this.canvas.getActiveNodes()
        const activeEdges = this.canvas.getActiveEdges()
        switch (command) {
          case 'rename':
            if (activeEdges.length) {
              const edge = activeEdges[0] as Edge
              setTimeout(() => {
                const result = prompt('请输入新名称', edge.text)
                if (result && this.canvas) {
                  edge.text = result
                  this.canvas.repaint = true
                }
              }, 100)
              return
            }
            if (activeNodes.length) {
              const node = activeNodes[0] as Node
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
            break
          case 'remove':
            if (activeEdges.length) {
              const edge = activeEdges[0] as Edge
              this.canvas.removeEdge(edge)
              return
            }
            if (activeNodes.length) {
              const node = activeNodes[0] as Node
              this.canvas.removeNode(node)
              return
            }
            break
        }
      })
      this.canvas.start()
      const w = window as any
      w.canvas = this.canvas
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
  handleDragStart = (e: React.DragEvent<HTMLSpanElement>, type: string) => {
    e.dataTransfer.setData('nodeType', type)
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
          <img draggable={false} onClick={this.modeChange.bind(this, MODE_DEFAULT)} className={`${this.state.mode === MODE_DEFAULT ? 'active' : ''}`} src={require('../assets/pointer.svg')} title="默认模式" />
          <img draggable={false} onClick={this.modeChange.bind(this, MODE_VIEW)} className={`${this.state.mode === MODE_VIEW ? 'active' : ''}`} src={require('../assets/move.svg')} title="浏览模式" />
          <img draggable={false} onClick={this.modeChange.bind(this, MODE_AREA_PICK)} className={`${this.state.mode === MODE_AREA_PICK ? 'active' : ''}`} src={require('../assets/area_pick.svg')} title="框选模式" />
          <img draggable={false} onClick={this.modeChange.bind(this, MODE_BORDER)} className={`${this.state.mode === MODE_BORDER ? 'active' : ''}`} src={require('../assets/box_resize.svg')} title="边框模式" />
          <img draggable={false} src={require('../assets/zoom_out.svg')} onClick={this.zoomOut} title="缩小" />
          <img draggable={false} src={require('../assets/zoom_in.svg')} onClick={this.zoomIn} title="放大" />
          <img draggable={false} onClick={this.modeChange.bind(this, MODE_CREATE_EDGE)} className={`${this.state.mode === MODE_CREATE_EDGE ? 'active' : ''}`} src={require('../assets/line_2.svg')} title="创建连线" />
          <img draggable={false} onClick={this.modeChange.bind(this, MODE_CREATE_L)} className={`${this.state.mode === MODE_CREATE_L ? 'active' : ''}`} src={require('../assets/L_line.svg')} title="创建L连线" />
          <span className="node" draggable={true} onDragStart={e => this.handleDragStart(e, 'rect')}>Rect</span>
          <span className="node" draggable={true} onDragStart={e => this.handleDragStart(e, 'circle')}>Circle</span>
        </div>
        <div ref={this.containerRef} className="topo-chart" />
      </div>
    )
  }
}