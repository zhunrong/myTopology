export interface IData {
  nodes: any[]
  edges: any[]
}

let nodeId: number = 1

let nodes: any[] = []
// let edges: any[] = []
function createNodes(count: number): any[] {
  const nodes = []
  while (count-- > 0) {
    nodes.push({
      name: `node_${nodeId}`,
      id: `n${nodeId++}`
    })
  }
  return nodes
}
// function createEdges(count: number): any[] {
//   return []
// }
nodes = nodes.concat(createNodes(25))
const data: IData = {
  nodes,
  "edges": [
    {
      "id": "e1",
      "target": "n1",
      "source": "n2"
    },
    {
      "id": "e2",
      "target": "n3",
      "source": "n2"
    },
    {
      id: 'e3',
      target: 'n4',
      source: 'n2'
    },
    {
      id: 'e4',
      target: 'n5',
      source: 'n4'
    },
    {
      id: 'e5',
      target: 'n6',
      source: 'n2'
    },
    {
      id: 'e6',
      target: 'n6',
      source: 'n4'
    },
    {
      id: 'e7',
      target: 'n5',
      source: 'n7'
    },
    {
      id: 'e8',
      target: 'n8',
      source: 'n6'
    },
    {
      id: 'e9',
      target: 'n9',
      source: 'n7'
    },
    {
      id: 'e10',
      target: 'n10',
      source: 'n6'
    },
    {
      id: 'e11',
      target: 'n9',
      source: 'n5'
    },
    {
      id: 'e12',
      target: 'n11',
      source: 'n7'
    },
    {
      id: 'e13',
      target: 'n16',
      source: 'n15'
    },
    {
      id: 'e14',
      target: 'n12',
      source: 'n14'
    },
    {
      id: 'e15',
      target: 'n17',
      source: 'n15'
    },
    {
      id: 'e16',
      target: 'n18',
      source: 'n15'
    },
    {
      id: 'e17',
      target: 'n19',
      source: 'n15'
    },
    {
      id: 'e18',
      target: 'n20',
      source: 'n15'
    },
    {
      id: 'e19',
      target: 'n21',
      source: 'n15'
    },
    {
      id: 'e20',
      target: 'n22',
      source: 'n21'
    },
    {
      id: 'e21',
      target: 'n23',
      source: 'n22'
    },
    {
      id: 'e22',
      target: 'n13',
      source: 'n12'
    }
  ]
}

export default data