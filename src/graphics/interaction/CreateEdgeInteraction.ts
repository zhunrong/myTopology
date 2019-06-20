import Interaction from './Interaction'
import Canvas from '../core/Canvas'
import Node from '../graph/Node'
import Line from '../shape/Line'

/**
 * 连线（直线）
 */
class CreateEdgeInteraction extends Interaction {
  targetNode: Node | undefined
  sourceNode: Node | undefined
  edge: Line | undefined
  onMouseUp = (canvas: Canvas) => {
    const nodes: Node[] = [...canvas.domNodes, ...canvas.canvasNodes]
    if (this.edge) {
      this.targetNode = nodes.find(node => node.isPointIn(canvas))
      if (this.targetNode) {
        this.edge.targetNode = this.targetNode
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
        this.edge = new Line({
          sourceNode: this.sourceNode,
          targetNode: canvas.virtualNode,
          arrow: true,
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
  onModeChange = (canvas: Canvas) => {
    if (this.edge) {
      canvas.removeEdge(this.edge)
      this.edge = undefined
      this.targetNode = undefined
      this.sourceNode = undefined
    }
    canvas.repaint = true
  }
}

export const createEdgeInteraction = new CreateEdgeInteraction()
export default createEdgeInteraction