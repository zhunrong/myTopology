export interface IListener {
    (event?: any): void;
}
export interface IEvents {
    [eventName: string]: IListener[];
}
export declare class EventEmitter {
    readonly events: IEvents;
    on(eventName: string, listener: IListener): void;
    off(eventName: string, listener: IListener): void;
    emit(eventName: string, params?: any): void;
    clear(): void;
}
export default EventEmitter;
