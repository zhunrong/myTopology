import React, { Component, ReactNode } from 'react'
import EventEmitter, { globalEvent } from '../class/eventEmitter'
import Vector2d from '../utils/vector2d'
import ResizeObserver from 'resize-observer-polyfill'
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
  protected graphs: any[] = []
  // 活动的元素
  protected activeGraphs: any[] = []
  protected activeGraphIds: Set<number> = new Set()
  private ro: ResizeObserver
  constructor(props: IProps) {
    super(props)
    this.ro = new ResizeObserver((entries, observer) => {
      for (const entry of entries) {
        const { left, top, width, height } = entry.contentRect;
        console.log('Element:', entry.target);
        console.log(`Element's size: ${width}px x ${height}px`);
        console.log(`Element's paddings: ${top}px ; ${left}px`);
        if (this.canvasElement) {
          this.canvasElement.width = width
          this.canvasElement.height = height
        }
      }
    })
    globalEvent.on('register', this.handleRegister)
    console.log(this)
  }
  componentDidMount() {
    const container = this.containerRef.current
    const canvas = this.canvasRef.current
    if (container && canvas) {
      this.container = container
      this.canvasElement = canvas
      this.canvasContext = canvas.getContext('2d')
      this.ro.observe(container)
      this.nativeEventInit()
    }
  }
  protected nativeEventInit() {
    if (!this.container) return
    this.container.addEventListener('click', this.handleClick)
    this.container.addEventListener('mousedown', this.handleMouseDown)
  }
  private handleRegister = (graph: any) => {
    console.log('register', graph)
    this.graphs.push(graph)
  }
  private handleClick = (e: MouseEvent) => {
    // console.log('click', e)
    this.eventEmitter.emit('click')
  }
  private handleMouseDown = (e: MouseEvent) => {
    console.log('mousedown', e)
    const target = e.target as HTMLElement
    if (!target) return
    this.activeGraphIds.clear()
    const graphId = Number(target.dataset.graphId)
    if (graphId) {
      this.activeGraphIds.add(graphId)
    }
    this.mousedownPosition = new Vector2d(e.clientX, e.clientY)
    this.eventEmitter.emit('mousedown', {
      mousePosition: this.mousedownPosition,
      activeGraphIds: this.activeGraphIds
    })
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.handleMouseUp)
  }
  private handleMouseMove = (e: MouseEvent) => {
    // console.log('mousemove', e)
    this.mousemovePosition = new Vector2d(e.clientX, e.clientY)
    this.eventEmitter.emit('mousemove', {
      mousePosition: this.mousemovePosition,
      movement: this.mousemovePosition.substract(this.mousedownPosition),
      activeGraphIds: this.activeGraphIds
    })
  }
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
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0
      }}>
        <canvas ref={this.canvasRef}></canvas>
        <div className={'div'} style={{
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