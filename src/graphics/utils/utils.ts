import Node from '../graph/Node'
import RectNode from '../graph/RectNode'
import CircleNode from '../graph/CircleNode'
import RectDomGroup from '../node/RectDomGroup'

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

/**
 * 是否为矩形节点
 * @param node 
 */
export function isRectNode(node: Node): node is RectNode {
  return node instanceof RectNode
}

/**
 * 是否为圆形节点
 * @param node 
 */
export function isCircleNode(node: Node): node is CircleNode {
  return node instanceof CircleNode
}

/**
 * 是否为矩形DOM组
 * @param node 
 */
export function isRectDomGroup(node: Node): node is RectDomGroup {
  return node instanceof RectDomGroup
}