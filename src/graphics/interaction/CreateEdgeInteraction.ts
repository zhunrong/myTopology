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
  edge: Line | undefined
  onClick = (canvas: Canvas) => {
    const nodes: Node[] = [...canvas.domNodes, ...canvas.canvasNodes]
    if (this.edge) {
      const targetNode = nodes.find(node => node.isPointIn(canvas))
      if (targetNode) {
        this.edge.targetNode = targetNode
        this.edge = undefined
      } else {
        canvas.removeEdge(this.edge)
        this.edge = undefined
      }
    } else {
      const sourceNode = nodes.find(node => node.isPointIn(canvas))
      if (sourceNode) {
        this.edge = new Line({
          sourceNode,
          targetNode: canvas.virtualNode
        })
        canvas.addEdge(this.edge)
      }
    }
  }
  onMouseMove = (canvas: Canvas) => {
    canvas.virtualNode.position = canvas.viewPortTopixelCoordinate(canvas.mousemovePosition)
  }
  onModeChange = (canvas: Canvas) => {
    if (this.edge) {
      canvas.removeEdge(this.edge)
      this.edge = undefined
    }
  }
}

export default new CreateEdgeInteraction()