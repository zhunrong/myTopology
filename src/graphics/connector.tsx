import React, { PureComponent } from 'react'
import Vector2d from '../utils/vector2d'
interface IProps {
  x1: number
  y1: number
  x2: number
  y2: number
  start?: Vector2d
  end?: Vector2d
}
class Edge extends PureComponent<IProps> {
  render() {
    const { x1, x2, y1, y2 } = this.props
    const start = new Vector2d(x1, y1)
    const end = new Vector2d(x2, y2)
    const v = end.substract(start)
    const vn = v.normalize().scale(30)
    const arrowStart = v.substract(vn).add(start)
    const arrowX = arrowStart.x
    const arrowY = arrowStart.y
    let rotate = (v.xAxisAngle() / Math.PI) * 180
    return (
      <g>
        <path d={`M${x1},${y1} L${x2},${y2}`} stroke="#ccc" />
        <path
          d={`M${arrowX},${arrowY} L${arrowX - 8},${arrowY + 3} L${arrowX -
            8},${arrowY - 3} Z`}
          fill="#ccc"
          transform={`rotate(${rotate},${arrowX},${arrowY})`}
        />
      </g>
    )
  }
}

export default Edge
