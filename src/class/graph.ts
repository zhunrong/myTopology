import React, { Component } from 'react'
import Vector2d from '../utils/vector2d'
import { globalEvent, IListener } from '../class/eventEmitter'
let id = 1
export default class Graph<IProps = {}, IState = {}> extends Component<IProps, IState> {
  graphId: number = id++
  position: Vector2d = new Vector2d(0, 0)
  positionOld: Vector2d = new Vector2d(0, 0)
  renderType: string = 'html'
  protected init() {
    // 注册到画布上
    globalEvent.emit('register', this)
    globalEvent.on('mousedown', this._handleMouseDown)
    globalEvent.on('mousemove', this._handleMouseMove)
    globalEvent.on('mouseup', this._handleMouseUp)
  }
  private _handleMouseMove: IListener = e => {
    if (!e) return
    if (e.activeGraphIds.size && !e.activeGraphIds.has(this.graphId)) return
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
}