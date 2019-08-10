type handler<T> = (node: TreeNode<T>) => void | true

export class TreeNode<T> {
  id: string | number
  data: T | undefined
  children: TreeNode<T>[] = []
  parent: TreeNode<T> | undefined
  constructor(id: string | number, data?: T, parent?: TreeNode<T>) {
    this.id = id
    this.data = data
    if (parent) {
      parent.addChild(this)
    }
  }
  /**
   * 在最后追加子节点
   * @param child 
   */
  addChild(child: TreeNode<T>) {
    return this.addChildAt(child, this.children.length)
  }
  /**
   * 在指定位置追加子节点
   * @param child 
   * @param index 
   */
  addChildAt(child: TreeNode<T>, index: number) {
    if (index >= 0 && index <= this.children.length) {
      child.parent = this
      this.children.splice(index, 0, child)
      return child
    } else {
      return undefined
    }
  }
  /**
   * 根据id获取子节点
   * @param id 
   */
  getChildById(id: string | number): TreeNode<T> | undefined {
    return this.children.find(child => child.id === id)
  }

  /**
   * 遍历子孙节点，深度优先
   * @param handler 
   */
  getDescendantDF(handler?: handler<T>): TreeNode<T>[] {
    const descendants: TreeNode<T>[] = []
    const stack: TreeNode<T>[] = [...this.children]
    while (stack.length) {
      const last = stack.pop() as TreeNode<T>
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
  getDescendantBF(handler?: handler<T>): TreeNode<T>[] {
    const descendants: TreeNode<T>[] = []
    const queue: TreeNode<T>[] = [...this.children]
    while (queue.length) {
      const first = queue.shift() as TreeNode<T>
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
  get root(): TreeNode<T> {
    let cur: TreeNode<T> = this
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
    let cur: TreeNode<T> = this
    while (cur.parent !== undefined) {
      cur = cur.parent
      depth++
    }
    return depth
  }
  /**
   * 获取第一个子节点
   */
  get firstChild(): TreeNode<T> | undefined {
    return this.children[0]
  }
  /**
   * 获取最后一个子节点
   */
  get lastChild(): TreeNode<T> | undefined {
    return this.children[this.children.length - 1]
  }
}

export default TreeNode