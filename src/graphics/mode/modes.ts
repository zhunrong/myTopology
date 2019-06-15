import Interaction from '../interaction/Interaction'
import dragInteraction from '../interaction/dragInteraction'
import dropInteraction from '../interaction/dropInteraction'
import moveCanvasInteraction from '../interaction/moveCanvasInteraction'
import wheelZoomInteraction from '../interaction/wheelZoomInteraction'
import createEdgeInteraction from '../interaction/createEdgeInteraction'
import clickInteraction from '../interaction/clickInteraction'
import menuInteraction from '../interaction/menuInteraction'
// 默认模式
export const MODE_DEFAULT = 'mode.default'
// 查看模式
export const MODE_VIEW = 'mode.view'
// 创建连线
export const MODE_CREATE_EDGE = 'mode.create.edge'

interface Mode {
  [name: string]: Interaction[]
}
export const modes: Mode = {
  [MODE_DEFAULT]: [dragInteraction, dropInteraction, wheelZoomInteraction, clickInteraction, menuInteraction],
  [MODE_VIEW]: [moveCanvasInteraction, wheelZoomInteraction],
  [MODE_CREATE_EDGE]: [wheelZoomInteraction, createEdgeInteraction, clickInteraction, moveCanvasInteraction]
}
export default modes