import React, { PureComponent } from 'react'
interface IProps {}
interface IState {
  x: number
  y: number
}
class GraphicsBase extends PureComponent<IProps, IState> {
  state = {
    x: 0,
    y: 0
  }
  refDom: any = React.createRef()
  mousedownX: number = 0
  mousedownY: number = 0
  lastX: number = 0
  lastY: number = 0
  handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.mousedownX = event.clientX
    this.mousedownY = event.clientY
    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('mouseup', this.handleMouseUp)
  }
  handleMouseUp = (event: MouseEvent) => {
    this.lastX = this.state.x
    this.lastY = this.state.y
    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }
  handleMouseMove = (event: MouseEvent) => {
    // console.log(event)
    console.log(
      `mouse move : (${event.clientX - this.mousedownX},${event.clientY -
        this.mousedownY})`
    )
    this.setState({
      x: this.lastX + event.clientX - this.mousedownX,
      y: this.lastY + event.clientY - this.mousedownY
    })
  }
  render() {
    const { children } = this.props
    const { x, y } = this.state
    return (
      <div
        ref={this.refDom}
        onMouseDown={this.handleMouseDown}
        style={{
          transform: `translate3d(${x}px,${y}px,0)`,
          position: 'absolute',
          top: 0,
          left: 0,
          userSelect: 'none'
        }}
      >
        {children}
      </div>
    )
  }
}

export default GraphicsBase
