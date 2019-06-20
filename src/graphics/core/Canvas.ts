import { ContextMenu } from '../contextMenu/ContextMenu'
import { globalEvent, EventEmitter } from '../events/eventEmitter'
import { Vector2d } from '../utils/vector2d'
import { CanvasNode } from '../graph/CanvasNode'
import { DomNode } from '../graph/DomNode'
import { Edge } from '../graph/Edge'
import { throttle } from '../utils/utils'
import ResizeObserver from 'resize-observer-polyfill'
import Node from '../graph/Node'
import VirtualNode from '../graph/VirtualNode'
import modes, { MODE_DEFAULT } from '../mode/modes'
import style from './canvas.less'
interface ICanvasOptions {
  container: HTMLElement
  maxScale?: number
  minScale?: number
}
export class Canvas {
  private mounted: boolean = false
  private _running: boolean = false
  private _animationFrameId: number = 0
  protected name: string = 'application'
  public eventEmitter: EventEmitter = globalEvent
  public nativeEvent: Event | null = null
  public optimize: boolean = true
  // 交互模式
  interactionMode: string = MODE_DEFAULT
  // 最外层div
  protected container: HTMLElement
  // canvas与div的容器
  protected wrapper: HTMLDivElement = document.createElement('div')
  public containerClientRect: ClientRect | undefined
  // 主画布(用于绘制图形) 位于图层最底层
  protected graphCanvas: HTMLCanvasElement = document.createElement('canvas')
  public graphCanvasCtx: CanvasRenderingContext2D
  // dom节点画布(用于渲染dom节点) 位于图层中间层
  public domCanvas: HTMLDivElement = document.createElement('div')
  // 交互画布(交互时用到的辅助画布) 位于图层最顶层
  protected topCanvas: HTMLCanvasElement = document.createElement('canvas')
  public topCanvasCtx: CanvasRenderingContext2D
  // 辅助节点(不需要实际渲染的)
  public virtualNode: VirtualNode = new VirtualNode({
    x: 0,
    y: 0
  })

  public mousedownPosition: Vector2d = new Vector2d(0, 0)
  public mouseupPosition: Vector2d = new Vector2d(0, 0)
  public mousemovePosition: Vector2d = new Vector2d(0, 0)
  // canvas节点
  public canvasNodes: CanvasNode[] = []
  // dom节点
  public domNodes: DomNode[] = []
  // 连线
  public edges: Edge[] = []
  // 活动的元素
  public activeNodes: Node[] = []
  public activeEdges: Edge[] = []
  // resize监听器
  private ro: ResizeObserver
  // 画布
  viewWidth: number = 0
  viewHeight: number = 0
  canvasWidth: number = 0
  canvasHeight: number = 0
  canvasScale: number = 1
  maxScale: number
  minScale: number
  // 重绘
  repaint: boolean = false
  // menu
  contextMenu: ContextMenu = new ContextMenu(this)

