const nodeDatas: any[] = []
let id = 0
while (id++ < 10) {
  nodeDatas.push({
    text: `n-${id}`,
    id,
    x: Math.random() * 4600 - 1000,
    y: Math.random() * 3600 - 1000,
    zIndex: Math.round(Math.random() * 1000)
  })
}

const edgeDatas: any[] = []
let edgeId = 0
let nodeCount = nodeDatas.length
while (edgeId++ < nodeCount / 2) {
  const targetIndex = Math.floor(Math.random() * nodeCount)
  const sourceIndex = Math.floor(Math.random() * nodeCount)
  edgeDatas.push({
    targetId: nodeDatas[targetIndex].id,
    sourceId: nodeDatas[sourceIndex].id
  })
}

// const nodeDatas: any[] = [
//   {
//     text: 'node-1',
//     id: 1,
//     parentId: null,
//     isGroup: false,
//     x: 100,
//     y: 100,
//     zIndex: 1
//   },
//   {
//     text: 'node-2',
//     id: 2,
//     parentId: null,
//     isGroup: false,
//     x: 400,
//     y: 100,
//     zIndex: 2
//   },
//   {
//     text: '',
//     id: 3,
//     parentId: null,
//     isGroup: true,
//     x: 600,
//     y: 100,
//     zIndex: 1,
//     width: 200,
//     height: 200
//   },
//   {
//     text: 'node-4',
//     id: 4,
//     parentId: 3,
//     isGroup: false,
//     x: 610,
//     y: 110,
//     zIndex: 3
//   }
// ]
export {
  nodeDatas,
  edgeDatas
}