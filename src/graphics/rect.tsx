import React, { PureComponent } from 'react'

interface IProps {
  update?: (params: any) => void
  move?: (x: number, y: number) => void
  onHoverChange?: (hover: boolean) => void
  x?: number
  y?: number
}
interface IState {}
class Rect extends PureComponent<IProps, IState> {
  domRef: React.RefObject<any> = React.createRef()
  hover: boolean = false
  componentDidMount() {
    // console.log('did mount',this.domRef.current)
  }
  handleMouseEnter = () => {
    this.hover = true
    const { onHoverChange } = this.props
    onHoverChange && onHoverChange(this.hover)
  }
  handleMouseLeave = () => {
    this.hover = false
    const { onHoverChange } = this.props
    onHoverChange && onHoverChange(this.hover)
  }
  render() {
    const { x = 0, y = 0 } = this.props
    return (
      <div
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        ref={this.domRef}
        style={{
          width: '100px',
          height: '100px',
          background: '#ccc',
          color: '#fff',
          textAlign: 'center',
          lineHeight: '100px',
          border: '1px dashed #333'
        }}
      >
        rect
      </div>
    )
  }
}

export default Rect
