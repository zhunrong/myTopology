import React, { Component } from 'react'
import { MODE_DEFAULT, MODE_VIEW, MODE_CREATE_EDGE, MODE_AREA_PICK, MODE_CREATE_L, MODE_BORDER } from '../graphics'
import { Canvas, CircleCanvasNode, Line as Edge, RectCanvasGroup, RectDomGroup, CircleCanvasGroup, L, Img, Node } from '../graphics'
// plugins
import { MiniMap, ContextMenu, IMenu } from '../graphics'
// layout
import { CircularLayout, MatrixLayout } from '../graphics'
import CustomNode from '../components/node/Node'
// import CustomCanvasNode from '../components/node/CanvasNode'
import NodePanel from '../components/nodePanel/nodePanel'
import { Menu, Dropdown } from 'antd'
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

// type Node = CircleCanvasNode | RectCanvasNode | RectDomNode | CustomNode

export default class Topology extends Component<IProps, IState> {
  nodes: Node[] = []
  edges: Edge[] = []
  containerRef: React.RefObject<HTMLDivElement> = React.createRef()
  miniMapRef = React.createRef<HTMLDivElement>()
  canvas!: Canvas
  circularLayout!: CircularLayout
  matrixLayout!: MatrixLayout
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
      this.canvas.animate = true

      // mini map
      const map = new MiniMap()
      map.mount(this.miniMapRef.current as HTMLElement)
      this.canvas.use(map)

      // context menu
      const menu = new ContextMenu()
      this.canvas.use(menu)
      menu.onContextMenu = (instance, target, activeNodes, activeEdges) => {
        const menu: IMenu[] = []
        switch (this.canvas.interactionMode) {
          case MODE_DEFAULT:
            if (target) {
              menu.push({
                label: '重命名',
                command: 'rename',
                target
              }, {
                label: '删除',
                command: 'remove',
                target
              })
            }
            menu.push({
              label: '环形布局',
              command: 'circularLayout'
            }, {
              label: '行列布局',
              command: 'matrixLayout'
            })
            break
        }
        return menu
      }

      this.canvas.eventEmitter.on('canvas:mounted', () => {
        this.canvas.removeAllNode()
        const topoData = JSON.parse(localStorage.getItem('topoData') || JSON.stringify({ nodes: [], edges: [], zoom: 1 }))
        this.canvas.setZoom(topoData.zoom || 1)
        this.nodes = topoData.nodes.map((item: any) => {
          switch (item.nodeType) {
            case 'rectGroup':
              return new RectDomGroup({
                width: item.width,
                height: item.height,
                id: item.id,
                x: item.x,
                y: item.y,
                data: item,
                isExpanded: item.isExpanded
              })
            case 'circleGroup':
              return new CircleCanvasGroup({
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
              return new RectCanvasGroup({
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
              edge.animate.element = new Img(require('../assets/双箭头.png'))
              edge.animate.duration = 5000
              this.canvas.addEdge(edge)
            } else {
              const edge = new L({
                sourceNode,
                targetNode,
                dash: item.dash,
                arrow: item.arrow,
                text: item.text
              })
              edge.animate.element = new Img(require('../assets/绿箭头.png'))
              edge.animate.duration = 4000
              this.canvas.addEdge(edge)
            }
          }
        })

        // const horizontalLayout = new HorizontalLayout(this.canvas)
        this.circularLayout = new CircularLayout(this.canvas)
        this.matrixLayout = new MatrixLayout(this.canvas)

      })
      this.canvas.eventEmitter.on('canvas:drop', (params) => {
        const { coordinate, dataTransfer } = params

        let node: Node | undefined
        const type = dataTransfer.getData('nodeType')
        const id = Math.random()
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
              text: type,
              deviceType: type,
              id
            })
            break
          case 'rect group':
            node = new RectDomGroup({
              width: 100,
              height: 100,
              x: coordinate.x - 50,
              y: coordinate.y - 50,
              id
            })
            break
          case 'circle group':
            node = new CircleCanvasGroup({
              radius: 50,
              x: coordinate.x - 50,
              y: coordinate.y - 50,
              id
            })
            break
          default:
            node = new CircleCanvasNode({
              text: 'new Circle',
              x: coordinate.x - 40,
              y: coordinate.y - 40,
              radius: 40,
              id
            })
        }

        if (node) {
          this.canvas.addNode(node)
        }
      })
      this.canvas.eventEmitter.on('canvas:menu', (menu: IMenu) => {
        switch (menu.command) {
          case 'rename':
            setTimeout(() => {
              const newName = prompt('请输入新名称', menu.target.text)
              menu.target.text = newName
            }, 200)
            break
          case 'remove':
            if (menu.target instanceof Node) {
              this.canvas.removeNode(menu.target)
            } else if (menu.target instanceof Edge) {
              this.canvas.removeEdge(menu.target)
            }
            break
          case 'circularLayout':
            this.circularLayout.duration = 1000
            this.circularLayout.gap = 10
            this.circularLayout.nodeRadius = 40 * Math.sqrt(2)
            // this.circularLayout.radius = 0
            // this.circularLayout.endAngle = 0
            this.circularLayout.endAngle = Math.PI * 6
            // this.circularLayout.clockwise = false
            this.circularLayout.layout()
            break
          case 'matrixLayout':
            this.matrixLayout.rows = 5
            // this.matrixLayout.columns = 2
            this.matrixLayout.layout()
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
      if (node instanceof RectCanvasGroup) {
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
      } else if (node instanceof CircleCanvasGroup) {
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
      } else if (node instanceof RectDomGroup) {
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
        <div ref={this.miniMapRef} className="mini-map" draggable={false}></div>
      </div>
    )
  }
}