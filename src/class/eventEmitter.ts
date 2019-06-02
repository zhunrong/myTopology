export interface IListener {
  (event?: IEventParams): void
}
export interface IEventParams {
  [key: string]: any
}
export interface IEvents {
  [eventName: string]: IListener[]
}
export default class EventEmitter {
  events: IEvents = {}
  on(eventName: string, listener: IListener) {
    this.events[eventName] = this.events[eventName] || []
    this.events[eventName].push(listener)
  }
  emit(eventName: string, params?: IEventParams) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(listener => {
        listener(params)
      })
    }
  }
}

export const globalEvent = new EventEmitter()