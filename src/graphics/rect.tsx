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
  render() {
    return (
      <div
        ref={this.domRef}
        style={{
          width: '100px',
          height: '100px',
          background: '#ccc',
          color: '#fff',
          textAlign: 'center',
          border: '1px dashed #333',
          fontSize: 40,
          lineHeight: '100px'
        }}
      >
        rect
      </div>
    )
  }
}

export default Rect
