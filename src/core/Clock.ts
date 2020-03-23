export class Clock {
  current: number = 0
  delta: number = 0
  update() {
    const current = (typeof performance === 'undefined' ? Date : performance).now()
    this.delta = this.current ? current - this.current : 0
    this.current = current
  }
  getDelta() {
    return this.delta
  }
}

export default Clock