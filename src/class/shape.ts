import React, { Component } from 'react'
import Vector2d from '../utils/vector2d'
import { globalEvent, IListener } from './eventEmitter'
let id = 1
export default class Shape<IProps = {}, IState = {}> extends Component<IProps, IState> {
  readonly shapeId: number = id++
  readonly renderType: string = 'html'

  scale: number = 1
  position: Vector2d = new Vector2d(0, 0)
  positionOld: Vector2d = new Vector2d(0, 0)

  constructor(props: IProps) {
    super(props)
    this._init()
  }
  private _init() {
    // 注册到画布上
    globalEvent.emit('register:node', this)
    globalEvent.on('mousedown', this._handleMouseDown)
    globalEvent.on('mousemove', this._handleMouseMove)
    globalEvent.on('mouseup', this._handleMouseUp)
  }
  private _handleMouseMove: IListener = e => {
    if (!e) return
    if (e.activeShapeIds.size && !e.activeShapeIds.has(this.shapeId)) return
    this.position = this.positionOld.add(e.movement)
    if (this.renderType === 'html') {
      this.setState({})
    } else if (this.renderType === 'canvas') {
      // this.update()
    }
  }
  private _handleMouseDown: IListener = e => {
    if (!e) return
  }
  private _handleMouseUp: IListener = e => {
    if (!e) return
    this.positionOld = this.position
  }
  // 注销
  destroy() {
    globalEvent.emit('unregister:node', this)
    globalEvent.off('mousedown', this._handleMouseDown)
    globalEvent.off('mousemove', this._handleMouseMove)
    globalEvent.off('mouseup', this._handleMouseUp)
  }
}