import Canvas from '../core/Canvas';
export declare abstract class Plugin {
    canvas: Canvas | null;
    enable: boolean;
    abstract install(canvas: Canvas): void;
    abstract destroy(): void;
    update(): void;
    handleEvent(event: Event): void;
}
export default Plugin;
