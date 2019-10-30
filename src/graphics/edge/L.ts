import { Vector2d } from '../utils/vector2d'
import { Edge, IEdgeOptions } from '../graph/Edge'
import { Math2d } from '../utils/math2d'
import Triangle from '../element/Triangle'
import Text from '../element/Text'

export interface ILOptions extends IEdgeOptions {
  // 是否虚线
  dash?: boolean
  // 显示文本
  text?: string
  // 显示箭头
  arrow?: boolean
  // 双箭头
  doubleArrow?: boolean
}

const sourceJoinPointCopy = new Vector2d()
const targetNodeCenterCopy = new Vector2d()
const pixelCoordinateCopy = new Vector2d()

const ARROW_SIZE = { width: 8, height: 10 }

/**
 * L型线段
 */
export class L extends Edge {
  dash: boolean
  text: string
  arrow: boolean
  doubleArrow: boolean
  arrowStart: Vector2d | undefined
  rotate: number = 0
  middlePoints: Vector2d[] = []
  centerPoint: Vector2d | null = null
  sourceJoinPoint: Vector2d | undefined
  targetJoinPoint: Vector2d | undefined
  sourceArrowElement = new Triangle(ARROW_SIZE)
  targetArrowElement = new Triangle(ARROW_SIZE)
  textElement = new Text('')
  constructor(options: ILOptions) {
    super(options)
    this.dash = options.dash || false
    this.text = options.text || ''
    this.arrow = options.arrow || false
    this.doubleArrow = options.doubleArrow || false
    this.textElement.text = this.text
  }
  isInRect = () => {
    return true
  }
  isPointIn() {
    const sourceNode = this.getSourceNode()
    const targetNode = this.getTargetNode()
    if (!sourceNode.visible && !targetNode.visible) return false
    const { canvas } = this
    if (!canvas) return false
    if (!canvas.nativeEvent) return false
    if (!this.sourceJoinPoint || !this.targetJoinPoint) return false
    const event = canvas.nativeEvent as MouseEvent
    const viewCoordinate = new Vector2d(event.clientX, event.clientY)
    const pixelCoordinate = canvas.viewportToPixelCoordinate(viewCoordinate)
    // 判断点是否在线上
    if (Math2d.isPointInPolyline(pixelCoordinate, [this.sourceJoinPoint, ...this.middlePoints, this.targetJoinPoint], 0.1)) return true
    // 判断点是否在箭头上
    if (this.doubleArrow) {
      if (this.targetArrowElement.isPointIn(pixelCoordinate)) return true
      if (this.sourceArrowElement.isPointIn(pixelCoordinate)) return true
    } else if (this.arrow) {
      if (this.targetArrowElement.isPointIn(pixelCoordinate)) return true
    }
    // 判断是否在文字上
    if (this.text && this.textElement.isPointIn(pixelCoordinate)) return true
    return false
  }
  render() {
    if (!this.canvas) return
    const { graphCanvasCtx } = this.canvas
    // const { sourceNode, targetNode } = this
    const sourceNode = this.getSourceNode()
    const targetNode = this.getTargetNode()
    // 两端节点都存在且至少有一个是可见的
    if (sourceNode.visible || targetNode.visible) {

      const sourceJoinPoints = sourceNode.boundingJoinPoints
      const targetJoinPoints = targetNode.boundingJoinPoints
      // 计算出两个节点间距离最近的连接点
      let minDistance = 0
      this.sourceJoinPoint = undefined
      this.targetJoinPoint = undefined
      sourceJoinPoints.forEach(point1 => {
        targetJoinPoints.forEach(point2 => {
          const distance = point1.distance(point2)
          if (minDistance > distance || !this.sourceJoinPoint || !this.targetJoinPoint) {
            minDistance = distance
            this.sourceJoinPoint = point1
            this.targetJoinPoint = point2
          }
        })
      })
      if (!this.sourceJoinPoint || !this.targetJoinPoint) return
      const sourceJoinPoint = this.sourceJoinPoint as Vector2d
      const targetJoinPoint = this.targetJoinPoint as Vector2d

      sourceJoinPointCopy.copy(sourceJoinPoint)
      const outDirection = sourceJoinPointCopy.substract(sourceNode.centerPoint).normalize()
      targetNodeCenterCopy.copy(targetNode.centerPoint)
      const inDirection = targetNodeCenterCopy.substract(targetJoinPoint).normalize()

      if (outDirection.x === 1 || outDirection.x === -1) {
        if (inDirection.x === 1 || inDirection.x === -1) {
          const middleX = (sourceJoinPoint.x + targetJoinPoint.x) / 2
          this.middlePoints = [new Vector2d(middleX, sourceJoinPoint.y), new Vector2d(middleX, targetJoinPoint.y)]
        } else {
          this.middlePoints = [new Vector2d(targetJoinPoint.x, sourceJoinPoint.y)]
        }
      } else {
        if (inDirection.x === 1 || inDirection.x === -1) {
          this.middlePoints = [new Vector2d(sourceJoinPoint.x, targetJoinPoint.y)]
        } else {
          const middleY = (sourceJoinPoint.y + targetJoinPoint.y) / 2
          this.middlePoints = [new Vector2d(sourceJoinPoint.x, middleY), new Vector2d(targetJoinPoint.x, middleY)]
        }
      }

      graphCanvasCtx.save()
      if/* 虚线 */ (this.dash) {
        graphCanvasCtx.setLineDash([4, 4])
      }

      graphCanvasCtx.beginPath()
      graphCanvasCtx.moveTo(sourceJoinPoint.x, sourceJoinPoint.y)
      this.middlePoints.forEach(point => {
        graphCanvasCtx.lineTo(point.x, point.y)
      })
      graphCanvasCtx.lineTo(targetJoinPoint.x, targetJoinPoint.y)
      graphCanvasCtx.strokeStyle = this.active ? '#e96160' : '#29c1f8'
      graphCanvasCtx.stroke()


      if/* 文本 */ (this.text) {
        this.centerPoint = Math2d.getLinePoint([sourceJoinPoint, ...this.middlePoints, targetJoinPoint], 0.5)
        if (this.centerPoint) {
          graphCanvasCtx.fillStyle = this.active ? '#e96160' : '#29c1f8'
          this.textElement.text = this.text
          this.textElement.font = '14px sans-serif'
          this.textElement.backgroundColor = 'rgba(255,255,255,0.8)'
          this.textElement.position.copy(this.centerPoint)
          this.textElement.render(graphCanvasCtx)
        }
      }
      if/* 双向箭头 */(this.doubleArrow) {
        this.arrowStart = targetJoinPoint
        this.rotate = inDirection.xAxisAngle()
        graphCanvasCtx.fillStyle = this.active ? '#e96160' : '#29c1f8'
        this.targetArrowElement.position.copy(targetJoinPoint)
        this.targetArrowElement.rotate = this.rotate
        this.targetArrowElement.render(graphCanvasCtx)

        this.sourceArrowElement.position.copy(sourceJoinPoint)
        this.sourceArrowElement.rotate = outDirection.xAxisAngle() + Math.PI
        this.sourceArrowElement.render(graphCanvasCtx)
      } else if/* 单向箭头 */ (this.arrow) {
        this.arrowStart = targetJoinPoint
        this.rotate = inDirection.xAxisAngle()
        graphCanvasCtx.fillStyle = this.active ? '#e96160' : '#29c1f8'
        this.targetArrowElement.position.copy(targetJoinPoint)
        this.targetArrowElement.rotate = this.rotate
        this.targetArrowElement.render(graphCanvasCtx)
      }
      graphCanvasCtx.restore()
    }
  }
}

export default L