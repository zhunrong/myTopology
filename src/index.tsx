import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import './styles/styles.scss'
ReactDOM.render(<App />, document.getElementById('app'))

if(module.hot){
  module.hot.accept('./app.tsx', () => {
    const AppUpdate = require('./app').default
    ReactDOM.render(
      <AppUpdate />,
      document.getElementById('app')
    )
  })
}
