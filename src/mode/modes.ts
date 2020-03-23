import Interaction from '../interaction/Interaction'
import DragInteraction from '../interaction/DragInteraction'
import DropInteraction from '../interaction/DropInteraction'
import MoveCanvasInteraction from '../interaction/MoveCanvasInteraction'
import WheelZoomInteraction from '../interaction/WheelZoomInteraction'
import SelectInteraction from '../interaction/SelectInteraction'
import AreaPickInteraction from '../interaction/AreaPickInteraction'
import CreateGroupInteraction from '../interaction/CreateGroupInteraction'
import ResizeInteraction from '../interaction/ResizeInteraction'
import CollapseAndExpandInteraction from '../interaction/CollapseAndExpandInteraction'
import CreateEdgeInteraction from '../interaction/CreateEdgeInteraction'
import ManualAlignInteraction from '../interaction/ManualAlignInteraction'
import L from '../edge/L'

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
export class ModeManager {
  modes: IMode = {}
  constructor() {
    this.registerMode(MODE_DEFAULT, [
      new SelectInteraction(),
      new DragInteraction(),
      new DropInteraction(),
      new WheelZoomInteraction(),
      new CollapseAndExpandInteraction(),
      new ManualAlignInteraction()
    ])
    this.registerMode(MODE_VIEW, [
      new MoveCanvasInteraction(),
      new WheelZoomInteraction()
    ])
    this.registerMode(MODE_CREATE_EDGE, [
      new SelectInteraction(),
      new WheelZoomInteraction(),
      new CreateEdgeInteraction(),
      new MoveCanvasInteraction()
    ])
    this.registerMode(MODE_CREATE_L, [
      new SelectInteraction(),
      new WheelZoomInteraction(),
      new CreateEdgeInteraction((sourceNode, targetNode) => {
        return new L({
          sourceNode,
          targetNode,
          arrow: true
        })
      }),
      new MoveCanvasInteraction()
    ])
    this.registerMode(MODE_AREA_PICK, [
      new WheelZoomInteraction(),
      new AreaPickInteraction(),
      new CreateGroupInteraction(),
      new ManualAlignInteraction()
    ])
    this.registerMode(MODE_BORDER, [
      new ResizeInteraction(),
      new WheelZoomInteraction()
    ])
  }
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


export default ModeManager