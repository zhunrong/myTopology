import { Vector2d } from '../utils/vector2d'
import { Edge, IEdgeOptions } from '../graph/Edge'
import { Canvas } from '../core/Canvas'
import { Math2d } from '../utils/math2d'

export interface ILOptions extends IEdgeOptions {
  // 是否虚线
  dash?: boolean
  // 显示文本
  text?: string
  // 显示箭头
  arrow?: boolean
}

/**
 * L型线段
 */
export class L extends Edge {
  dash: boolean
  text: string
  arrow: boolean
  arrowStart: Vector2d | undefined
  rotate: number = 0
  middlePoints: Vector2d[] = []
  sourceJoinPoint: Vector2d | undefined
  targetJoinPoint: Vector2d | undefined
  // 缓存canvas(离屏canvas)
  constructor(options: ILOptions) {
    super(options)
    this.dash = options.dash || false
    this.text = options.text || ''
    this.arrow = options.arrow || false
  }
  isInRect = () => {
    return true
  }
  isPointIn(canvas: Canvas) {
    if (!canvas.nativeEvent) return false
    if (!this.sourceJoinPoint || !this.targetJoinPoint) return false
    const event = canvas.nativeEvent as MouseEvent
    const viewCoordinate = new Vector2d(event.clientX, event.clientY)
    const pixelCoordinate = canvas.viewPortTopixelCoordinate(viewCoordinate)
    // 判断点是否在线上
    if (Math2d.isPointInPolyline(pixelCoordinate, [this.sourceJoinPoint, ...this.middlePoints, this.targetJoinPoint], 0.1)) return true
    // 判断点是否在箭头上
    if (this.arrow && this.arrowStart) {
      const p0 = new Vector2d(0, 0).rotate(this.rotate)
      const p1 = new Vector2d(- 10, + 4).rotate(this.rotate)
      const p2 = new Vector2d(- 10, - 4).rotate(this.rotate)
      if (Math2d.isPointInTriangle(pixelCoordinate.substract(this.arrowStart), p0, p1, p2)) return true
    }
    // 判断是否在文字上
    if (this.text) {
      // const { graphCanvasCtx } = canvas
      // graphCanvasCtx.save()
      // graphCanvasCtx.font = '14px sans-serif'
      // graphCanvasCtx.textAlign = 'center'
      // graphCanvasCtx.textBaseline = 'middle'
      // const textRectWidth = graphCanvasCtx.measureText(this.text).width
      // const sourceToTarget = this.targetNode.joinPoint.substract(this.sourceNode.joinPoint)
      // const lineNormal = sourceToTarget.normalize()
      // const lineCenter = this.sourceNode.joinPoint.add(sourceToTarget.scale(1 / 2))
      // const perpendicular = sourceToTarget.perpendicular().normalize()
      // graphCanvasCtx.restore()
      // if (this.rotate < Math.PI / 2 && this.rotate >= -Math.PI / 2) {
      //   const p0 = lineCenter.substract(lineNormal.scale(textRectWidth / 2)).add(perpendicular.scale(17))
      //   const p1 = p0.add(lineNormal.scale(textRectWidth))
      //   const p2 = p1.substract(perpendicular.scale(14))
      //   const p3 = p2.substract(lineNormal.scale(textRectWidth))
      //   if (Math2d.isPointInPolygon(pixelCoordinate, [p0, p1, p2, p3])) return true
      // } else {
      //   const p0 = lineCenter.substract(lineNormal.scale(textRectWidth / 2)).add(perpendicular.scale(-17))
      //   const p1 = p0.add(lineNormal.scale(textRectWidth))
      //   const p2 = p1.substract(perpendicular.scale(-14))
      //   const p3 = p2.substract(lineNormal.scale(textRectWidth))
      //   if (Math2d.isPointInPolygon(pixelCoordinate, [p0, p1, p2, p3])) return true
      // }
    }
    return false
  }
  render() {
    const { graphCanvasCtx } = this.canvas
    const { sourceNode, targetNode } = this
    // 两端节点都存在且至少有一个是可见的
    if (sourceNode && targetNode && (sourceNode.visible || targetNode.visible)) {

      const sourceJoinPoints = sourceNode.boundingJoinPoints
      const targetJoinPoints = targetNode.boundingJoinPoints
      // 计算出两个节点间距离最近的连接点
      let minDistance = 0
      this.sourceJoinPoint = undefined
      this.targetJoinPoint = undefined
      sourceJoinPoints.forEach(point1 => {
        targetJoinPoints.forEach(point2 => {
          const distance = point1.distance(point2)
          if (minDistance >= distance || !this.sourceJoinPoint || !this.targetJoinPoint) {
            minDistance = distance
            this.sourceJoinPoint = point1
            this.targetJoinPoint = point2
          }
        })
      })
      if (!this.sourceJoinPoint || !this.targetJoinPoint) return
      const sourceJoinPoint = this.sourceJoinPoint as Vector2d
      const targetJoinPoint = this.targetJoinPoint as Vector2d
      const outDirection = sourceJoinPoint.substract(sourceNode.centerPoint).normalize()
      const inDirection = targetNode.centerPoint.substract(targetJoinPoint).normalize()

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
      graphCanvasCtx.fillStyle = this.active ? '#e96160' : '#29c1f8'
      graphCanvasCtx.stroke()


      if/* 文本 */ (this.text) {

      }
      if/**箭头 */ (this.arrow) {
        this.arrowStart = targetJoinPoint
        this.rotate = inDirection.xAxisAngle()
        graphCanvasCtx.beginPath()
        graphCanvasCtx.save()
        graphCanvasCtx.translate(this.arrowStart.x, this.arrowStart.y)
        graphCanvasCtx.rotate(this.rotate)
        graphCanvasCtx.moveTo(0, 0)
        graphCanvasCtx.lineTo(- 10, + 4)
        graphCanvasCtx.lineTo(- 10, - 4)
        graphCanvasCtx.closePath()
        graphCanvasCtx.fill()
        graphCanvasCtx.restore()
      }
    }
  }
}

export default L