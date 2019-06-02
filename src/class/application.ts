import React, { Component, ReactNode } from 'react'
import EventEmitter, { globalEvent } from './eventEmitter'
import Vector2d from '../utils/vector2d'
export default class Application<IProps = {}, IState = {}> extends Component<IProps, IState> {
  protected name: string = 'application'
  protected eventEmitter: EventEmitter = globalEvent
  protected container: HTMLElement | null = null
  protected canvasElement: HTMLCanvasElement | null = null
  protected canvasContext: CanvasRenderingContext2D | null = null
  private mousedownPosition: Vector2d = new Vector2d(0, 0)
  private mouseupPosition: Vector2d = new Vector2d(0, 0)
  private mousemovePosition: Vector2d = new Vector2d(0, 0)
  protected graphs: any[] = []
  protected canvasInit(container: HTMLElement, canvas: HTMLCanvasElement) {
    this.container = container
    this.canvasElement = canvas
    this.canvasContext = canvas.getContext('2d')
    this.container.addEventListener('click', this._handleClick)
    this.container.addEventListener('mousedown', this._handleMouseDown)
    globalEvent.on('register', this._handleRegister)
  }
  private _handleRegister = (graph: any) => {
    console.log('register', graph)
    this.graphs.push(graph)
  }
  private _handleClick = (e: MouseEvent) => {
    // console.log('click', e)
    this.eventEmitter.emit('click')
  }
  private _handleMouseDown = (e: MouseEvent) => {
    // console.log('mousedown', e)
    this.mousedownPosition = new Vector2d(e.clientX, e.clientY)
    this.eventEmitter.emit('mousedown', {
      mousePosition: this.mousedownPosition
    })
    document.addEventListener('mousemove', this._handleMouseMove)
    document.addEventListener('mouseup', this._handleMouseUp)
  }
  private _handleMouseMove = (e: MouseEvent) => {
    // console.log('mousemove', e)
    this.mousemovePosition = new Vector2d(e.clientX, e.clientY)
    this.eventEmitter.emit('mousemove', {
      mousePosition: this.mousemovePosition,
      movement: this.mousemovePosition.substract(this.mousedownPosition)
    })
  }
  private _handleMouseUp = (e: MouseEvent) => {
    // console.log('mouseup', e)
    this.mouseupPosition = new Vector2d(e.clientX, e.clientY)
    this.eventEmitter.emit('mouseup', {
      mousePosition: this.mouseupPosition,
      movement: this.mouseupPosition.substract(this.mousedownPosition)
    })
    document.removeEventListener('mousemove', this._handleMouseMove)
    document.removeEventListener('mouseup', this._handleMouseUp)
  }
  // render(): ReactNode {
  //   return null
  // }
}