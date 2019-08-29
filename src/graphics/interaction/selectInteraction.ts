import Interaction from './Interaction'
import Node from '../graph/Node'
import { Canvas } from '../core/Canvas'
import { Edge } from '../graph/Edge'

/**
 * 选中图元
 */
export class SelectInteraction extends Interaction {
  onMouseDown = (canvas: Canvas) => {
    let activeNode: Node | undefined
    let activeEdge: Edge | undefined

    const sign = Math.random()
    canvas.rootNode.getDescendantDF(node => {
      if /* 已存在激活图元或本身不可见 */ (activeNode || activeEdge || !node.visible) {
        node.active = false
      } else {
        node.active = node.isPointIn()
        if (node.active) {
          activeNode = node
          canvas.setNodeTop(node)
        }
      }
      node.isUpdate = true
      node.edges.forEach(edge => {
        if /* 是否已遍历 */ (edge.renderSign === sign) return
        edge.renderSign = sign
        edge.active = false
        if /* 已存在激活图元 */ (activeEdge || activeNode) return
        if /* 边线不可见 */ (!edge.sourceNode.visible && !edge.targetNode.visible) return
        edge.active = edge.isPointIn()
        if (edge.active) {
          activeEdge = edge
        }
      })
    })
    canvas.repaint = true
  }
}

export const selectInteraction = new SelectInteraction()
export default selectInteraction