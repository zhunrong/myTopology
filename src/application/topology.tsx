import React, { Component } from 'react'
import Application from '../graphics/application'
import Node from './node'
interface IProps { }

export default class Topology extends Component<IProps> {
  data: any[] = [{
    name: 'node-1'
  }, {
    name: 'node-2'
  }, {
    name: 'node-3'
  }, {
    name: 'node-4'
  }, {
    name: 'node-5'
  }, {
    name: 'node-6'
  },
  { name: 'node-7' }]
  constructor(props: IProps) {
    super(props)
  }
  render() {
    return (
      <Application>
        {
          this.data.map((item, index) => {
            return <Node key={index} />
          })
        }
      </Application>
    )
  }
}