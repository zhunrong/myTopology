import Interaction from './Interaction'
import Canvas from '../Canvas'
import Node from '../core/Node'
import DomNode from '../core/DomNode'
import CanvasNode from '../core/CanvasNode'
import Vector2d from '../../utils/vector2d'
import Line from '../../components/edges/Line'

/**
 * 连线（直线）
 */
class CreateEdgeInteraction extends Interaction {
  targetNode: Node | undefined
  sourceNode: Node | undefined
  edge: Line | undefined
  onClick = (canvas: Canvas) => {
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
          targetNode: canvas.virtualNode
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

export default new CreateEdgeInteraction()