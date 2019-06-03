import React from 'react'
import Shape from '../class/shape'
import { globalEvent, IListener } from '../class/eventEmitter'
import Vector2d from '../utils/vector2d'
interface IProps {
  position?: Vector2d
}
interface IState {
  position: Vector2d
}
export default class Node extends Shape<IProps> {
  readonly renderType: string = 'html'
  constructor(props: IProps) {
    super(props)
    if (props.position) {
      this.position = props.position
      this.positionOld = props.position
    }
    console.log(this)
  }
  render() {
    return (
      <div data-shape-id={this.shapeId} style={{
        width: 50,
        height: 50,
        fontSize: '12px',
        lineHeight: '50px',
        textAlign: 'center',
        backgroundColor: '#ccc',
        borderRadius: 25,
        position: 'absolute',
        transform: `translate3d(${this.position.x}px,${this.position.y}px,0) scale(${this.scale})`
      }}>node</div>
    )
  }
}