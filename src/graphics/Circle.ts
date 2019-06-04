import ANode from './ANode'
import { globalEvent, IListener } from '../events/eventEmitter'
import Vector2d from '../utils/vector2d'

interface INodeOptions {
  id: string | number
  name: string
  x: number
  y: number
}
export default class Node extends ANode {
  readonly id: string | number
  position: Vector2d
  containerEl: HTMLDivElement
  mounted: boolean = false
  constructor(options: INodeOptions) {
    super()
    this.id = options.id
    this.position = new Vector2d(options.x, options.y)
    this.containerEl = document.createElement('div')
    this.containerEl.innerText = options.name
    // globalEvent.emit('register:node', this)
    globalEvent.on('mousedown', this.handleMouseDown)
  }
  get joinPoint() {
    return this.position.add(new Vector2d(25, 25))
  }
  handleMouseDown: IListener = params => {
    console.log(params)
  }
  // 碰撞检测
  hitTest(event: MouseEvent) {
    let el = event.target as HTMLElement
    let isHit = false
    while (el && !isHit) {
      if (el === this.containerEl) {
        isHit = true
      }
      el = el.parentElement as HTMLElement
    }
    return isHit
  }
  render(parentNode: HTMLDivElement) {
    Object.assign(this.containerEl.style, {
      width: '50px',
      height: '50px',
      fontSize: '12px',
      lineHeight: '50px',
      textAlign: 'center',
      backgroundColor: 'rgb(204, 204, 204)',
      borderRadius: '25px',
      position: 'absolute',
      transform: `translate3d(${this.position.x}px,${this.position.y}px,0)`
    })
    if (!this.mounted) {
      parentNode.appendChild(this.containerEl)
      this.mounted = true
    }
  }
}