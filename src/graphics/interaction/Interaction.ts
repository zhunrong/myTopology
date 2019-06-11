import Canvas from '../Canvas'
function noop(canvas: Canvas, e: Event) { }
export default abstract class Interaction {
  onClick = noop
  onMouseDown = noop
  onMouseMove = noop
  onMouseUp = noop
  onDrop = noop
  onDragOver = noop
  onWheel = noop
}