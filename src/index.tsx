import React from 'react'
import ReactDOM from 'react-dom'
import App from './application/demo'
import './styles/styles.scss'
ReactDOM.render(<App />, document.getElementById('app'))

if(module.hot){
  module.hot.accept('./app.tsx', () => {
    const AppUpdate = require('./application/demo').default
    ReactDOM.render(
      <AppUpdate />,
      document.getElementById('app')
    )
  })
}
