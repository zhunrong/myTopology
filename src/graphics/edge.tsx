import React, { PureComponent } from 'react'
interface IProps {
  x1: number
  y1: number
  x2: number
  y2: number
}
class Edge extends PureComponent<IProps> {
  render() {
    const { x1, x2, y1, y2 } = this.props
    return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ccc" />
  }
}

export default Edge
