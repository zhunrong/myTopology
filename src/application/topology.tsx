import React, { Component } from 'react'
import { MODE_DEFAULT, MODE_VIEW, MODE_CREATE_EDGE, MODE_AREA_PICK, MODE_CREATE_L, MODE_BORDER } from '../graphics'
import { Canvas, CircleCanvasNode, RectCanvasNode, RectDomNode, Line as Edge, RectGroup, RectDomGroup, CircleGroup, L, Image } from '../graphics'
import CustomNode from '../components/node/Node'
import NodePanel from '../components/nodePanel/nodePanel'
import { nodeDatas, edgeDatas } from '../data/topoData'
import { Menu, Dropdown, Icon } from 'antd'
import {
  MODE_CREATE_EDGE_DOUBLE_ARROW,
  MODE_CREATE_L_DOUBLE_ARROW
} from './modes'
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
      this.canvas.animation = true
      this.canvas.eventEmitter.on('canvas:mounted', () => {
        this.canvas.removeAllNode()
        const topoData = JSON.parse(localStorage.getItem('topoData') || JSON.stringify({ nodes: [], edges: [], zoom: 1 }))
        this.canvas.setZoom(topoData.zoom || 1)
        this.nodes = topoData.nodes.map((item: any) => {
          switch (item.nodeType) {
            case 'rectGroup':
              return new RectGroup({
                width: item.width,
                height: item.height,
                id: item.id,
                x: item.x,
                y: item.y,
                data: item,
                isExpanded: item.isExpanded
              })
            case 'circleGroup':
              return new CircleGroup({
                radius: item.radius,
                id: item.id,
                x: item.x,
                y: item.y,
                data: item,
                isExpanded: item.isExpanded
              })
            case 'customNode':
              return new CustomNode({
                width: item.width,
                height: item.height,
                id: item.id,
                x: item.x,
                y: item.y,
                text: item.text,
                deviceType: item.deviceType,
                data: item
              })
            default:
              return new RectGroup({
                id: 'error',
                x: 0,
                y: 0
              })
          }
        })
        this.nodes.forEach(node => {
          const parentId = node.data.parentId
          if (parentId === 'rootNode') {
            this.canvas.addNode(node)
          } else {
            const parent = this.nodes.find(item => item.id === parentId)
            if (parent) {
              parent.addChild(node)
            }
          }
        })
        topoData.edges.forEach((item: any) => {
          const { targetId, sourceId, text } = item
          const sourceNode = this.nodes.find(node => node.id === sourceId)
          const targetNode = this.nodes.find(node => node.id === targetId)
          if (sourceNode && targetNode) {
            if (item.type === 'line') {
              const edge = new Edge({
                sourceNode,
                targetNode,
                dash: item.dash,
                arrow: item.arrow,
                text: item.text
              })
              edge.animateManager.element = new Image(require('../assets/双箭头.png'))
              edge.animateManager.duration = 5000
              this.canvas.addEdge(edge)
            } else {
              const edge = new L({
                sourceNode,
                targetNode,
                dash: item.dash,
                arrow: item.arrow,
                text: item.text
              })
              edge.animateManager.element = new Image(require('../assets/绿箭头.png'))
              edge.animateManager.duration = 4000
              this.canvas.addEdge(edge)
            }
          }
        })
      })
      this.canvas.eventEmitter.on('canvas:drop', (params) => {
        const { coordinate, dataTransfer } = params

        let node: Node | undefined
        const type = dataTransfer.getData('nodeType')
        switch (type) {
          case '主机1':
          case '主机2':
          case '主机3':
          case '服务器':
          case '交换机1':
          case '交换机2':
            node = new CustomNode({
              x: coordinate.x - 40,
              y: coordinate.y - 40,
              id: Math.random(),
              text: type,
              deviceType: type
            })
            break
          case 'rect group':
            node = new RectDomGroup({
              width: 100,
              height: 100,
              x: coordinate.x - 50,
              y: coordinate.y - 50,
              id: Math.random()
            })
            break
          case 'circle group':
            node = new CircleGroup({
              radius: 50,
              x: coordinate.x - 50,
              y: coordinate.y - 50,
              id: Math.random()
            })
            break
          default:
            node = new CircleCanvasNode({
              id: Math.random(),
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
      this.canvas.eventEmitter.on('canvas:menu', ({ command }) => {
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

  modeChange(type: string) {
    this.setState({
      mode: type
    })
    if (this.canvas) {
      this.canvas.setMode(type)
    }
  }

  saveData = () => {
    const nodes: any[] = []
    const edges: any[] = []
    const sign = Math.random()
    this.canvas.rootNode.getDescendantBF(node => {
      const { x, y } = node.position
      const parentId = node.parent ? node.parent.id : null
      if (node instanceof RectGroup) {
        nodes.push({
          x,
          y,
          id: node.id,
          parentId,
          width: node.width,
          height: node.height,
          isExpanded: node.isExpanded,
          nodeType: 'rectGroup'
        })
      } else if (node instanceof CircleGroup) {
        nodes.push({
          x,
          y,
          radius: node.radius,
          id: node.id,
          parentId,
          isExpanded: node.isExpanded,
          nodeType: 'circleGroup'
        })
      } else if (node instanceof CustomNode) {
        nodes.push({
          x,
          y,
          width: node.width,
          height: node.height,
          nodeType: 'customNode',
          text: node.text,
          id: node.id,
          parentId,
          deviceType: node.deviceType
        })
      }


      node.edges.forEach(edge => {
        if (edge.renderSign === sign) return
        edge.renderSign = sign
        if (edge instanceof Edge) {
          edges.push({
            sourceId: edge.sourceNode.id,
            targetId: edge.targetNode.id,
            dash: edge.dash,
            arrow: edge.arrow,
            text: edge.text,
            type: 'line'
          })
        } else if (edge instanceof L) {
          edges.push({
            sourceId: edge.sourceNode.id,
            targetId: edge.targetNode.id,
            dash: edge.dash,
            arrow: edge.arrow,
            text: edge.text,
            type: 'L'
          })
        }
      })
    })

    localStorage.setItem('topoData', JSON.stringify({
      nodes,
      edges,
      zoom: this.canvas.canvasScale
    }))
  }

  render() {
    const { mode } = this.state
    const edgeMenu = (
      <Menu onClick={(params: any) => this.modeChange(params.key)}>
        <Menu.Item key={MODE_CREATE_EDGE}>
          单箭头
        </Menu.Item>
        <Menu.Item key={MODE_CREATE_EDGE_DOUBLE_ARROW}>
          双箭头
        </Menu.Item>
      </Menu>
    )
    const edgeMenu2 = (
      <Menu onClick={(params: any) => this.modeChange(params.key)}>
        <Menu.Item key={MODE_CREATE_L}>
          单箭头
        </Menu.Item>
        <Menu.Item key={MODE_CREATE_L_DOUBLE_ARROW}>
          双箭头
        </Menu.Item>
      </Menu>
    )
    return (
      <div className="topology">
        <div className="topo-bar" draggable={false}>
          <img onClick={this.modeChange.bind(this, MODE_DEFAULT)} className={`${this.state.mode === MODE_DEFAULT ? 'active' : ''}`} src={require('../assets/pointer.svg')} title="默认模式" />
          <img onClick={this.modeChange.bind(this, MODE_VIEW)} className={`${this.state.mode === MODE_VIEW ? 'active' : ''}`} src={require('../assets/move.svg')} title="浏览模式" />
          <img onClick={this.modeChange.bind(this, MODE_AREA_PICK)} className={`${this.state.mode === MODE_AREA_PICK ? 'active' : ''}`} src={require('../assets/area_pick.svg')} title="框选模式" />
          <img onClick={this.modeChange.bind(this, MODE_BORDER)} className={`${this.state.mode === MODE_BORDER ? 'active' : ''}`} src={require('../assets/box_resize.svg')} title="边框模式" />
          <img src={require('../assets/zoom_out.svg')} onClick={this.zoomOut} title="缩小" />
          <img src={require('../assets/zoom_in.svg')} onClick={this.zoomIn} title="放大" />
          <Dropdown overlay={edgeMenu} placement="bottomCenter">
            <div className={`menu-item ${[MODE_CREATE_EDGE, MODE_CREATE_EDGE_DOUBLE_ARROW].includes(mode) ? 'active' : ''}`}>
              <img src={require('../assets/line_2.svg')} title="创建连线" />
              {/* <span>单箭头</span> */}
            </div>
          </Dropdown>
          <Dropdown overlay={edgeMenu2} placement="bottomCenter">
            <div className={`menu-item ${[MODE_CREATE_L, MODE_CREATE_L_DOUBLE_ARROW].includes(mode) ? 'active' : ''}`}>
              <img src={require('../assets/L_line.svg')} title="创建L连线" />
            </div>
          </Dropdown>
          <img src={require('../assets/save.svg')} onClick={this.saveData} title="保存" />
        </div>
        <NodePanel />
        <div ref={this.containerRef} className="topo-chart" />
      </div>
    )
  }
}