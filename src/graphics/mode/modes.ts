import Interaction from '../interaction/Interaction'
import dragInteraction from '../interaction/dragInteraction'
import dropInteraction from '../interaction/dropInteraction'
import moveCanvasInteraction from '../interaction/moveCanvasInteraction'
import wheelZoomInteraction from '../interaction/wheelZoomInteraction'
import createEdgeInteraction from '../interaction/createEdgeInteraction'
import createLInteraction from '../interaction/createLInteraction'
import selectInteraction from '../interaction/selectInteraction'
import menuInteraction from '../interaction/menuInteraction'
import areaPickInteraction from '../interaction/areaPickInteraction'
// 默认模式
export const MODE_DEFAULT = 'mode.default'
// 查看模式
export const MODE_VIEW = 'mode.view'
// 创建连线
export const MODE_CREATE_EDGE = 'mode.create.edge'
// 创建L型连线
export const MODE_CREATE_L = 'mode.create.L'
// 框选模式
export const MODE_AREA_PICK = 'mode.area.pick'

interface Mode {
  [name: string]: Interaction[]
}
export const modes: Mode = {
  [MODE_DEFAULT]: [selectInteraction, dragInteraction, dropInteraction, wheelZoomInteraction, menuInteraction],
  [MODE_VIEW]: [moveCanvasInteraction, wheelZoomInteraction],
  [MODE_CREATE_EDGE]: [selectInteraction, wheelZoomInteraction, createEdgeInteraction, moveCanvasInteraction],
  [MODE_CREATE_L]: [selectInteraction, wheelZoomInteraction, createLInteraction, moveCanvasInteraction],
  [MODE_AREA_PICK]: [selectInteraction, wheelZoomInteraction, areaPickInteraction]
}
export default modes