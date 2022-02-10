import Interaction from './Interaction';
import Canvas from '../core/Canvas';

/**
 * 折叠与展开操作
 */
export class CollapseAndExpandInteraction extends Interaction {
  lastTimestamp = 0;
  onMouseDown = (canvas: Canvas) => {
    const now = Date.now();
    if (now - this.lastTimestamp < 300) {
      const activeNode = canvas.getActiveNodes()[0];
      if (activeNode && activeNode.isGroup) {
        activeNode.isExpanded = !activeNode.isExpanded;
        activeNode.isUpdate = true;
        activeNode.render();
        canvas.repaint = true;
      }
    }
    this.lastTimestamp = now;
  };
  handleEvent(canvas: Canvas, event: Event) {
    switch (event.type) {
      case 'mousedown':
        this.onMouseDown(canvas);
        break;
    }
  }
}

export const collapseAndExpandInteraction = new CollapseAndExpandInteraction();

export default CollapseAndExpandInteraction;
