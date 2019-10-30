import { Canvas, SelectInteraction, WheelZoomInteraction, CreateLineInteraction, MoveCanvasInteraction, CreateLInteraction } from '../graphics'

/**
 * 模式：创建双箭头直线
 */
export const MODE_CREATE_EDGE_DOUBLE_ARROW = '双箭头直线'
Canvas.registerMode(MODE_CREATE_EDGE_DOUBLE_ARROW, [
  new SelectInteraction(),
  new WheelZoomInteraction(),
  new CreateLineInteraction({
    doubleArrow: true
  }),
  new MoveCanvasInteraction()
])

export const MODE_CREATE_L_DOUBLE_ARROW = '双箭头折线'
Canvas.registerMode(MODE_CREATE_L_DOUBLE_ARROW, [
  new SelectInteraction(),
  new WheelZoomInteraction(),
  new CreateLInteraction({
    doubleArrow: true
  }),
  new MoveCanvasInteraction()
])