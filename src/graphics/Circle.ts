import { globalEvent, IListener } from '../events/eventEmitter'
import Circle, { ICircleOptions } from './shape/Circle'
import Vector2d from '../utils/vector2d'
import Canvas from './Canvas'
interface INodeOptions extends ICircleOptions {
  id: string | number
  name: string
}
export default class Node extends Circle {
  readonly id: string | number
  readonly renderType: string = 'dom'
  containerEl: HTMLDivElement
  mounted: boolean = false
  constructor(options: INodeOptions) {
    super(options)
    this.id = options.id
    this.containerEl = document.createElement('div')
    this.containerEl.innerText = options.name
    globalEvent.on('mousedown', this.handleMouseDown)
  }
  get joinPoint() {
    return this.position.add(new Vector2d(25, 25))
  }
  handleMouseDown: IListener = params => {
    // console.log(params)
  }
  // 碰撞检测
  hitTest(canvas: Canvas) {
    if (!canvas.nativeEvent) return false
    let el = canvas.nativeEvent.target as HTMLElement
    let isHit = false
    while (el && !isHit) {
      if (el === this.containerEl) {
        isHit = true
      }
      el = el.parentElement as HTMLElement
    }
    return isHit
  }
  mount(canvas: Canvas) {
    if (this.mounted) return
    canvas.root.appendChild(this.containerEl)
    this.mounted = true
  }
  unmount(canvas: Canvas) {
    if (!this.mounted) return
    canvas.root.removeChild(this.containerEl)
    this.mounted = false
  }
  render(canvas: Canvas) {
    if (this.visible) {
      this.mount(canvas)
    } else {
      this.unmount(canvas)
    }
    if (this.isUpdate && this.visible) {
      this.isUpdate = false
      Object.assign(this.containerEl.style, {
        width: '50px',
        height: '50px',
        fontSize: '12px',
        lineHeight: '50px',
        textAlign: 'center',
        backgroundColor: 'rgb(204, 204, 204)',
        borderRadius: '25px',
        position: 'absolute',
        display: 'block',
        transform: `translate3d(${this.position.x}px,${this.position.y}px,0)`
      })
    }
  }
}