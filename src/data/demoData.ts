export interface IData {
  nodes: any[]
  edges: any[]
}
const data: IData = {
  "nodes": [
    {
      "name": "node1",
      "id": "n1"
    },
    {
      "name": "node2",
      "id": "n2"
    },
    {
      "name": "node3",
      "id": "n3"
    },
    {
      name: 'node4',
      id: 'n4'
    },
    {
      name: 'node5',
      id: 'n5'
    },
    {
      name: 'node6',
      id: 'n6'
    },
    {
      name: 'node7',
      id: 'n7'
    },
    {
      name: 'node8',
      id: 'n8'
    },
    {
      name: 'node9',
      id: 'n9'
    },
    {
      name: 'node10',
      id: 'n10'
    },
    {
      name: 'node12',
      id: 'n12'
    },
    {
      name: 'node13',
      id: 'n13'
    },
    {
      name: 'node14',
      id: 'n14'
    },
    {
      name: 'node15',
      id: 'n15'
    },
    {
      name: 'node16',
      id: 'n16'
    },
    {
      name: 'node17',
      id: 'n17'
    }
  ],
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
    }
  ]
}

export default data