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
  protected container: HTMLElement
  // 最外层div
  protected wrapper: HTMLDivElement = document.createElement('div')
  // canvas
  protected canvas: HTMLCanvasElement = document.createElement('canvas')
  // 根节点
  protected root: HTMLDivElement = document.createElement('div')

  protected canvasContext: CanvasRenderingContext2D
  private mousedownPosition: Vector2d = new Vector2d(0, 0)
  private mouseupPosition: Vector2d = new Vector2d(0, 0)
  private mousemovePosition: Vector2d = new Vector2d(0, 0)

  // 节点
  protected nodes: ANode[] = []
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
        const { left, top, width, height } = entry.contentRect;
        this.viewWidth = width
        this.viewHeight = height
        this.canvasWidth = width / this.canvasScale
        this.canvasHeight = height / this.canvasScale
        console.log('Element:', entry.target);
        console.log(`Element's size: ${width}px x ${height}px`);
        console.log(`Element's paddings: ${top}px ; ${left}px`);
      }
      this.render(this.container)
      this.draw()
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
    globalEvent.on('zoomIn', this.handleZoomIn)
    globalEvent.on('zoomOut', this.handleZoomOut)
  }
  // 添加节点
  public addNode(node: ANode) {
    if (this.nodes.find(item => item === node)) return
    node.render(this.root, this.canvasContext)
    this.nodes.push(node)
  }
  // 删除节点
  public removeNode(node: ANode) {
    const index = this.nodes.findIndex(item => item === node)
    if (index > -1) {
      this.nodes.splice(index, 1)
    }
  }

  // 添加连线
  public addEdge(edge: AEdge) {
    if (this.edges.find(item => item === edge)) return
    edge.render(this.root, this.canvasContext)
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
   * 监听画布放大
   */
  private handleZoomIn = () => {
    this.zoomIn()
  }

  /**
   * 画布放大
   * @param focus 缩放焦点
   */
  zoomIn(focus?: Vector2d) {
    focus = focus || new Vector2d(this.viewWidth / 2, this.viewHeight / 2)
    const position = focus.scale(1 / this.canvasScale)
    this.canvasScale += 0.1
    const newPosition = focus.scale(1 / this.canvasScale)
    this.canvasWidth = this.viewWidth / this.canvasScale
    this.canvasHeight = this.viewHeight / this.canvasScale
    const v = newPosition.substract(position)
    this.nodes.forEach(node => {
      node.position = node.position.add(v)
    })
    this.render(this.container)
    this.draw()
  }

  /**
   * 画布缩小
   */
  private handleZoomOut = () => {
    this.zoomOut()
  }

  /**
   * 画布缩小
   * @param focus 
   */
  zoomOut(focus?: Vector2d) {
    // 默认:画布中心
    focus = focus || new Vector2d(this.viewWidth / 2, this.viewHeight / 2)
    const position = focus.scale(1 / this.canvasScale)
    this.canvasScale *= 0.9
    const newPosition = focus.scale(1 / this.canvasScale)

    this.canvasWidth = this.viewWidth / this.canvasScale
    this.canvasHeight = this.viewHeight / this.canvasScale

    const v = newPosition.substract(position)
    this.nodes.forEach(node => {
      node.position = node.position.add(v)
    })
    this.render(this.container)
    this.draw()
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
      this.zoomIn(new Vector2d(clientX, clientY))
    } else {
      this.zoomOut(new Vector2d(clientX, clientY))
    }
  }
  private handleMouseDown = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target) return
    this.updateCanvas = true
    // this.start()
    // this.activeShapeIds.clear()
    // const shapeId = Number(target.dataset.shapeId)
    // if (shapeId) {
    //   this.activeShapeIds.add(shapeId)
    // }
    const activeShape = this.nodes.find(shape => {
      return shape.hitTest(e)
    })
    if (activeShape) {
      this.activeNodes = [activeShape]
    } else {
      this.activeNodes = this.nodes
    }
    this.cachePositions = this.activeNodes.map(shape => shape.position)


    this.mousedownPosition = new Vector2d(e.clientX, e.clientY)
    this.eventEmitter.emit('mousedown', {
      mousePosition: this.mousedownPosition,
      activeShapeIds: this.activeShapeIds
    })
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.handleMouseUp)
  }
  private handleMouseMove = throttle((e: MouseEvent) => {
    // console.log('mousemove', e)
    this.mousemovePosition = new Vector2d(e.clientX, e.clientY)
    this.eventEmitter.emit('mousemove', {
      mousePosition: this.mousemovePosition,
      movement: this.mousemovePosition.substract(this.mousedownPosition),
      activeShapeIds: this.activeShapeIds
    })


    this.activeNodes.forEach((shape, index) => {
      shape.position = this.cachePositions[index].add(this.mousemovePosition.substract(this.mousedownPosition).scale(1 / this.canvasScale))
    })
  })
  private handleMouseUp = (e: MouseEvent) => {
    // this.stop()
    // console.log('mouseup', e)
    this.updateCanvas = false
    this.mouseupPosition = new Vector2d(e.clientX, e.clientY)
    this.eventEmitter.emit('mouseup', {
      mousePosition: this.mouseupPosition,
      movement: this.mouseupPosition.substract(this.mousedownPosition)
    })
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
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
      this.nodes.forEach(node => {
        node.render(this.root, this.canvasContext)
      })
      if (this.updateCanvas) {
        this.draw()
      }
      this.loop()
    })
  }
  draw() {
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    this.edges.forEach(edge => {
      edge.render(this.root, this.canvasContext)
    })
  }
}