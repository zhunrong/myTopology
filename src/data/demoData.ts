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
    }
  ]
}

export default data