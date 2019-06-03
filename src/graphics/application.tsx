import React, { Component, ReactNode } from 'react'
import EventEmitter, { globalEvent } from '../class/eventEmitter'
import Vector2d from '../utils/vector2d'
import ResizeObserver from 'resize-observer-polyfill'
import { throttle } from '../utils/utils'
export default class Application<IProps = {}, IState = {}> extends Component<IProps, IState> {
  protected name: string = 'application'
  protected eventEmitter: EventEmitter = globalEvent
  protected container: HTMLElement | null = null
  protected canvasElement: HTMLCanvasElement | null = null
  protected canvasContext: CanvasRenderingContext2D | null = null
  private mousedownPosition: Vector2d = new Vector2d(0, 0)
  private mouseupPosition: Vector2d = new Vector2d(0, 0)
  private mousemovePosition: Vector2d = new Vector2d(0, 0)
  containerRef: React.RefObject<HTMLDivElement> = React.createRef()
  canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()
  divRef: React.RefObject<HTMLDivElement> = React.createRef()
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

  constructor(props: IProps) {
    super(props)
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
        if (this.canvasElement) {
          this.canvasElement.width = width
          this.canvasElement.height = height
        }
      }
      this.setState({})
    })
    globalEvent.on('register:node', this.handleRegisterNode)
    globalEvent.on('unregister:node', this.handleUnregister)
    globalEvent.on('zoomIn', this.handleZoomIn)
    globalEvent.on('zoomOut', this.handleZoomOut)
    console.log(this)
  }
  componentDidMount() {
    const container = this.containerRef.current
    const canvas = this.canvasRef.current
    if (container && container.parentElement && canvas) {
      this.container = container
      this.canvasElement = canvas
      this.canvasContext = canvas.getContext('2d')
      this.ro.observe(container.parentElement)
      this.nativeEventInit()
    }
  }
  protected nativeEventInit() {
    if (!this.container) return
    this.container.addEventListener('click', this.handleClick)
    this.container.addEventListener('mousedown', this.handleMouseDown)
  }
  // 注册节点
  private handleRegisterNode = (node: any) => {
    console.log('register:node', node)
    node.render(this.divRef.current)
    this.shapes.push(node)
  }
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
    this.setState({})
  }
  private handleZoomOut = () => {
    this.canvasScale *= 0.9
    this.canvasWidth = this.viewWidth / this.canvasScale
    this.canvasHeight = this.viewHeight / this.canvasScale
    this.setState({})
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
  render() {
    return (
      <div ref={this.containerRef} style={{
        position: 'absolute',
        width: this.canvasWidth,
        height: this.canvasHeight,
        overflow: 'hidden',
        left: (this.viewWidth - this.canvasWidth) / 2,
        top: (this.viewHeight - this.canvasHeight) / 2,
        transform: `scale(${this.canvasScale})`
      }}>
        <canvas ref={this.canvasRef}></canvas>
        <div ref={this.divRef} data-shape-id="0" className={'div'} style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          userSelect: 'none'
        }}>{this.props.children}</div>
      </div>
    )
  }
}