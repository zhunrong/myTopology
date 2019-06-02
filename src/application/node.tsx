import React from 'react'
import Graph from '../class/graph'
import { globalEvent, IListener } from '../class/eventEmitter'
import Vector2d from '../utils/vector2d'
interface IProps { }
interface IState {
  position: Vector2d
}
export default class Node extends Graph<IProps> {
  state = {
    position: new Vector2d(0, 0)
  }
  constructor(props: IProps) {
    super(props)
    this.init()
    console.log(this)
  }
  render() {
    return (
      <div data-graph-id={this.graphId} style={{
        width: 50,
        height: 50,
        fontSize: '12px',
        lineHeight: '50px',
        textAlign: 'center',
        backgroundColor: '#ccc',
        borderRadius: 25,
        position: 'absolute',
        transform: `translate3d(${this.position.x}px,${this.position.y}px,0)`
      }}>node</div>
    )
  }
}