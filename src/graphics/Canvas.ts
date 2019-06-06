import EventEmitter, { globalEvent } from '../events/eventEmitter'
import Vector2d from '../utils/vector2d'
import ResizeObserver from 'resize-observer-polyfill'
import { throttle } from '../utils/utils'
import ANode from './ANode'
import AEdge from './AEdge'
interface IAPPOptions {
  container: HTMLElement
}
export default class Application {
  private _mounted: boolean = false
  private _running: boolean = false
  private _animationFrameId: number = 0
  protected name: string = 'application'
  public eventEmitter: EventEmitter = globalEvent
  public nativeEvent: MouseEvent | null = null
  // 最外层div
  protected wrapper: HTMLDivElement = document.createElement('div')
  // canvas与div的容器
  protected container: HTMLElement
  public containerClientRect: ClientRect | undefined
  // canvas
  protected canvas: HTMLCanvasElement = document.createElement('canvas')
  // 根节点
  public root: HTMLDivElement = document.createElement('div')

  public canvasContext: CanvasRenderingContext2D
  private mousedownPosition: Vector2d = new Vector2d(0, 0)
  private mouseupPosition: Vector2d = new Vector2d(0, 0)
  private mousemovePosition: Vector2d = new Vector2d(0, 0)

  // canvas节点
  protected canvasNodes: ANode[] = []
  // dom节点
  protected domNodes: ANode[] = []
  // 连线
  protected edges: AEdge[] = []
  // 活动的元素
  protected activeNodes: ANode[] = []
  protected activeShapeIds: Set<number> = new Set()
  // resize监听器
  private ro: ResizeObserver
  // 画布
  viewWidth: number = 0
  viewHeight: number = 0
  canvasWidth: number = 0
  canvasHeight: number = 0
  canvasScale: number = 1
  // 重绘
  updateCanvas: boolean = false
  // 拖拽
  cachePositions: Vector2d[] = []

