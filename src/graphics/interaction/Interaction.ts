import { Canvas } from '../core/Canvas'
function noop(canvas: Canvas, e: Event) { }
function noop2(canvas: Canvas) { }
export abstract class Interaction {
  onClick = noop
  onMouseDown = noop
  onMouseMove = noop
  onMouseUp = noop
  onDrop = noop
  onDragOver = noop
  onWheel = noop
  onContextMenu = noop
  // 模式安装
  onInstall = noop2
  // 模式卸载
  onUninstall = noop2
  // 渲染更新
  onUpdate  = noop2
}

export default Interaction