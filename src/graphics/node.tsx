import React, { PureComponent } from 'react'
import style from './node.scss'
interface IProps {
  x: number
  y: number
  name: string
}
interface IState {}

class Node extends PureComponent<IProps, IState> {
  render() {
    const { x, y, name } = this.props
    return (
      <div
        className={style.node}
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
