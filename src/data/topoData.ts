const nodeDatas: any[] = []
let id = 0
while (id++ < 1000) {
  nodeDatas.push({
    text: `n-${id}`,
    id,
    x: Math.random() * 3600 - 1000,
    y: Math.random() * 2600 - 1000,
    zIndex: Math.round(Math.random() * 1000)
    // x: -100,
    // y: 0
  })
}
export {
  nodeDatas
}