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

/**
 * 图片加载器
 * @param src
 */
export function imgLoad(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      resolve(img)
    }
    img.onerror = () => {
      reject()
    }
  })
}

/**
 * 原型混入
 * @param derivedCtor 获得混入属性的构造函数
 * @param baseCtors 提供混入属性的构造函数列表
 */
export function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      if (name === 'constructor') return
      derivedCtor.prototype[name] = baseCtor.prototype[name]
    })
  })
}