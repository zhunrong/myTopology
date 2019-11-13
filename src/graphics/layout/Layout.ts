import Canvas from '../core/Canvas'

export abstract class Layout {
  canvas: Canvas
  constructor(canvas: Canvas) {
    this.canvas = canvas
  }

  /**
   * 更新
   */
  update() { }

  /**
   * 布局
   */
  abstract layout(): void

}

export default Layout