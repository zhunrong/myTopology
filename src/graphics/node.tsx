import React, { PureComponent } from 'react'
import style from './node.scss'
interface IProps {
  x: number
  y: number
  name: string
  rootNode?: boolean
}
interface IState {}

class Node extends PureComponent<IProps, IState> {
  render() {
    const { x, y, name, rootNode } = this.props
    return (
      <div
        className={`${style.node} ${rootNode ? 'root' : ''}`}
        style={{
          transform: `translate3d(${x}px,${y}px,0)`
        }}
      >
        {name}
      </div>
    )
  }
}

export default Node
