import Interaction from '../interaction/Interaction'
import DragInteraction from '../interaction/dragInteraction'
import DropInteraction from '../interaction/dropInteraction'
import MoveCanvasInteraction from '../interaction/moveCanvasInteraction'
import WheelZoomInteraction from '../interaction/wheelZoomInteraction'
import CreateLineInteraction from '../interaction/createEdgeInteraction'
import CreateLInteraction from '../interaction/createLInteraction'
import SelectInteraction from '../interaction/selectInteraction'
import MenuInteraction from '../interaction/menuInteraction'
import AreaPickInteraction from '../interaction/areaPickInteraction'
import CreateGroupInteraction from '../interaction/createGroupInteraction'
import ResizeInteraction from '../interaction/resizeInteraction'
import CollapseAndExpandInteraction from '../interaction/collapseAndExpandInteraction'

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
  // new MenuInteraction(),
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
  new CreateLInteraction({
    arrow: true
  }),
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