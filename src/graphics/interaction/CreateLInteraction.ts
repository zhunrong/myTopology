import Interaction from './Interaction'
import Canvas from '../core/Canvas'
import Node from '../graph/Node'
import L from '../edge/L'

/**
 * 连线（L型）
 */
export class CreateLInteraction extends Interaction {
  targetNode: Node | undefined
  sourceNode: Node | undefined
  edge: L | undefined
  onMouseUp = (canvas: Canvas) => {
    if (this.edge) {
      canvas.rootNode.getDescendantDF(node => {
        if (node.isPointIn()) {
          this.targetNode = node
          return true
        }
      })
      if (this.targetNode && this.sourceNode &&
        this.targetNode !== this.sourceNode &&
        !this.targetNode.hasDescendant(this.sourceNode) &&
        !this.sourceNode.hasDescendant(this.targetNode)) {
        this.edge.targetNode = this.targetNode
        this.targetNode.addEdge(this.edge)
        canvas.virtualNode.removeEdge(this.edge)
        this.edge.arrow = true
        this.targetNode.isUpdate = true
        this.edge = undefined
        this.targetNode = undefined
        this.sourceNode = undefined
      } else {
        canvas.removeEdge(this.edge)
        this.edge = undefined
        this.targetNode = undefined
        this.sourceNode = undefined
      }
    } else {
      canvas.rootNode.getDescendantDF(node => {
        if (node.isPointIn()) {
          this.sourceNode = node
          return true
        }
      })
      if (this.sourceNode) {
        this.edge = new L({
          sourceNode: this.sourceNode,
          targetNode: canvas.virtualNode,
          dash: false,
          arrow: false,
          text: ''
        })
        canvas.addEdge(this.edge)
      }
    }
    canvas.repaint = true
  }
  onMouseMove = (canvas: Canvas) => {
    canvas.virtualNode.position = canvas.viewportToPixelCoordinate(canvas.mousemovePosition)
    if (this.sourceNode) {
      canvas.virtualNode.isUpdate = true
    }
    canvas.repaint = true
  }
  onUninstall = (canvas: Canvas) => {
    if (this.edge) {
      canvas.removeEdge(this.edge)
      this.edge = undefined
      this.targetNode = undefined
      this.sourceNode = undefined
    }
    canvas.repaint = true
  }
}

export const createLInteraction = new CreateLInteraction()
export default CreateLInteraction