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
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: '#ccc',
          color: 'white',
          fontSize: '12px',
          textAlign: 'center',
          lineHeight: '80px',
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          transform: 'translate(-50%,-50%)'
        }}
      >
        {name}
      </div>
    )
  }
}

export default Node
