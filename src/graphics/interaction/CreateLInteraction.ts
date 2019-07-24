import Interaction from './Interaction'
import Canvas from '../core/Canvas'
import Node from '../graph/Node'
import L from '../shape/L'

/**
 * 连线（L型）
 */
class CreateLInteraction extends Interaction {
  targetNode: Node | undefined
  sourceNode: Node | undefined
  edge: L | undefined
  onMouseUp = (canvas: Canvas) => {
    const nodes: Node[] = [...canvas.domNodes, ...canvas.canvasNodes]
    if (this.edge) {
      this.targetNode = nodes.find(node => node.isPointIn(canvas))
      if (this.targetNode && this.targetNode !== this.sourceNode) {
        this.edge.targetNode = this.targetNode
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
      this.sourceNode = nodes.find(node => node.isPointIn(canvas))
      if (this.sourceNode) {
        this.edge = new L({
          sourceNode: this.sourceNode,
          targetNode: canvas.virtualNode,
          dash: true,
          arrow: false,
          text: ''
        })
        canvas.addEdge(this.edge)
      }
    }
    canvas.repaint = true
  }
  onMouseMove = (canvas: Canvas) => {
    canvas.virtualNode.position = canvas.viewPortTopixelCoordinate(canvas.mousemovePosition)
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
export default createLInteraction