import React, { Component, ReactNode } from 'react'
import EventEmitter from './eventEmitter'
export default class Application<IProps, IState> extends Component<IProps, IState> {
  protected name: string = 'application'
  protected eventEmitter: EventEmitter = new EventEmitter()
  protected container: HTMLElement | null = null
  protected canvasElement: HTMLCanvasElement | null = null
  protected canvasContext: CanvasRenderingContext2D | null = null
  protected canvasInit(container: HTMLElement, canvas: HTMLCanvasElement) {
    this.container = container
    this.canvasElement = canvas
    this.canvasContext = canvas.getContext('2d')
    this.container.addEventListener('click', this._handleClick)
    this.container.addEventListener('mousedown', this._handleMouseDown)

  }
  private _handleClick = (e: MouseEvent) => {
    console.log('click', e)
    this.eventEmitter.emit('click')
  }
  private _handleMouseDown = (e: MouseEvent) => {
    console.log('mousedown', e)
    this.eventEmitter.emit('mousedown')
    document.addEventListener('mousemove', this._handleMouseMove)
    document.addEventListener('mouseup', this._handleMouseUp)
  }
  private _handleMouseMove = (e: MouseEvent) => {
    console.log('mousemove', e)
    this.eventEmitter.emit('mousemove')
  }
  private _handleMouseUp = (e: MouseEvent) => {
    console.log('mouseup', e)
    this.eventEmitter.emit('mouseup')
    document.removeEventListener('mousemove', this._handleMouseMove)
    document.removeEventListener('mouseup', this._handleMouseUp)
  }
  render(): ReactNode {
    return null
  }
}