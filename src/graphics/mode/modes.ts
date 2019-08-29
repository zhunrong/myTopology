import Interaction from '../interaction/Interaction'
import dragInteraction, { DragInteraction } from '../interaction/dragInteraction'
import dropInteraction, { DropInteraction } from '../interaction/dropInteraction'
import moveCanvasInteraction, { MoveCanvasInteraction } from '../interaction/moveCanvasInteraction'
import wheelZoomInteraction, { WheelZoomInteraction } from '../interaction/wheelZoomInteraction'
import createEdgeInteraction, { CreateLineInteraction } from '../interaction/createEdgeInteraction'
import createLInteraction, { CreateLInteraction } from '../interaction/createLInteraction'
import selectInteraction, { SelectInteraction } from '../interaction/selectInteraction'
import menuInteraction, { MenuInteraction } from '../interaction/menuInteraction'
import areaPickInteraction, { AreaPickInteraction } from '../interaction/areaPickInteraction'
import createGroupInteraction, { CreateGroupInteraction } from '../interaction/createGroupInteraction'
import resizeInteraction, { ResizeInteraction } from '../interaction/resizeInteraction'
import collapseAndExpandInteraction, { CollapseAndExpandInteraction } from '../interaction/collapseAndExpandInteraction'

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
// 边框模式
export const MODE_BORDER = 'mode.border'

interface IMode {
  [name: string]: Interaction[]
}
export const modes: IMode = {
  [MODE_DEFAULT]: [selectInteraction, dragInteraction, dropInteraction, wheelZoomInteraction, menuInteraction, collapseAndExpandInteraction],
  [MODE_VIEW]: [moveCanvasInteraction, wheelZoomInteraction],
  [MODE_CREATE_EDGE]: [selectInteraction, wheelZoomInteraction, createEdgeInteraction, moveCanvasInteraction],
  [MODE_CREATE_L]: [selectInteraction, wheelZoomInteraction, createLInteraction, moveCanvasInteraction],
  [MODE_AREA_PICK]: [wheelZoomInteraction, areaPickInteraction, createGroupInteraction],
  [MODE_BORDER]: [resizeInteraction, wheelZoomInteraction]
}

/**
 * 模式管理器
 */
class ModeManager {
  modes: IMode = {}
  /**
   * 注册一个模式
   * @param modeName 
   * @param interactions 
   */
  registerMode(modeName: string, interactions: Interaction[]) {
    this.modes[modeName] = interactions
  }
  /**
   * 注销一个模式
   * @param modeName 
   */
  unregisterMode(modeName: string) {
    delete this.modes[modeName]
  }
  /**
   * 使用
   * @param modeName 
   */
  use(modeName: string): Interaction[] {
    return this.modes[modeName] || []
  }
  /**
   * 检车是否存在指定模式
   * @param modeName 
   */
  hasMode(modeName: string) {
    return this.modes.hasOwnProperty(modeName)
  }
}

const modeManager = new ModeManager()

modeManager.registerMode(MODE_DEFAULT, [
  new SelectInteraction(),
  new DragInteraction(),
  new DropInteraction(),
  new WheelZoomInteraction(),
  new MenuInteraction(),
  new CollapseAndExpandInteraction()
])
modeManager.registerMode(MODE_VIEW, [
  new MoveCanvasInteraction(),
  new WheelZoomInteraction()
])
modeManager.registerMode(MODE_CREATE_EDGE, [
  new SelectInteraction(),
  new WheelZoomInteraction(),
  new CreateLineInteraction({
    arrow: true
  }),
  new MoveCanvasInteraction()
])
modeManager.registerMode(MODE_CREATE_L, [
  new SelectInteraction(),
  new WheelZoomInteraction(),
  new CreateLInteraction(),
  new MoveCanvasInteraction()
])
modeManager.registerMode(MODE_AREA_PICK, [
  new WheelZoomInteraction(),
  new AreaPickInteraction(),
  new CreateGroupInteraction()
])
modeManager.registerMode(MODE_BORDER, [
  new ResizeInteraction(),
  new WheelZoomInteraction()
])

export default modeManager