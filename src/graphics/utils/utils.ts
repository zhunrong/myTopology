/**
 * 节流函数
 * @param func 
 */
export function throttle(func: (...params: any[]) => void) {
  let running: boolean = false
  return function (...params: any[]) {
    if (running) return
    running = true
    func(...params)
    requestAnimationFrame(() => {
      running = false
    })
  }
}