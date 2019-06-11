const nodeDatas: any[] = []
let id = 0
while (id++ < 300) {
  nodeDatas.push({
    name: `n-${id}`,
    id,
    x: Math.random() * 5600 - 2000,
    y: Math.random() * 5600 - 2500
    // x: -100,
    // y: 0
  })
}
export {
  nodeDatas
}