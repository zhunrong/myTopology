import EventEmitter from '../events/eventEmitter';
import Vector2d from '../utils/Vector2d';
import { Edge } from '../graph/Edge';
import Node from '../graph/Node';
import VirtualNode from '../graph/VirtualNode';
import Interaction from '../interaction/Interaction';
import ModeManager from '../mode/modes';
import Plugin from '../plugin/Plugin';
import Layout from '../layout/Layout';
import Clock from './Clock';
declare type RenderType = 'CANVAS' | 'DOM';
export interface ICanvasOptions {
    container: HTMLElement;
    scale?: number;
    maxScale?: number;
    minScale?: number;
    mode?: string;
    animate?: boolean;
    renderType?: RenderType;
}
export declare class Canvas {
    registerMode(modeName: string, interactions: Interaction[]): void;
    private mounted;
    private _running;
    private _animationFrameId;
    protected name: string;
    eventEmitter: EventEmitter;
    nativeEvent: Event | null;
    optimize: boolean;
    clock: Clock;
    renderType: RenderType;
    interactionMode: string;
    modeManager: ModeManager;
    protected container: HTMLElement;
    wrapper: HTMLDivElement;
    containerClientRect: ClientRect | undefined;
    protected graphCanvas: HTMLCanvasElement;
    graphCanvasCtx: CanvasRenderingContext2D;
    topCanvas: HTMLCanvasElement;
    topCanvasMounted: boolean;
    topCanvasCtx: CanvasRenderingContext2D;
    virtualNode: VirtualNode;
    mousedownPosition: Vector2d;
    mouseupPosition: Vector2d;
    mousemovePosition: Vector2d;
    private ro;
    viewWidth: number;
    viewHeight: number;
    canvasWidth: number;
    canvasHeight: number;
    canvasScale: number;
    maxScale: number;
    minScale: number;
    repaint: boolean;
    animate: boolean;
    rootNode: VirtualNode;
    get stage(): VirtualNode;
    plugins: Plugin[];
    layout: Layout | null;
    constructor(options: ICanvasOptions);
    setZoom(scale: number): void;
    protected nativeEventInit(): void;
    destroy(): void;
    handleNativeEvent: (event: Event) => void;
    addNode(node: Node): void;
    setNodeTop(node: Node): void;
    getActiveNodes(): Node[];
    removeNode(node: Node, destroy?: boolean): void;
    removeAllNode(destroy?: boolean): void;
    addEdge(edge: Edge): void;
    removeEdge(edge: Edge): void;
    getActiveEdges(): Edge[];
    getBoundingClientRect(): ClientRect;
    getContentBoundingRect(): Vector2d[];
    viewportToCanvasCoordinate(coordinate: Vector2d): Vector2d;
    canvasToViewportCoordinate(coordinate: Vector2d): Vector2d;
    canvasToPixelCoordinate(coordinate: Vector2d): Vector2d;
    pixelToCanvasCoordinate(coordinate: Vector2d): Vector2d;
    viewportToPixelCoordinate(coordinate: Vector2d): Vector2d;
    pixelToViewportCoordinate(coordinate: Vector2d): Vector2d;
    get canvasVisibleRect(): Vector2d[];
    zoomIn(focus?: Vector2d): void;
    zoomOut(focus?: Vector2d): void;
    setMode(mode: string): void;
    optimizeNode(): void;
    use(plugin: Plugin): void;
    initCanvas(): void;
    mount(): void;
    unmount(): void;
    topCanvasMount(): void;
    topCanvasUnmount(): void;
    start(): void;
    stop(): void;
    loop(): void;
    private render;
}
export default Canvas;
