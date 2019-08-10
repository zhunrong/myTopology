import Graph, { IGraphOptions } from './Graph'
import { Vector2d } from '../utils/vector2d'
export interface INodeOptions extends IGraphOptions<any> {
  x: number
  y: number
  id: number | string
}
// export type BoundingRect = [Vector2d,Vector2d,Vector2d,Vector2d]
export type BoundingRect = Vector2d[]
export type handler = (node: Node) => void | true
export abstract class Node extends Graph {
  /**
   * id
   */
  id: number | string
  /**
   * 位置
   */
  position: Vector2d
  /**
   * 顶点坐标数组
   */
  abstract get vertexes(): Vector2d[]
  /**
   * 几何中心坐标
   */
  abstract get centerPoint(): Vector2d
  /**
   * 边界矩形上的连接点
   */
  abstract get boundingJoinPoints(): Vector2d[]
  /**
   * 边界盒子
   */
  abstract get boundingRect(): Vector2d[]
  /**
   * 渲染类型
   */
  abstract renderType: string
  /**
   * 形状
   */
  abstract shapeType: string
  /**
   * 子节点
   */
  children: Node[] = []
  /**
   * 父节点
   */
  parent: Node | undefined

  constructor(options: INodeOptions) {
    super(options)
    this.position = new Vector2d(options.x, options.y)
    this.id = options.id
  }

  /**
   * 销毁节点
   */
  abstract destroy(): void

  /**
   * hook:销毁前钩子函数
   */
  beforeDestroy() { }

  abstract updatePosition(): void
  abstract updateRender(): void

  /**
   * 添加子节点，按zIndex升序排序
   * @param child 
   */
  addChild(child: Node) {
    if (this.hasChild(child)) return undefined
    let index = this.children.length - 1
    let current = this.children[index]
    while (current) {
      if (current.zIndex <= child.zIndex) {
        return this.addChildAt(child, index + 1)
      }
      index--
      current = this.children[index]
    }
    return this.addChildAt(child, 0)
  }

  /**
   * 在指定位置追加子节点
   * @param child 
   * @param index 
   */
  addChildAt(child: Node, index: number) {
    if (index >= 0 && index <= this.children.length) {
      child.parent = this
      this.children.splice(index, 0, child)
      if (this.canvas) {
        child.canvas = this.canvas
        child.getDescendantBF(node => {
          node.canvas = this.canvas
        })
      }
      return child
    } else {
      return undefined
    }
  }

  /**
   * 删除并且销毁子节点
   * @param child 
   */
  removeChild(child: Node): boolean {
    const index = this.children.findIndex(node => node === child)
    if (index === -1) return false
    child.destroy()
    this.children.splice(index, 1)
    return true
  }

  /**
   * 删除所有子节点
   */
  removeAllChild() {
    const children = [...this.children]
    children.forEach(child => {
      this.removeChild(child)
    })
  }

  /**
   * 判断是否为子节点
   * @param child 
   */
  hasChild(child: Node): boolean {
    return !!this.children.find(item => item === child)
  }

  /**
   * 判断是否为子孙节点
   * @param descendant 
   */
  hasDescendant(descendant: Node): boolean {
    let result = false
    this.getDescendantBF(node => {
      if (node === descendant) {
        return result = true
      }
    })
    return result
  }

  /**
   * 根据id获取子节点
   * @param id 
   */
  getChildById(id: string | number): Node | undefined {
    return this.children.find(child => child.id === id)
  }

  /**
   * 获取激活状态的子节点列表
   */
  getActiveChild(): Node[] {
    return this.children.filter(child => child.active)
  }

  /**
   * 获取激活状态的子孙节点列表
   */
  getActiveDescendant(): Node[] {
    const nodes: Node[] = []
    this.getDescendantBF(node => {
      if (node.active) {
        nodes.push(node)
      }
    })
    return nodes
  }

  /**
   * 遍历子孙节点，深度优先
   * @param handler 
   */
  getDescendantDF(handler?: handler): Node[] {
    const descendants: Node[] = []
    const stack: Node[] = [...this.children]
    while (stack.length) {
      const last = stack.pop() as Node
      descendants.push(last)
      stack.push(...last.children)
      if (handler && handler(last)) {
        break
      }
    }
    return descendants
  }

  /**
   * 遍历子孙节点，广度优先
   */
  getDescendantBF(handler?: handler): Node[] {
    const descendants: Node[] = []
    const queue: Node[] = [...this.children]
    while (queue.length) {
      const first = queue.shift() as Node
      descendants.push(first)
      queue.push(...first.children)
      if (handler && handler(first)) {
        break
      }
    }
    return descendants
  }

  /**
   * 获取根节点
   */
  get root(): Node {
    let cur: Node = this
    while (cur.parent !== undefined) {
      cur = cur.parent
    }
    return cur
  }
  /**
   * 获取节点深度
   */
  get depth(): number {
    let depth = 0
    let cur: Node = this
    while (cur.parent !== undefined) {
      cur = cur.parent
      depth++
    }
    return depth
  }

  /**
   * 获取第一个子节点
   */
  get firstChild(): Node | undefined {
    return this.children[0]
  }

  /**
   * 获取最后一个子节点
   */
  get lastChild(): Node | undefined {
    return this.children[this.children.length - 1]
  }
}

export default Node