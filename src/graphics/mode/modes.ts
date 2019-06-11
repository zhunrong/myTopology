import Interaction from '../interaction/Interaction'
import dragInteraction from '../interaction/DragInteraction'
import dropInteraction from '../interaction/DropInteration'
import wheelZoomInteraction from '../interaction/WheelZoomInteraction'
// 默认模式
export const MODE_DEFAULT = 'mode.default'
// 查看模式
export const MODE_VIEW = 'mode.view'
// 创建连线
export const MODE_CREATE_EDGE = 'mode.create.edge'

interface Mode {
  [name: string]: Interaction[]
}
const modes: Mode = {
  [MODE_DEFAULT]: [dragInteraction, dropInteraction, wheelZoomInteraction],
  [MODE_VIEW]: [wheelZoomInteraction],
  [MODE_CREATE_EDGE]: [wheelZoomInteraction]
}
export default modes