  constructor(options: ICanvasOptions) {
    this.container = options.container
    this.wrapper.className = style.topology
    this.graphCanvasCtx = this.graphCanvas.getContext('2d') as CanvasRenderingContext2D
    this.topCanvasCtx = this.topCanvas.getContext('2d') as CanvasRenderingContext2D
    this.maxScale = options.maxScale || 5
    this.minScale = options.minScale || 0.1
    this.ro = new ResizeObserver((entries, observer) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        this.viewWidth = width
        this.viewHeight = height
        this.canvasWidth = width / this.canvasScale
        this.canvasHeight = height / this.canvasScale
        this.containerClientRect = this.container.getBoundingClientRect()
      }
      this.mount()
      this.render()
      this.optimizeNode()
      this.repaint = true
      // this.renderEdge()
    })
    this.ro.observe(this.container)
    this.nativeEventInit()
    this.globalEventInit()
  }
  // 原生事件监听
  protected nativeEventInit() {
    this.wrapper.addEventListener('click', this.handleClick)
    this.wrapper.addEventListener('mousedown', this.handleMouseDown)
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.handleMouseUp)
    this.wrapper.addEventListener('wheel', this.handleWheel)
    this.wrapper.addEventListener('dragover', this.handleDragOver)
    this.wrapper.addEventListener('drop', this.handleDrop)
    this.wrapper.addEventListener('contextmenu', this.handleContextMenu)
  }
  // 全局事件监听
  private globalEventInit() { }
  /**
   * 销毁
   */
  public destroy() {
    this.wrapper.removeEventListener('click', this.handleClick)
    this.wrapper.removeEventListener('mousedown', this.handleMouseDown)
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
    this.wrapper.removeEventListener('wheel', this.handleWheel)
    this.wrapper.removeEventListener('dragover', this.handleDragOver)
    this.wrapper.removeEventListener('drop', this.handleDrop)
    this.ro.unobserve(this.container)
    this.ro.disconnect()
    this.unmount()
    this.removeAllNode()
  }
  // 添加节点
  public addNode(node: Node) {
    if (node instanceof CanvasNode) {
      if (this.canvasNodes.find(item => item === node)) return
      node.visible = node.isInRect(this.canvasVisibleRect)
      let index = this.canvasNodes.length - 1
      let current = this.canvasNodes[index]
      while (current) {
        if (current.zIndex <= node.zIndex) {
          this.canvasNodes.splice(index, 0, node)
          break
        }
        index--
        current = this.canvasNodes[index]
      }
      if (!current) {
        this.canvasNodes.unshift(node)
      }
    } else if (node instanceof DomNode) {
      if (this.domNodes.find(item => item === node)) return
      node.visible = node.isInRect(this.canvasVisibleRect)
      let index = this.domNodes.length - 1
      let current = this.domNodes[index]
      while (current) {
        if (current.zIndex <= node.zIndex) {
          this.domNodes.splice(index, 0, node)
          break
        }
        index--
        current = this.domNodes[index]
      }
      if (!current) {
        this.domNodes.unshift(node)
      }
    }
    node.canvas = this
    this.repaint = true
  }
  /**
   * 将节点置顶显示
   * @param node 
   */
  public setNodeTop(node: Node) {
    if (node instanceof CanvasNode) {
      const length = this.canvasNodes.length
      if (length) {
        const index = this.canvasNodes.findIndex(item => item === node)
        if (index === -1 || length - 1 === index) return
        const lastNode = this.canvasNodes[length - 1]
        node.zIndex = lastNode.zIndex
        // 放到队列最后
        this.canvasNodes.splice(index, 1)
        this.canvasNodes.push(node)
        this.repaint = true
      }
      return
    }
    if (node instanceof DomNode) {
      const length = this.domNodes.length
      if (length) {
        const index = this.domNodes.findIndex(item => item === node)
        if (index === -1 || length - 1 === index) return
        const lastNode = this.domNodes[length - 1]
        node.zIndex = lastNode.zIndex
        // 放到队列最后
        this.domNodes.splice(index, 1)
        this.domNodes.push(node)
        node.isUpdate = true
        node.unmount(this)
        node.mount(this)
        this.repaint = true
      }
    }
  }
  // 删除节点
  public removeNode(node: Node) {
    let index
    if (node instanceof CanvasNode) {
      index = this.canvasNodes.findIndex(item => item === node)
      if (index > -1) {
        node.destroy()
        this.canvasNodes.splice(index, 1)
      }
    } else if (node instanceof DomNode) {
      index = this.domNodes.findIndex(item => item === node)
      if (index > -1) {
        node.unmount(this)
        node.destroy()
        this.domNodes.splice(index, 1)
      }
    } else {
      console.log(`不支持的renderType: ${node.renderType}`)
    }
    node.destroy()
    // 把相连的edge也删掉
    const edges: Edge[] = []
    this.edges.forEach(edge => {
      if (edge.targetNode === node || edge.sourceNode === node) {
        edges.push(edge)
      }
    })
    edges.forEach(edge => {
      this.removeEdge(edge)
    })
    this.repaint = true
  }

  /**
   * 删除所有节点
   */
  public removeAllNode() {
    const nodes: Node[] = [...this.canvasNodes, ...this.domNodes]
    nodes.forEach(node => {
      this.removeNode(node)
    })
  }

  // 添加连线
  public addEdge(edge: Edge) {
    if (this.edges.find(item => item === edge)) return
    this.edges.push(edge)
    edge.canvas = this
    this.repaint = true
  }
  // 删除连线
  public removeEdge(edge: Edge) {
    const index = this.edges.findIndex(item => item === edge)
    if (index > -1) {
      this.edges.splice(index, 1)
    }
    this.repaint = true
  }

  /**
   * 将视口坐标转换成画布坐标。注：不考虑缩放
   * @param coordinate 鼠标位于视口的坐标
   */
  viewportToCanvasCoordinate(coordinate: Vector2d) {
    if (!this.containerClientRect) {
      this.containerClientRect = this.container.getBoundingClientRect()
    }
    const { top, left } = this.containerClientRect
    return coordinate.substract(new Vector2d(left, top))
  }
  /**
   * 将画布坐标转换称像素坐标
   * @param coordinate 画布坐标
   */
  canvasToPixelCoordinate(coordinate: Vector2d) {
    return coordinate.scale(1 / this.canvasScale)
  }

  /**
   * 将视口坐标转换成像素坐标
   * @param coordinate 
   */
  viewPortTopixelCoordinate(coordinate: Vector2d) {
    return this.canvasToPixelCoordinate(this.viewportToCanvasCoordinate(coordinate))
  }

  get canvasVisibleRect() {
    return [
      new Vector2d(0, 0), // 左上
      new Vector2d(this.canvasWidth, 0), // 右上
      new Vector2d(this.canvasWidth, this.canvasHeight), // 右下
      new Vector2d(0, this.canvasHeight) // 左下
    ]
  }

  /**
   * 画布放大
   * @param focus 缩放焦点相对于视口的坐标
   */
  zoomIn(focus?: Vector2d) {
    focus = focus ? this.viewportToCanvasCoordinate(focus) : new Vector2d(this.viewWidth / 2, this.viewHeight / 2)
    const coordinate = this.canvasToPixelCoordinate(focus)
    this.canvasScale += 0.15
    this.canvasScale = this.canvasScale > this.maxScale ? this.maxScale : this.canvasScale
    const newCoordinate = this.canvasToPixelCoordinate(focus)

    this.canvasWidth = this.viewWidth / this.canvasScale
    this.canvasHeight = this.viewHeight / this.canvasScale

    const offset = newCoordinate.substract(coordinate)
    const nodes: (DomNode | CanvasNode)[] = [...this.domNodes, ...this.canvasNodes]
    nodes.forEach(node => {
      node.position = node.position.add(offset)
      node.isUpdate = true
    })
    this.optimizeNode()
    this.render()
    this.repaint = true
  }

  /**
   * 画布缩小
   * @param focus 缩放焦点相对于视口的坐标
   */
  zoomOut(focus?: Vector2d) {
    // 默认:画布中心
    focus = focus ? this.viewportToCanvasCoordinate(focus) : new Vector2d(this.viewWidth / 2, this.viewHeight / 2)
    const coordinate = this.canvasToPixelCoordinate(focus)
    this.canvasScale -= 0.15
    this.canvasScale = this.canvasScale < this.minScale ? this.minScale : this.canvasScale
    const newCoordinate = this.canvasToPixelCoordinate(focus)

    this.canvasWidth = this.viewWidth / this.canvasScale
    this.canvasHeight = this.viewHeight / this.canvasScale

    const offset = newCoordinate.substract(coordinate)
    const nodes: (DomNode | CanvasNode)[] = [...this.domNodes, ...this.canvasNodes]
    nodes.forEach(node => {
      node.position = node.position.add(offset)
      node.isUpdate = true
    })
    this.optimizeNode()
    this.render()
    this.repaint = true
  }

  /**
   * 切换模式
   * @param mode 
   */
  changeMode(mode: string) {
    if (!modes[mode]) {
      console.log(`该模式不存在:${mode}`)
      return
    }
    const interactions = modes[this.interactionMode]
    if (interactions) {
      interactions.forEach(action => {
        action.onModeChange(this)
      })
    }
    this.interactionMode = mode
  }

  /**
   * 点击事件
   */
  private handleClick = (e: MouseEvent) => {
    this.nativeEvent = e
    const interactions = modes[this.interactionMode]
    if (interactions) {
      interactions.forEach(action => {
        action.onClick(this, e)
      })
    }
    this.eventEmitter.emit('canvas:click', e)
  }

  /**
   * 滚轮事件
   */
  private handleWheel = (e: Event) => {
    const interactions = modes[this.interactionMode]
    if (interactions) {
      interactions.forEach(action => {
        action.onWheel(this, e)
      })
    }
    this.eventEmitter.emit('canvas:wheel', e)
  }
  /**
   * 鼠标按下
   */
  private handleMouseDown = (e: MouseEvent) => {
    this.nativeEvent = e
    this.mousedownPosition = new Vector2d(e.clientX, e.clientY)
    const interactions = modes[this.interactionMode]
    if (interactions) {
      interactions.forEach(action => {
        action.onMouseDown(this, e)
      })
    }

    this.eventEmitter.emit('canvas:mousedown', e)
  }
  /**
   * 鼠标移动
   */
  private handleMouseMove = throttle((e: MouseEvent) => {
    if (!this.nativeEvent) return
    this.nativeEvent = e
    // console.log('mousemove', e)
    this.mousemovePosition = new Vector2d(e.clientX, e.clientY)

    const interactions = modes[this.interactionMode]
    if (interactions) {
      interactions.forEach(action => {
        action.onMouseMove(this, e)
      })
    }
    // 判断节点是否在可视区域
    this.optimizeNode()
    this.eventEmitter.emit('canvas:mousemove', e)
  })
  /**
   * 鼠标按键释放
   */
  private handleMouseUp = (e: MouseEvent) => {
    this.nativeEvent = e
    this.mouseupPosition = new Vector2d(e.clientX, e.clientY)
    const interactions = modes[this.interactionMode]
    if (interactions) {
      interactions.forEach(action => {
        action.onMouseUp(this, e)
      })
    }
    this.eventEmitter.emit('canvas:mouseup', e)
  }
  /**
   * 拖拽over事件
   */
  private handleDragOver = (e: DragEvent) => {
    const interactions = modes[this.interactionMode]
    if (interactions) {
      interactions.forEach(action => {
        action.onDragOver(this, e)
      })
    }
  }
  /**
   * 拖拽释放事件
   */
  private handleDrop = (e: DragEvent) => {
    const interactions = modes[this.interactionMode]
    if (interactions) {
      interactions.forEach(action => {
        action.onDrop(this, e)
      })
    }
  }
  private handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    const interactions = modes[this.interactionMode]
    if (interactions) {
      interactions.forEach(action => {
        action.onContextMenu(this, e)
      })
    }
  }
  /**
   * 优化节点显示
   */
  optimizeNode() {
    if (!this.optimize) return
    this.domNodes.forEach(node => {
      node.visible = node.isInRect(this.canvasVisibleRect)
    })
  }
  render() {
    Object.assign(this.domCanvas.style, {
      width: `${this.canvasWidth}px`,
      height: `${this.canvasHeight}px`,
      left: `${(this.viewWidth - this.canvasWidth) / 2}px`,
      top: `${(this.viewHeight - this.canvasHeight) / 2}px`,
      transform: `scale(${this.canvasScale})`
    })
    this.graphCanvas.width = this.topCanvas.width = this.viewWidth
    this.graphCanvas.height = this.topCanvas.height = this.viewHeight
  }
  mount() {
    if (this.mounted) return
    this.wrapper.appendChild(this.graphCanvas)
    this.wrapper.appendChild(this.domCanvas)
    this.container.appendChild(this.wrapper)
    this.eventEmitter.emit('canvas:mounted')
    this.mounted = true
  }
  unmount() {
    if (!this.mounted) return
    this.container.removeChild(this.wrapper)
    this.mounted = false
  }
  start() {
    if (this._running) return
    this._running = true
    this.loop()
  }
  stop() {
    if (!this._running) return
    cancelAnimationFrame(this._animationFrameId)
    this._running = false
  }
  loop() {
    if (!this._running) return
    this._animationFrameId = requestAnimationFrame(() => {
      this.renderDomNodes()
      // 判断是否需要重绘
      if (this.repaint) {
        this.graphCanvasCtx.clearRect(0, 0, this.viewWidth, this.viewHeight)
        this.graphCanvasCtx.save()
        this.graphCanvasCtx.scale(this.canvasScale, this.canvasScale)
        this.renderEdge()
        this.graphCanvasCtx.restore()
        this.repaint = false
      }
      this.loop()
    })
  }
  /**
   * 渲染连线
   */
  private renderEdge() {
    this.edges.forEach(edge => {
      edge.render(this)
    })
  }
  private renderDomNodes() {
    this.domNodes.forEach(node => {
      if (node.visible) {
        node.mount(this)
        if (node.isUpdate) {
          node.render(this)
          node.isUpdate = false
        }
      } else {
        node.unmount(this)
      }
    })
  }
  /**
   * 渲染节点
   */
  private renderNode() {
    // this.canvasNodes.forEach(node => {
    //   node.render(this)
    // })
  }
}

export default Canvas