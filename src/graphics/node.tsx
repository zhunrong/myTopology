import React, { PureComponent } from 'react'

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
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: '#ccc',
          color: 'white',
          fontSize: '12px',
          textAlign: 'center',
          lineHeight: '60px',
          position: 'absolute',
          left: 0,
          top: 0,
          margin: '-30px -30px',
          transform: `translate3d(${x}px,${y}px,0)`
        }}
      >
        {name}
      </div>
    )
  }
}

export default Node
