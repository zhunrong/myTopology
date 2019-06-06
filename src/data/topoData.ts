const nodeDatas: any[] = []
let id = 0
while (id++ < 3000) {
  nodeDatas.push({
    name: `n-${id}`,
    id,
    x: Math.random() * 4600 - 1500,
    y: Math.random() * 4600 - 2000
    // x: -100,
    // y: 0
  })
}
export {
  nodeDatas
}