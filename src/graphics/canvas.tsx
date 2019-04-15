import React, { PureComponent } from 'react'
import Rect from './rect'
import GraphicsBase from './graphicsBase'
interface IProps {
  children?: any
}
class Canvas extends PureComponent<IProps> {
  domRef: React.RefObject<any> = React.createRef()
  mousedown: boolean = false
  activeChild: any
  render() {
    return (
      <div
        ref={this.domRef}
        className="canvas"
        style={{
          width: '1000px',
          height: '500px',
          border: '1px solid #ccc',
          boxSizing: 'border-box',
          position: 'relative'
        }}
      >
        <GraphicsBase>
          <Rect />
        </GraphicsBase>
        {/* <Rect x={200} y={200} onHoverChange={this.handleChildHoverChange} /> */}
      </div>
    )
  }
}

export default Canvas
