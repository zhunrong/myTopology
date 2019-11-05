import Graph, { IGraphOptions } from './Graph'
import { Vector2d } from '../utils/vector2d'
import Edge from './Edge'
export interface INodeOptions extends IGraphOptions {
  x?: number
  y?: number
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
   * 获取位置
   */
  getPosition() {
    return this.position
  }

  get visible(): boolean {
    if (!this._visible) return false
    if (this.parent && (!this.parent.visible || !this.parent.isExpanded)) return false
    return true
  }

  set visible(visible: boolean) {
    this._visible = visible
  }

  get miniMapVisible(): boolean {
    if (this.parent && (!this.parent.miniMapVisible || !this.parent.isExpanded)) return false
    return true
  }

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
   * 边界盒子 [左上,右上,右下,左下]
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
   * 是否为组
   */
  isGroup: boolean = false

  /**
   * 是否展开
   */
  isExpanded: boolean = true

  /**
   * 是否可以调节尺寸
   */
  canResize: boolean = false

  /**
   * 子节点
   */
  children: Node[] = []

  /**
   * 父节点
   */
  parent: Node | undefined

  /**
   * 相关的边线
   */
  edges: Edge[] = []

  constructor(options: INodeOptions) {
    super(options)
    this.position = new Vector2d(options.x, options.y)
    this.id = options.id
  }

  /**
   * 将节点以及其子元素位置偏移
   * @param offset 
   */
  translate(offset: Vector2d) {
    this.position.add(offset)
    this.isUpdate = true
    this.children.forEach(child => {
      child.translate(offset)
    })
  }

  /**
   * 添加边线
   * @param edge 
   */
  addEdge(edge: Edge) {
    if (this.edges.find(item => item === edge)) return
    this.edges.push(edge)
  }

  /**
   * 删除边线
   * @param edge 
   */
  removeEdge(edge: Edge) {
    const index = this.edges.findIndex(item => item === edge)
    if (index > -1) {
      this.edges.splice(index, 1)
    }
  }

  /**
   * 添加子节点，按zIndex升序排序
   * @param child 
   */
  addChild(child: Node) {
    // fix: 禁止将祖先节点添加为子节点，否则会造成引用死循环
    if (child.hasDescendant(this)) return
    if (this.hasChild(child)) return
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
      if (child.parent) {
        child.parent.removeChild(child, false)
      }

      child.parent = this
      this.children.splice(index, 0, child)
      if (this.canvas) {
        child.canvas = this.canvas
        //
        child.render()
        child.getDescendantBF(node => {
          node.canvas = this.canvas
          //
          node.render()
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
   * @param destroy 是否销毁
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
   * @param destroy 是否销毁
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
   * 判断是否有激活的祖先节点
   */
  hasActiveAncestor(): boolean {
    return !!this.parent && (this.parent.active || this.parent.hasActiveAncestor())
  }

  /**
   * 根据id获取子节点
   * @param id 
   */
  getChildById(id: Node['id']): Node | undefined {
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