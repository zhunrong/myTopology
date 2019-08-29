import React, { Component } from 'react'
import style from './nodePanel.less'

interface IState {
  nodeTypes: any[]
  visible: boolean
}
class NodePanel extends Component<{}, IState> {
  state = {
    visible: false,
    nodeTypes: [
      {
        type: '主机1',
        img: require('../../assets/device/主机1.png')
      },
      {
        type: '主机2',
        img: require('../../assets/device/主机2.png')
      },
      {
        type: '主机3',
        img: require('../../assets/device/主机3.png')
      },
      {
        type: '服务器',
        img: require('../../assets/device/服务器.png')
      },
      {
        type: '交换机1',
        img: require('../../assets/device/交换机1.png')
      },
      {
        type: '交换机2',
        img: require('../../assets/device/交换机2.png')
      }
    ]
  }

  handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('nodeType', type)
  }

  visibleChange = () => {
    const { visible } = this.state
    this.setState({
      visible: !visible
    })
  }

  render() {
    const { nodeTypes, visible } = this.state
    return (
      <div className={`${style['node-panel']} ${visible ? 'visible' : ''}`}>
        {
          nodeTypes.map((item, index) => {
            return (
              <div className="node" draggable={true} title={item.type} key={index} onDragStart={e => this.handleDragStart(e, item.type)}>
                <img draggable={false} src={item.img} />
              </div>
            )
          })
        }
        <div className="btn" onClick={this.visibleChange}>
          >
        </div>
      </div>
    )
  }
}

export default NodePanel