import { Canvas, SelectInteraction, WheelZoomInteraction, MoveCanvasInteraction, CreateEdgeInteraction, Line, L } from '../../package'

/**
 * 模式：创建双箭头直线
 */
export const MODE_CREATE_EDGE_DOUBLE_ARROW = '双箭头直线'
export const MODE_CREATE_L_DOUBLE_ARROW = '双箭头折线'


export function registerMode(canvas: Canvas) {
  canvas.registerMode(MODE_CREATE_EDGE_DOUBLE_ARROW, [
    new SelectInteraction(),
    new WheelZoomInteraction(),
    new CreateEdgeInteraction((sourceNode, targetNode) => new Line({
      doubleArrow: true,
      sourceNode,
      targetNode
    })),
    new MoveCanvasInteraction()
  ])

  canvas.registerMode(MODE_CREATE_L_DOUBLE_ARROW, [
    new SelectInteraction(),
    new WheelZoomInteraction(),
    new CreateEdgeInteraction((sourceNode, targetNode) => new L({
      doubleArrow: true,
      sourceNode,
      targetNode
    })),
    new MoveCanvasInteraction()
  ])
}