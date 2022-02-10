import Interaction from './Interaction';
import Canvas from '../core/Canvas';
import Node from '../graph/Node';
import Line from '../edge/Line';
import Edge from '../graph/Edge';

type CreateEdge = (sourceNode: Node, targetNode: Node) => Edge

/**
 * 创建连线
 */
export class CreateEdgeInteraction extends Interaction {
  targetNode: Node | undefined;
  sourceNode: Node | undefined;
  edge: Edge | undefined;
  onCreate: CreateEdge;
  constructor(onCreate?: CreateEdge) {
    super();
    this.onCreate = onCreate || ((sourceNode, targetNode) => new Line({
      text: '',
      sourceNode,
      targetNode,
      arrow: true,
      dash: false,
      doubleArrow: false
    }));
  }
  onMouseUp = (canvas: Canvas) => {
    if (this.edge) {
      canvas.rootNode.getDescendantDF(node => {
        if (node.isPointIn()) {
          this.targetNode = node;
          return true;
        }
      });
      if (this.targetNode && this.sourceNode &&
        this.targetNode !== this.sourceNode &&
        !this.targetNode.hasDescendant(this.sourceNode) &&
        !this.sourceNode.hasDescendant(this.targetNode)) {
        this.edge.targetNode = this.targetNode;
        this.targetNode.addEdge(this.edge);
        canvas.virtualNode.removeEdge(this.edge);
        this.targetNode.isUpdate = true;
        this.edge = undefined;
        this.targetNode = undefined;
        this.sourceNode = undefined;
      } else {
        canvas.removeEdge(this.edge);
        this.edge = undefined;
        this.targetNode = undefined;
        this.sourceNode = undefined;
      }
    } else {
      canvas.rootNode.getDescendantDF(node => {
        if (node.isPointIn()) {
          this.sourceNode = node;
          return true;
        }
      });
      if (this.sourceNode) {
        this.edge = this.onCreate(this.sourceNode, canvas.virtualNode);
        canvas.addEdge(this.edge);
      }
    }
    canvas.repaint = true;
  };
  onMouseMove = (canvas: Canvas) => {
    canvas.virtualNode.position = canvas.viewportToPixelCoordinate(canvas.mousemovePosition);
    if (this.sourceNode) {
      canvas.virtualNode.isUpdate = true;
    }
    canvas.repaint = true;
  };
  onUninstall = (canvas: Canvas) => {
    if (this.edge) {
      canvas.removeEdge(this.edge);
      this.edge = undefined;
      this.targetNode = undefined;
      this.sourceNode = undefined;
    }
    canvas.repaint = true;
  };
  handleEvent(canvas: Canvas, event: Event) {
    switch (event.type) {
      case 'mouseup':
        this.onMouseUp(canvas);
        break;
      case 'mousemove':
        this.onMouseMove(canvas);
        break;
    }
  }
}

export default CreateEdgeInteraction;
