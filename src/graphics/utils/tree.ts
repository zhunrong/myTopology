interface ITreeNode {
  id: string | number
  data?: any
  children?: ITreeNode[],
}
export class Tree {
  root: ITreeNode
  constructor(root?: ITreeNode) {
    this.root = root || {
      children: [],
      id: 'root'
    }
  }
  /**
   * 获取树的深度
   */
  getDepth() {

  }
  /**
   * 获取宽度
   */
  getWidth() {
    console.log(this)
  }
}

export class TreeNode<T> {
  id: string | number
  data: T | undefined
  private _parent: TreeNode<T> | undefined
  private _children: TreeNode<T>[] | undefined
  constructor(id: string | number, data?: T, parent?: TreeNode<T>) {
    this.id = id
    this.data = data
    // this.parent = parent
    if (parent) {
      this._parent = parent
      parent.addChild(this)
    }
  }
  get parent(): TreeNode<T> | undefined {
    return this._parent
  }
  // set parent(parent: TreeNode<T> | undefined) {
  //   if (parent) {
  //     this._parent = parent
  //     parent.addChild(this)
  //   }
  // }
  get children(): TreeNode<T>[] | undefined {
    return this._children
  }
  /**
   * 在最后追加子节点
   * @param child 
   */
  addChild(child: TreeNode<T>) {
    if (this._children === undefined) {
      this._children = []
    }
    return this.addChildAt(child, this._children.length)
  }
  /**
   * 在指定位置追加子节点
   * @param child 
   * @param index 
   */
  addChildAt(child: TreeNode<T>, index: number) {
    if (this._children === undefined) {
      this._children = []
    }
    if (index >= 0 && index <= this._children.length) {
      child._parent = this
      this._children.splice(index, 0, child)
      return child
    } else {
      return undefined
    }
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
    if (this._children === undefined) {
      return undefined
    }
    return this._children[0]
  }
  /**
   * 获取最后一个子节点
   */
  get lastChild(): TreeNode<T> | undefined {
    if (this._children === undefined) {
      return undefined
    }
    return this._children[this._children.length - 1]
  }
}

export default Tree