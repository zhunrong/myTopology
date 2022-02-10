import Interaction from './Interaction';
import Canvas from '../core/Canvas';
import Vector2d from '../utils/Vector2d';

/**
 * 拖动整个画布
 */
export class MoveCanvasInteraction extends Interaction {
  // 最小拖动距离
  minDragDistance = 3;
  mouseDown = false;
  move = false;
  lastCoordinate: Vector2d = new Vector2d();
  onMouseDown = (canvas: Canvas) => {
    this.mouseDown = true;
    this.lastCoordinate.copy(canvas.mousedownPosition);
  };
  onMouseMove = (canvas: Canvas) => {
    if (!this.mouseDown) return;
    // 移动距离太小，认为是误操作，过滤掉
    if (Vector2d.copy(canvas.mousemovePosition).substract(canvas.mousedownPosition).magnitude < this.minDragDistance) return;
    const offset = Vector2d.copy(canvas.mousemovePosition).substract(this.lastCoordinate);
    this.lastCoordinate.copy(canvas.mousemovePosition);
    this.move = true;
    const pixelOffset = offset.scale(1 / canvas.canvasScale);
    canvas.rootNode.translate(pixelOffset);
    canvas.repaint = true;
  };
  onMouseUp = (canvas: Canvas) => {
    this.mouseDown = false;
    if (this.move) {
      canvas.eventEmitter.emit('interaction:canvasMoveEnd');
      this.move = false;
    }
  };
  handleEvent(canvas: Canvas, event: Event) {
    switch (event.type) {
      case 'mousedown':
        this.onMouseDown(canvas);
        break;
      case 'mousemove':
        this.onMouseMove(canvas);
        break;
      case 'mouseup':
        this.onMouseUp(canvas);
        break;
    }
  }
}

export const moveCanvasInteraction = new MoveCanvasInteraction();
export default MoveCanvasInteraction;
