import { Vector2d } from '../utils/Vector2d'
import { Edge, IEdgeOptions } from '../graph/Edge'
import Math2d from '../utils/Math2d'
import Triangle from '../element/Triangle'
import Text from '../element/Text'
import Element from '../element/Element'
import Polyline from '../element/Polyline'
import PathAnimate from '../animate/PathAnimate'

export interface ILOptions extends IEdgeOptions {
  // 是否虚线
  dash?: boolean
  // 显示文本
  text?: string
  // 显示箭头
  arrow?: boolean
  // 双箭头
  doubleArrow?: boolean
  // 动画元素
  animateElement?: Element
  /**
   * 动画持续时间
   */
  animateDuration?: number
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
  arrow: boolean
  doubleArrow: boolean
  arrowStart: Vector2d | undefined
  middlePoints: Vector2d[] = []
  centerPoint: Vector2d | null = null
  sourceJoinPoint: Vector2d | undefined
  targetJoinPoint: Vector2d | undefined
  sourceArrowElement = new Triangle(ARROW_SIZE)
  targetArrowElement = new Triangle(ARROW_SIZE)
  textElement = new Text('')
  lineElement = new Polyline()

  animate = new PathAnimate()

  constructor(options: ILOptions) {
    super(options)
    this.dash = options.dash || false
    this.arrow = options.arrow || false
    this.doubleArrow = options.doubleArrow || false
    this.style.lineWidth = 2
    this.textElement.text = this.text
    this.animate.element = options.animateElement || null
    this.animate.duration = options.animateDuration || 0
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
    if (this.lineElement.isPointIn(pixelCoordinate)) return true
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
  render(ctx?: CanvasRenderingContext2D) {
    ctx = ctx || (this.canvas && this.canvas.graphCanvasCtx)
    if (!ctx) return
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

      ctx.save()
      ctx.strokeStyle = this.active ? this.style.activeColor : this.style.color
      ctx.fillStyle = this.active ? this.style.activeColor : this.style.color
      if/* 虚线 */ (this.dash) {
        ctx.setLineDash([4, 4])
      }

      this.lineElement.lineWidth = this.style.lineWidth
      this.lineElement.points = [sourceJoinPoint, ...this.middlePoints, targetJoinPoint]
      this.lineElement.render(ctx)

      if/* 文本 */ (this.text) {
        this.centerPoint = Math2d.getLinePoint([sourceJoinPoint, ...this.middlePoints, targetJoinPoint], 0.5)
        if (this.centerPoint) {
          this.textElement.text = this.text
          this.textElement.font = '14px sans-serif'
          this.textElement.backgroundColor = 'rgba(255,255,255,0.8)'
          this.textElement.position.copy(this.centerPoint)
          this.textElement.render(ctx)
        }
      }
      if/* 双向箭头 */(this.doubleArrow) {
        this.arrowStart = targetJoinPoint
        this.targetArrowElement.position.copy(targetJoinPoint)
        this.targetArrowElement.rotate = inDirection.xAxisAngle()
        this.targetArrowElement.render(ctx)

        this.sourceArrowElement.position.copy(sourceJoinPoint)
        this.sourceArrowElement.rotate = outDirection.xAxisAngle() + Math.PI
        this.sourceArrowElement.render(ctx)
      } else if/* 单向箭头 */ (this.arrow) {
        this.arrowStart = targetJoinPoint
        this.targetArrowElement.position.copy(targetJoinPoint)
        this.targetArrowElement.rotate = inDirection.xAxisAngle()
        this.targetArrowElement.render(ctx)
      }

      this.animate.path = [sourceJoinPoint, ...this.middlePoints, targetJoinPoint]
      this.animate.update()
      this.animate.render(ctx)

      ctx.restore()
    }
  }

  drawThumbnail(ctx: CanvasRenderingContext2D) {
    this.render(ctx)
  }
}

export default L