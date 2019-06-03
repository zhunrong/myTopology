import EventEmitter, { globalEvent } from '../class/eventEmitter'
import Vector2d from '../utils/vector2d'
import ResizeObserver from 'resize-observer-polyfill'
import { throttle } from '../utils/utils'
interface IAPPOptions {
  container: HTMLElement
}
export default class Application {
  mounted: boolean = false
  protected name: string = 'application'
  protected eventEmitter: EventEmitter = globalEvent
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
  // containerRef: React.RefObject<HTMLDivElement> = React.createRef()
  // canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()
  // divRef: React.RefObject<HTMLDivElement> = React.createRef()
  protected shapes: any[] = []
  // 活动的元素
  protected activeShapes: any[] = []
  protected activeShapeIds: Set<number> = new Set()
  private ro: ResizeObserver
  // 画布
  viewWidth: number = 0
  viewHeight: number = 0
  canvasWidth: number = 0
  canvasHeight: number = 0
  canvasScale: number = 1
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
        if (this.canvas) {
          this.canvas.width = width
          this.canvas.height = height
        }
      }
      this.render(this.container)
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
  }
  // 全局事件监听
  private globalEventInit() {
    globalEvent.on('register:node', this.handleRegisterNode)
    globalEvent.on('unregister:node', this.handleUnregister)
    globalEvent.on('zoomIn', this.handleZoomIn)
    globalEvent.on('zoomOut', this.handleZoomOut)
  }
  // 注册节点
  private handleRegisterNode = (node: any) => {
    console.log('register:node', node)
    node.render(this.root)
    this.shapes.push(node)
  }
  // 注册连线
  private handleRegisterEdge = (edge: any) => {
    console.log('register:edge', edge)
  }
  // 注销图形
  private handleUnregister = (shape: any) => {
    const index = this.shapes.findIndex(item => item === shape)
    this.shapes.splice(index, 1)
  }
  private handleZoomIn = () => {
    console.log('zoom in')
    this.canvasScale += 0.1
    this.canvasWidth = this.viewWidth / this.canvasScale
    this.canvasHeight = this.viewHeight / this.canvasScale
  }
  private handleZoomOut = () => {
    this.canvasScale *= 0.9
    this.canvasWidth = this.viewWidth / this.canvasScale
    this.canvasHeight = this.viewHeight / this.canvasScale
    console.log('zoom out')
  }
  private handleClick = (e: MouseEvent) => {
    // console.log('click', e)
    this.eventEmitter.emit('click')
  }
  private handleMouseDown = (e: MouseEvent) => {
    console.log('mousedown', e)
    const target = e.target as HTMLElement
    if (!target) return
    // this.activeShapeIds.clear()
    // const shapeId = Number(target.dataset.shapeId)
    // if (shapeId) {
    //   this.activeShapeIds.add(shapeId)
    // }
    const activeShape = this.shapes.find(shape => {
      return shape.hitTest(e)
    })
    console.log(activeShape)
    if (activeShape) {
      this.activeShapes = [activeShape]
    } else {
      this.activeShapes = this.shapes
    }
    this.cachePositions = this.activeShapes.map(shape => shape.position)


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


    this.activeShapes.forEach((shape, index) => {
      shape.position = this.cachePositions[index].add(this.mousemovePosition.substract(this.mousedownPosition))
      shape.render()
    })
  })
  private handleMouseUp = (e: MouseEvent) => {
    // console.log('mouseup', e)
    this.mouseupPosition = new Vector2d(e.clientX, e.clientY)
    this.eventEmitter.emit('mouseup', {
      mousePosition: this.mouseupPosition,
      movement: this.mouseupPosition.substract(this.mousedownPosition)
    })
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
  }
  render(parentNode: HTMLElement) {
    if (!this.mounted) {
      parentNode.append(this.wrapper)
      this.wrapper.appendChild(this.canvas)
      this.wrapper.appendChild(this.root)
      this.mounted = true
    }
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
      transform: `scale(${this.canvasScale})`
    })
  }
}