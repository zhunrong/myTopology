import { Canvas } from '../core/Canvas'
function noop(canvas: Canvas, e?: Event) { }
export abstract class Interaction {
  // 模式安装
  onInstall = noop
  // 模式卸载
  onUninstall = noop
  // 渲染更新
  onUpdate = noop

  /**
   * 处理画布事件
   * @param canvas 
   * @param event 
   */
  handleEvent(canvas: Canvas, event: Event) { }
}

export default Interaction