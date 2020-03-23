import React from 'react'
import ReactDOM from 'react-dom'
import App from './application/topology'
import 'antd/dist/antd.css'
import './assets/styles/styles.less'
ReactDOM.render(<App />, document.getElementById('app'))

if(module.hot){
  module.hot.accept('./application/topology.tsx', () => {
    const AppUpdate = require('./application/topology').default
    ReactDOM.render(
      <AppUpdate />,
      document.getElementById('app')
    )
  })
}
