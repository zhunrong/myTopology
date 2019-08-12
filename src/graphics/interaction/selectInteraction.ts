import Interaction from './Interaction'
import Node from '../graph/Node'
import { Canvas } from '../core/Canvas'
import { Edge } from '../graph/Edge'

class SelectInteraction extends Interaction {
  onMouseDown = (canvas: Canvas) => {
    let activeNode: Node | undefined
    let activeEdge: Edge | undefined
    canvas.rootNode.getDescendantDF(node => {
      if (activeNode) {
        node.active = false
      } else {
        if (node.isPointIn()) {
          canvas.setNodeTop(node)
          node.active = true
          activeNode = node
        } else {
          node.active = false
        }
      }
      node.isUpdate = true
    })
    if (activeNode) {
      canvas.edges.forEach(edge => {
        edge.active = false
      })
      activeNode.getDescendantBF(node => {
        node.active = true
        node.isUpdate = true
      })
    } else {
      canvas.edges.forEach(edge => {
        if (activeEdge) {
          edge.active = false
        } else {
          if (edge.isPointIn()) {
            edge.active = true
            activeEdge = edge
          } else {
            edge.active = false
          }
        }
      })
    }
    canvas.repaint = true
  }
}

export const selectInteraction = new SelectInteraction()
export default selectInteraction