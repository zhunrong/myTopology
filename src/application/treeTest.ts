import { TreeNode } from '../graphics/utils/tree'

/**                            1
 *                          /  |  \
 *                        2    3   4
 *                       / \  / \                   
 *                      5  6  7  8
 *                     /  
 *                     9     
 */


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
}, {
  id: 7,
  parentId: 3
}, {
  id: 8,
  parentId: 3
}, {
  id: 9,
  parentId: 5
}]

const nodes: TreeNode<any>[] = data.map(item => new TreeNode(item.id, item))
nodes.forEach(node => {
  const parent = nodes.find(item => item.id === node.data.parentId)
  if (parent) {
    parent.addChild(node)
  }
})
const w = window as any
w.rootNode = nodes[0].root
console.log(nodes)