import Interaction from './Interaction'
import Canvas from '../core/Canvas'

/**
 * 折叠与展开操作
 */
class CollapseAndExpandInteraction extends Interaction {
  onDblClick = (canvas: Canvas) => {
    console.log('dblclick')
    const activeNode = canvas.getActiveNodes()[0]
    if (activeNode && activeNode.isGroup) {
      activeNode.isExpanded = !activeNode.isExpanded
      activeNode.isUpdate = true
      canvas.repaint = true
    }
  }
}

export const collapseAndExpandInteraction = new CollapseAndExpandInteraction()

export default collapseAndExpandInteraction