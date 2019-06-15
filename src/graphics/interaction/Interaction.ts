import { Canvas } from '../index'
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
  onModeChange = noop2
}

export default Interaction