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
  removeChild(child: Node, destroy: boolean = true): boolean {
    const index = this.children.findIndex(node => node === child)
    if (index === -1) return false
    destroy && child.destroy()
    child.canvas = undefined
    this.children.splice(index, 1)
    return true
  }

  /**
   * 删除所有子节点
   */
  removeAllChild(destroy: boolean = true) {
    const children = [...this.children]
    children.forEach(child => {
      this.removeChild(child, destroy)
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
   * 遍历顺序：1.深度优先
   *          2.从右到左
   *          3.从下到上
   * 场景：鼠标点击判定顺序
   * @param handler 
   */
  getDescendantDF(handler?: handler): Node[] {
    let breakFlag = false
    const descendants: Node[] = []
    function getDescendantDF(this: Node, handler?: handler): Node[] {
      for (let i = this.children.length - 1; i >= 0; i--) {
        const current = this.children[i]
        getDescendantDF.call(current, handler)
        if (breakFlag) return descendants
        descendants.push(current)
        if (handler && handler(current)) {
          breakFlag = true
          return descendants
        }
      }
      return descendants
    }
    return getDescendantDF.call(this, handler)
  }

  /**
   * 获取子孙节点
   * @param handler 处理函数
   * @param deepFirst 深度优先
   * @param top2Bottom 上到下
   * @param left2right 左到右
   */
  getDescendant(handler?: handler, deepFirst: boolean = true, top2Bottom: boolean = true, left2right: boolean = true): Node[] {
    const descendants: Node[] = []
    return descendants
  }

  /**
   * 遍历子孙节点，广度优先
   * 遍历顺序：1.广度优先
   *          2.从左到右
   *          3.从上到下
   * 场景：节点渲染顺序
   * @param handler 
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