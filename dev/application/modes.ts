import { Canvas, SelectInteraction, WheelZoomInteraction, MoveCanvasInteraction, CreateEdgeInteraction, Line, L } from '../../src'

/**
 * 模式：创建双箭头直线
 */
export const MODE_CREATE_EDGE_DOUBLE_ARROW = '双箭头直线'
Canvas.registerMode(MODE_CREATE_EDGE_DOUBLE_ARROW, [
  new SelectInteraction(),
  new WheelZoomInteraction(),
  new CreateEdgeInteraction((sourceNode, targetNode) => new Line({
    doubleArrow: true,
    sourceNode,
    targetNode
  })),
  new MoveCanvasInteraction()
])

export const MODE_CREATE_L_DOUBLE_ARROW = '双箭头折线'
Canvas.registerMode(MODE_CREATE_L_DOUBLE_ARROW, [
  new SelectInteraction(),
  new WheelZoomInteraction(),
  new CreateEdgeInteraction((sourceNode, targetNode) => new L({
    doubleArrow: true,
    sourceNode,
    targetNode
  })),
  new MoveCanvasInteraction()
])