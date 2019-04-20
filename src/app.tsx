import React, { PureComponent } from 'react'
import Canvas from './graphics/canvas'
import Rect from './graphics/rect'

class App extends PureComponent<{}> {
  render() {
    return (
      <div>
        <Canvas />
      </div>
    )
  }
}

export default App