  constructor(options: IAPPOptions) {
    this.container = options.container
    this.canvasContext = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.ro = new ResizeObserver((entries, observer) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        this.viewWidth = width
        this.viewHeight = height
        this.canvasWidth = width / this.canvasScale
        this.canvasHeight = height / this.canvasScale
        this.containerClientRect = this.container.getBoundingClientRect()
      }
      this.render(this.container)
      this.renderEdge()
    })
    this.ro.observe(this.container)
    this.nativeEventInit()
    this.globalEventInit()
    console.log(this)
  }
  // 原生事件监听
  protected nativeEventInit() {
    if (!this.wrapper) return
    this.wrapper.addEventListener('click', this.handleClick)
    this.wrapper.addEventListener('mousedown', this.handleMouseDown)
    this.wrapper.addEventListener('mousewheel', this.handleMouseWheel)
  }
  // 全局事件监听
  private globalEventInit() {
  }
  // 添加节点
  public addNode(node: ANode) {
    if (node.renderType === 'canvas') {
      if (this.canvasNodes.find(item => item === node)) return
      this.canvasNodes.push(node)
    } else if (node.renderType === 'dom') {
      if (this.domNodes.find(item => item === node)) return
      this.domNodes.push(node)
    } else {
      console.log(`不支持的renderType: ${node.renderType}`)
      return
    }
    node.visible = node.isInVisibleRect(this.canvasVisibleRect)
    node.render(this)
  }
  // 删除节点
  public removeNode(node: ANode) {
    let index
    if (node.renderType === 'canvas') {
      index = this.canvasNodes.findIndex(item => item === node)
      if (index > -1) {
        this.canvasNodes.splice(index, 1)
      }
    } else if (node.renderType === 'dom') {
      index = this.domNodes.findIndex(item => item === node)
      if (index > -1) {
        this.domNodes.splice(index, 1)
      }
    } else {
      console.log(`不支持的renderType: ${node.renderType}`)
    }
  }

  // 添加连线
  public addEdge(edge: AEdge) {
    if (this.edges.find(item => item === edge)) return
    edge.render(this)
    this.edges.push(edge)
  }
  // 删除连线
  public removeEdge(edge: AEdge) {
    const index = this.edges.findIndex(item => item === edge)
    if (index > -1) {
      this.edges.splice(index, 1)
    }
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
    this.canvasScale += 0.1
    const newCoordinate = this.canvasToPixelCoordinate(focus)
    this.canvasWidth = this.viewWidth / this.canvasScale
    this.canvasHeight = this.viewHeight / this.canvasScale
    const offset = newCoordinate.substract(coordinate)
    this.domNodes.forEach(node => {
      node.position = node.position.add(offset)
    })
    this.canvasNodes.forEach(node => {
      node.position = node.position.add(offset)
    })
    this.optimizeNode()
    this.render(this.container)
    this.renderNode()
    this.renderEdge()
  }

  /**
   * 画布缩小
   * @param focus 缩放焦点相对于视口的坐标
   */
  zoomOut(focus?: Vector2d) {
    // 默认:画布中心
    focus = focus ? this.viewportToCanvasCoordinate(focus) : new Vector2d(this.viewWidth / 2, this.viewHeight / 2)
    const coordinate = this.canvasToPixelCoordinate(focus)
    this.canvasScale *= 0.9
    const newCoordinate = this.canvasToPixelCoordinate(focus)

    this.canvasWidth = this.viewWidth / this.canvasScale
    this.canvasHeight = this.viewHeight / this.canvasScale

    const offset = newCoordinate.substract(coordinate)
    this.domNodes.forEach(node => {
      node.position = node.position.add(offset)
    })
    this.canvasNodes.forEach(node => {
      node.position = node.position.add(offset)
    })
    this.optimizeNode()
    this.render(this.container)
    this.renderNode()
    this.renderEdge()
  }

  private handleClick = (e: MouseEvent) => {
    // console.log('click', e)
    this.eventEmitter.emit('click')
  }

  /**
   * 处理鼠标滚轮事件
   */
  private handleMouseWheel = (e: Event) => {
    const { deltaY, clientX, clientY } = e as WheelEvent
    if (deltaY > 0) {
      this.zoomOut(new Vector2d(clientX, clientY))
    } else {
      this.zoomIn(new Vector2d(clientX, clientY))
    }
  }
  private handleMouseDown = (e: MouseEvent) => {
    this.nativeEvent = e
    const target = e.target as HTMLElement
    if (!target) return
    this.updateCanvas = true

    let activeNode: ANode | undefined
    if (e.target === this.root) {
      activeNode = this.canvasNodes.find(node => node.hitTest(this))
    } else {
      activeNode = this.domNodes.find(node => node.hitTest(this))
    }
    if (activeNode) {
      this.activeNodes = [activeNode]
    } else {
      this.activeNodes = this.domNodes.concat(this.canvasNodes)
    }
    this.cachePositions = this.activeNodes.map(node => node.position)


    this.mousedownPosition = new Vector2d(e.clientX, e.clientY)
    this.eventEmitter.emit('mousedown', {})
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.handleMouseUp)
  }
  private handleMouseMove = throttle((e: MouseEvent) => {
    if (!this.nativeEvent) return
    this.nativeEvent = e
    // console.log('mousemove', e)
    this.mousemovePosition = new Vector2d(e.clientX, e.clientY)
    // this.viewportToCanvasCoordinate(new Vector2d(e.clientX, e.clientY))
    this.eventEmitter.emit('mousemove', {})

    // 判断节点是否在可视区域
    this.optimizeNode()
    this.activeNodes.forEach((node, index) => {
      node.position = this.cachePositions[index].add(this.mousemovePosition.substract(this.mousedownPosition).scale(1 / this.canvasScale))
      // node.position = node.position.add(offset)
    })
  })
  private handleMouseUp = (e: MouseEvent) => {
    this.nativeEvent = e
    // this.stop()
    // console.log('mouseup', e)
    this.updateCanvas = false
    this.mouseupPosition = new Vector2d(e.clientX, e.clientY)
    this.eventEmitter.emit('mouseup', {})
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
  }
  /**
   * 优化节点显示
   */
  optimizeNode() {
    this.domNodes.forEach(node => {
      node.visible = node.isInVisibleRect(this.canvasVisibleRect)
    })
  }
  render(parentNode: HTMLElement) {
    Object.assign(this.root.style, {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      userSelect: 'none'
    })
    Object.assign(this.wrapper.style, {
      position: 'absolute',
      width: `${this.canvasWidth}px`,
      height: `${this.canvasHeight}px`,
      overflow: 'hidden',
      left: `${(this.viewWidth - this.canvasWidth) / 2}px`,
      top: `${(this.viewHeight - this.canvasHeight) / 2}px`,
      transform: `scale(${this.canvasScale})`,
      transformOrigin: 'center center'
    })
    this.canvas.width = this.canvasWidth
    this.canvas.height = this.canvasHeight
    if (!this._mounted) {
      parentNode.append(this.wrapper)
      this.wrapper.appendChild(this.canvas)
      this.wrapper.appendChild(this.root)
      this.eventEmitter.emit('canvas:mounted')
      this._mounted = true
    }
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
      if (this.updateCanvas) {
        this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        this.renderEdge()
        this.renderNode()
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
  /**
   * 渲染节点
   */
  private renderNode() {
    this.canvasNodes.forEach(node => {
      node.render(this)
    })
    this.domNodes.forEach(node => {
      node.render(this)
    })
  }
}