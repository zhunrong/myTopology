import { TreeNode } from '../graphics/utils/tree'

const data = [{
  id: 1,
  parentId: 0
}, {
  id: 2,
  parentId: 1
}, {
  id: 3,
  parentId: 1
}, {
  id: 4,
  parentId: 1
}, {
  id: 5,
  parentId: 2
}, {
  id: 6,
  parentId: 2
}]

const nodes: TreeNode<any>[] = data.map(item => new TreeNode(item.id, item))
nodes.forEach(node => {
  const parent = nodes.find(item => item.id === node.data.parentId)
  if (parent) {
    parent.addChild(node)
  }
})
console.log(nodes)
console.log(nodes[0].root)
console.log(nodes[5].root)