import Interaction from './Interaction'
import Canvas from '../core/Canvas'
import Node from '../graph/Node'
import Line from '../edge/Line'

/**
 * 连线（直线）
 */
class CreateEdgeInteraction extends Interaction {
  targetNode: Node | undefined
  sourceNode: Node | undefined
  edge: Line | undefined
  onMouseUp = (canvas: Canvas) => {
    if (this.edge) {
      canvas.rootNode.getDescendantDF(node => {
        if (node.isPointIn()) {
          this.targetNode = node
          return true
        }
      })
      if (this.targetNode && this.targetNode !== this.sourceNode) {
        this.edge.targetNode = this.targetNode
        this.targetNode.addEdge(this.edge)
        canvas.virtualNode.removeEdge(this.edge)
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
        // this.edge = new Line({
        //   sourceNode: this.sourceNode,
        //   targetNode: canvas.virtualNode,
        //   arrow: true,
        //   text: ''
        // })
        this.edge = new Line({
          sourceNode: this.sourceNode,
          targetNode: canvas.virtualNode,
          arrow: Canvas.config.createLineOptions.arrow,
          text: Canvas.config.createLineOptions.text
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

export const createEdgeInteraction = new CreateEdgeInteraction()
export default createEdgeInteraction