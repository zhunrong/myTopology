import Interaction from './Interaction'
import Node from '../graph/Node'
import { Canvas } from '../core/Canvas'
import { Edge } from '../graph/Edge'

class SelectInteraction extends Interaction {
  onMouseDown = (canvas: Canvas) => {
    let activeNode: Node | undefined
    let activeEdge: Edge | undefined

    const sign = Math.random()
    canvas.rootNode.getDescendantDF(node => {
      if (activeNode || activeEdge) {
        node.active = false
      } else {
        node.active = node.isPointIn()
        if (node.active) {
          activeNode = node
        }
      }
      node.isUpdate = true
      node.edges.forEach(edge => {
        if (edge.renderSign === sign) return
        edge.renderSign = sign
        edge.active = false
        if (activeEdge || activeNode) return
        edge.active = edge.isPointIn()
        if (edge.active) {
          activeEdge = edge
        }
      })
    })
    if (activeNode) {
      activeNode.getDescendantBF(node => {
        node.active = true
      })
    }
    canvas.repaint = true
  }
}

export const selectInteraction = new SelectInteraction()
export default selectInteraction