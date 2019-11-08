import Canvas from '../core/Canvas'

export abstract class Plugin {
  /**
   * 画布实例
   */
  canvas: Canvas | null = null
  
  /**
   * 是否启用
   */
  enable = true

  /**
   * 安装
   */
  abstract install(canvas: Canvas): void

  /**
   * 销毁
   */
  abstract destroy(): void

  /**
   * 更新（画布更新时调用）
   */
  update() { }

  /**
   * 处理事件
   * @param event 
   */
  handleEvent(event:Event) { }
}

export default Plugin