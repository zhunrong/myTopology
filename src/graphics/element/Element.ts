import Vector2d from '../utils/vector2d'

export abstract class Element {
  position = new Vector2d()
  offset = new Vector2d()
  rotate = 0
  abstract render(ctx: CanvasRenderingContext2D): void
  abstract isPointIn(point: Vector2d): boolean
}

export default Element