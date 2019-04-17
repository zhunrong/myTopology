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
      <GraphicsBase>
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
          <GraphicsBase x={150} y={100}>
            <Rect />
          </GraphicsBase>
          {/* <Rect x={200} y={200} onHoverChange={this.handleChildHoverChange} /> */}
        </div>
      </GraphicsBase>
    )
  }
}

export default Canvas
