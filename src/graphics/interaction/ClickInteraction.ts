import Interaction from './Interaction'
import Canvas from '../Canvas'
import Node from '../core/Node'

class ClickInteraction extends Interaction {
  onMouseDown = (canvas: Canvas) => {
    const nodes: Node[] = [...canvas.domNodes, ...canvas.canvasNodes]
    let activeNode: Node | undefined
    nodes.forEach(node => {
      if (activeNode) {
        node.active = false
      } else {
        if (node.isPointIn(canvas)) {
          node.active = true
          activeNode = node
        } else {
          node.active = false
        }
      }
      node.isUpdate = true
    })
  }
}

export default new ClickInteraction()