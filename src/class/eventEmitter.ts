interface IListener {
  (event: any): void
}
interface IEventParams {
  [key: string]: any
}
export default class EventEmitter {
  on(eventName: string, listener: IListener) { }
  emit(eventName: string, params?: IEventParams) { }
}