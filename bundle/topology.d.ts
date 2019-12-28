declare module "events/eventEmitter" {
    export interface IListener {
        (event?: any): void;
    }
    export interface IEvents {
        [eventName: string]: IListener[];
    }
    export class EventEmitter {
        readonly events: IEvents;
        /**
         * 监听事件
         * @param eventName
         * @param listener
         */
        on(eventName: string, listener: IListener): void;
        /**
         * 移除监听回调
         * @param eventName
         * @param listener
         */
        off(eventName: string, listener: IListener): void;
        /**
         * 激发事件
         * @param eventName
         * @param params
         */
        emit(eventName: string, params?: any): void;
        /**
         * 清除所有事件
         */
        clear(): void;
    }
    export default EventEmitter;
}
declare module "utils/Vector2d" {
    export class Vector2d {
        static xAxis: Vector2d;
        static yAxis: Vector2d;
        static copy(target: Vector2d): Vector2d;
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        get magnitude(): number;
        /**
         * 取模
         */
        getMagnitude(): number;
        /**
         * 矢量加
         * @param target
         */
        add(target: Vector2d): this;
        /**
         * 矢量减
         * @param target
         */
        substract(target: Vector2d): this;
        /**
         * 点积
         * @param target
         */
        dotProduct(target: Vector2d): number;
        /**
         * 叉积
         * @param target
         */
        crossProduct(target: Vector2d): number;
        /**
         * 与标量的积
         * @param scalar
         */
        scale(scalar: number): this;
        /**
         * 求边缘向量,返回新向量
         */
        edge(target: Vector2d): Vector2d;
        /**
         * 求正交向量,返回新向量
         */
        perpendicular(): Vector2d;
        /**
         * 求单位向量,返回新向量
         */
        normalize(): Vector2d;
        /**
         * 求法向量,返回新向量
         */
        normal(): Vector2d;
        /**
         * 求与目标向量的夹角余弦值
         * @param target
         */
        cosAngle(target: Vector2d): number;
        /**
         * 求与目标向量的夹角 弧度值
         * @param target
         */
        angle(target: Vector2d): number;
        /**
         * 与x轴夹角(顺时针为正) [-Math.PI,Math.PI]
         */
        xAxisAngle(): number;
        /**
         * 对向量进行旋转(参数为弧度值)
         * @param deg
         */
        rotate(deg: number): this;
        /**
         * 在目标向量上的投影,返回新向量
         * @param target
         */
        project(target: Vector2d): Vector2d;
        /**
         * 是否与目标向量相等
         * @param target
         */
        equal(target: Vector2d): boolean;
        /**
         * 与目标向量的距离
         * @param target
         */
        distance(target: Vector2d): number;
        /**
         * 复制目标向量
         * @param target
         */
        copy(target: Vector2d): this;
        /**
         * 克隆,复制当前向量返回新的向量
         */
        clone(): Vector2d;
    }
    export default Vector2d;
}
declare module "graph/Graph" {
    import Vector2d from "utils/Vector2d";
    import Canvas from "core/Canvas";
    export interface IStyle {
        color: string;
        activeColor: string;
        lineWidth: number;
        [key: string]: any;
    }
    export interface IGraphOptions {
        visible?: boolean;
        zIndex?: number;
        text?: string;
        data?: any;
    }
    export abstract class Graph {
        canvas: Canvas | undefined;
        active: boolean;
        _visible: boolean;
        protected _text: string;
        /**
         * 可见性
         */
        get visible(): boolean;
        set visible(visible: boolean);
        /**
         * 文本
         */
        get text(): string;
        set text(value: string);
        /**
         * 在鹰眼地图上是否可见
         */
        get miniMapVisible(): boolean;
        zIndex: number;
        isUpdate: boolean;
        graphId: number;
        /**
         * 用户数据
         */
        data: any;
        /**
         * 样式属性
         */
        style: IStyle;
        renderSign: any;
        constructor(options: IGraphOptions);
        /**
         * 判断点是否在图形内
         * @param canvas
         */
        abstract isPointIn(): boolean;
        /**
         * 是否在一个矩形内
         * @param points
         */
        isInRect(points: Vector2d[]): boolean;
        /**
         * 是否被指定矩形包围
         * @param rect
         */
        isWrappedInRect(rect: Vector2d[]): boolean;
        /**
         * 是否被指定圆包围
         */
        isWrappedInCircle(): boolean;
        /**
         * 绘制缩略图
         */
        abstract drawThumbnail(ctx: CanvasRenderingContext2D): void;
        /**
         * hook:渲染时调用
         */
        render(ctx?: CanvasRenderingContext2D): void;
        /**
         * hook:更新时调用
         */
        update(ctx?: CanvasRenderingContext2D): void;
        /**
         * hook:销毁时调用
         */
        destroy(): void;
        /**
         * hook:销毁前调用
         */
        beforeDestroy(): void;
        /**
         * 导出配置json
         */
        exportJson(): any;
    }
    export default Graph;
}
declare module "graph/Node" {
    import Graph, { IGraphOptions } from "graph/Graph";
    import Vector2d from "utils/Vector2d";
    import Edge from "graph/Edge";
    export interface INodeOptions extends IGraphOptions {
        x?: number;
        y?: number;
        id?: any;
    }
    export type BoundingRect = Vector2d[];
    export type handler = (node: Node) => void | true;
    export abstract class Node extends Graph {
        id: any;
        /**
         * 位置
         */
        position: Vector2d;
        /**
         * 是否已挂载(只对DOM节点有效)
         */
        mounted: boolean;
        /**
         * 获取位置
         */
        getPosition(): Vector2d;
        get visible(): boolean;
        set visible(visible: boolean);
        get miniMapVisible(): boolean;
        get text(): string;
        set text(value: string);
        /**
         * 顶点坐标数组
         */
        abstract get vertexes(): Vector2d[];
        /**
         * 几何中心坐标
         */
        abstract get centerPoint(): Vector2d;
        /**
         * 边界矩形上的连接点
         */
        abstract get boundingJoinPoints(): Vector2d[];
        /**
         * 边界盒子 [左上,右上,右下,左下]
         */
        abstract get boundingRect(): Vector2d[];
        /**
         * 外接圆半径
         */
        abstract get circumradius(): number;
        /**
         * 渲染类型
         */
        abstract readonly renderType: 'CANVAS' | 'DOM' | 'NONE';
        /**
         * 形状
         */
        abstract readonly shapeType: string;
        /**
         * 是否为组
         */
        isGroup: boolean;
        /**
         * 是否展开
         */
        isExpanded: boolean;
        /**
         * 是否可以调节尺寸
         */
        canResize: boolean;
        /**
         * 子节点
         */
        children: Node[];
        /**
         * 父节点
         */
        parent: Node | undefined;
        /**
         * 相关的边线
         */
        edges: Edge[];
        constructor(options: INodeOptions);
        /**
         * 将节点以及其子元素位置偏移
         * @param offset
         */
        translate(offset: Vector2d): void;
        /**
         * 添加边线
         * @param edge
         */
        addEdge(edge: Edge): void;
        /**
         * 删除边线
         * @param edge
         */
        removeEdge(edge: Edge): void;
        /**
         * 添加子节点，按zIndex升序排序
         * @param child
         */
        addChild(child: Node): Node | undefined;
        /**
         * 在指定位置追加子节点
         * @param child
         * @param index
         */
        addChildAt(child: Node, index: number): Node | undefined;
        /**
         * 删除并且销毁子节点
         * @param child
         * @param destroy 是否销毁
         */
        removeChild(child: Node, destroy?: boolean): boolean;
        /**
         * 删除所有子节点
         * @param destroy 是否销毁
         */
        removeAllChild(destroy?: boolean): void;
        /**
         * 判断是否为子节点
         * @param child
         */
        hasChild(child: Node): boolean;
        /**
         * 判断是否为子孙节点
         * @param descendant
         */
        hasDescendant(descendant: Node): boolean;
        /**
         * 判断是否有激活的祖先节点
         */
        hasActiveAncestor(): boolean;
        /**
         * 获取激活状态的子节点列表
         */
        getActiveChild(): Node[];
        /**
         * 获取激活状态的子孙节点列表
         */
        getActiveDescendant(): Node[];
        /**
         * 遍历子孙节点，深度优先
         * 遍历顺序：1.深度优先
         *          2.从右到左
         *          3.从下到上
         * 场景：鼠标点击判定顺序
         * @param handler
         */
        getDescendantDF(handler?: handler): Node[];
        /**
         * 遍历子孙节点，广度优先
         * 遍历顺序：1.广度优先
         *          2.从左到右
         *          3.从上到下
         * 场景：节点渲染顺序
         * @param handler
         */
        getDescendantBF(handler?: handler): Node[];
        /**
         * 获取根节点
         */
        get root(): Node;
        /**
         * 获取节点深度
         */
        get depth(): number;
        /**
         * 获取第一个子节点
         */
        get firstChild(): Node | undefined;
        /**
         * 获取最后一个子节点
         */
        get lastChild(): Node | undefined;
        /**
         * 挂载（只对DOM节点有效）
         */
        mount(force?: boolean): void;
        /**
         * 卸载（只对DOM节点有效）
         */
        unmount(): void;
        destroy(): void;
    }
    export default Node;
}
declare module "graph/Edge" {
    import Graph, { IGraphOptions } from "graph/Graph";
    import Node from "graph/Node";
    export interface IEdgeOptions extends IGraphOptions {
        targetNode: Node;
        sourceNode: Node;
    }
    export abstract class Edge extends Graph {
        renderType: string;
        targetNode: Node;
        sourceNode: Node;
        constructor(options: IEdgeOptions);
        /**
         * 获取目标节点
         */
        getTargetNode(): Node;
        /**
         * 获取源节点
         */
        getSourceNode(): Node;
    }
    export default Edge;
}
declare module "utils/Math2d" {
    import Vector2d from "utils/Vector2d";
    export class Math2d {
        /**
         * 判断点是否在矩形内
         * @param P
         * @param rectPosition
         * @param width
         * @param height
         */
        static isPointInRect(P: Vector2d, rectPosition: Vector2d, width: number, height: number): boolean;
        /**
         * 判断点是否在圆内
         * @param P
         * @param C
         * @param radius
         */
        static isPointInCircle(P: Vector2d, C: Vector2d, radius: number): boolean;
        /**
         * 判断点是否在三角形内
         * @param point
         * @param v0
         * @param v1
         * @param v2
         */
        static isPointInTriangle(P: Vector2d, A: Vector2d, B: Vector2d, C: Vector2d): boolean;
        /**
         * 判断点是否在多边形内
         * @param P
         * @param points
         */
        static isPointInPolygon(P: Vector2d, points: Vector2d[]): boolean;
        /**
         * 判断点是否在线段上
         * @param P
         * @param lineSegment
         * @param deviation 计算偏差 最小为0
         */
        static isPointInLineSegment(P: Vector2d, lineSegment: [Vector2d, Vector2d], deviation?: number): boolean;
        /**
         * 判断点是否在多线段上
         * @param P
         * @param polyline
         * @param deviation
         */
        static isPointInPolyline(P: Vector2d, polyline: Vector2d[], deviation?: number): boolean;
        /**
         * 判断两条线是否相交
         * @param line1
         * @param line2
         */
        static isIntersect(line1: [Vector2d, Vector2d], line2: [Vector2d, Vector2d]): boolean;
        /**
         * 获取两条相交线段的交点
         * @param line1
         * @param line2
         */
        static getLineIntersect(line1: [Vector2d, Vector2d], line2: [Vector2d, Vector2d]): Vector2d;
        /**
         * 根据ratio,获取线段上点的坐标,起点为0,终点为1
         * @param line
         * @param ratio
         */
        static getLinePoint(line: Vector2d[], ratio: number): Vector2d | null;
        /**
         * 获取多线段的长度
         * @param line
         */
        static getPolyLineLength(line: Vector2d[]): number;
    }
    export default Math2d;
}
declare module "graph/RectNode" {
    import Node, { INodeOptions } from "graph/Node";
    import Vector2d from "utils/Vector2d";
    export interface IRectNodeOptions extends INodeOptions {
        width?: number;
        height?: number;
        minWidth?: number;
        minHeight?: number;
    }
    export abstract class RectNode extends Node {
        shapeType: string;
        /**
         * 矩形宽度
         */
        width: number;
        /**
         * 矩形高度
         */
        height: number;
        /**
         * 最小宽度
         */
        minWidth: number;
        /**
         * 最小高度
         */
        minHeight: number;
        /**
         * 折叠宽度
         */
        collapseWidth: number;
        /**
         * 折叠高度
         */
        collapseHeight: number;
        constructor(options: IRectNodeOptions);
        get vertexes(): Vector2d[];
        get boundingRect(): Vector2d[];
        get boundingJoinPoints(): Vector2d[];
        get centerPoint(): Vector2d;
        get circumradius(): number;
        /**
         * 获取实际位置
         */
        getPosition(): Vector2d;
        /**
         * 获取计算宽度
         */
        getWidth(): number;
        /**
         * 获取计算高度
         */
        getHeight(): number;
        isPointIn(): boolean;
        get joinPoint(): Vector2d;
        /**
         * 边界矩形坐标数组
         */
        getBoundingRect(): Vector2d[];
        /**
         * 边界矩形上的连接点坐标数组
         */
        getBoundingJoinPoints(): Vector2d[];
        /**
         * 几何中点坐标
         */
        getCenterPoint(): Vector2d;
        /**
         * 是否在矩形中
         * @param points
         */
        isInRect(points: Vector2d[]): boolean;
        /**
         * 是否包含于某矩形
         * @param rect
         */
        isWrappedInRect(rect: Vector2d[]): boolean;
        drawThumbnail(ctx: CanvasRenderingContext2D): void;
    }
    export default RectNode;
}
declare module "graph/CircleNode" {
    import Node, { INodeOptions } from "graph/Node";
    import Vector2d from "utils/Vector2d";
    export interface ICircleNodeOptions extends INodeOptions {
        radius?: number;
        minRadius?: number;
        text?: string;
    }
    export abstract class CircleNode extends Node {
        shapeType: string;
        radius: number;
        minRadius: number;
        text: string;
        get boundingJoinPoints(): Vector2d[];
        get boundingRect(): Vector2d[];
        get centerPoint(): Vector2d;
        get vertexes(): Vector2d[];
        get circumradius(): number;
        constructor(options: ICircleNodeOptions);
        isPointIn(): boolean;
        /**
         * 边界矩形坐标数组
         */
        getBoundingRect(): Vector2d[];
        /**
         * 边界矩形上的连接点坐标数组
         */
        getBoundingJoinPoints(): Vector2d[];
        /**
         * 几何中点坐标
         */
        getCenterPoint(): Vector2d;
        /**
         * 是否相交于某矩形
         * @param points
         */
        isInRect(points: Vector2d[]): boolean;
        /**
         * 是否包含于某矩形
         * @param rect
         */
        isWrappedInRect(rect: Vector2d[]): boolean;
        drawThumbnail(ctx: CanvasRenderingContext2D): void;
    }
    export default CircleNode;
}
declare module "node/RectDomNode" {
    import RectNode, { IRectNodeOptions } from "graph/RectNode";
    export interface IRectDomNodeOptions extends IRectNodeOptions {
    }
    export class RectDomNode extends RectNode {
        readonly renderType = "DOM";
        $el: HTMLDivElement;
        constructor(options: IRectDomNodeOptions);
        mount(force?: boolean): void;
        unmount(): void;
        render(ctx?: CanvasRenderingContext2D): void;
        update(ctx?: CanvasRenderingContext2D): void;
    }
    export default RectDomNode;
}
declare module "node/RectDomGroup" {
    import RectDomNode, { IRectDomNodeOptions } from "node/RectDomNode";
    export interface IRectDomGroupOptions extends IRectDomNodeOptions {
        isExpanded?: boolean;
    }
    export class RectDomGroup extends RectDomNode {
        isGroup: boolean;
        canResize: boolean;
        constructor(options: IRectDomGroupOptions);
        render(): void;
        drawThumbnail(ctx: CanvasRenderingContext2D): void;
    }
    export default RectDomGroup;
}
declare module "utils/utils" {
    import Node from "graph/Node";
    import RectNode from "graph/RectNode";
    import CircleNode from "graph/CircleNode";
    import RectDomGroup from "node/RectDomGroup";
    /**
     * 节流函数
     * @param func
     */
    export function throttle(func: (...params: any[]) => void): (...params: any[]) => void;
    /**
     * 图片加载器
     * @param src
     */
    export function imgLoad(src: string): Promise<HTMLImageElement>;
    /**
     * 原型混入
     * @param derivedCtor 获得混入属性的构造函数
     * @param baseCtors 提供混入属性的构造函数列表
     */
    export function applyMixins(derivedCtor: any, baseCtors: any[]): void;
    /**
     * 是否为矩形节点
     * @param node
     */
    export function isRectNode(node: Node): node is RectNode;
    /**
     * 是否为圆形节点
     * @param node
     */
    export function isCircleNode(node: Node): node is CircleNode;
    /**
     * 是否为矩形DOM组
     * @param node
     */
    export function isRectDomGroup(node: Node): node is RectDomGroup;
}
declare module "graph/VirtualNode" {
    import Node, { INodeOptions, BoundingRect } from "graph/Node";
    import Vector2d from "utils/Vector2d";
    export class VirtualNode extends Node {
        maxDepth: boolean;
        renderType: 'NONE';
        shapeType: string;
        radius: number;
        constructor(options: INodeOptions);
        get vertexes(): Vector2d[];
        get boundingRect(): BoundingRect;
        get boundingJoinPoints(): Vector2d[];
        get joinPoint(): Vector2d;
        get centerPoint(): Vector2d;
        get depth(): number;
        get circumradius(): number;
        isInRect(): boolean;
        isPointIn(): boolean;
        render(): void;
        destroy(): void;
        updatePosition(): void;
        updateRender(): void;
        drawThumbnail(): void;
    }
    export default VirtualNode;
}
declare module "interaction/Interaction" {
    import { Canvas } from "core/Canvas";
    function noop(canvas: Canvas, e?: Event): void;
    export abstract class Interaction {
        onInstall: typeof noop;
        onUninstall: typeof noop;
        onUpdate: typeof noop;
        /**
         * 处理画布事件
         * @param canvas
         * @param event
         */
        handleEvent(canvas: Canvas, event: Event): void;
    }
    export default Interaction;
}
declare module "interaction/dragInteraction" {
    import Interaction from "interaction/Interaction";
    import Canvas from "core/Canvas";
    import Node from "graph/Node";
    import Vector2d from "utils/Vector2d";
    /**
     * 可拖拽图元或整个画布
     * 前置依赖：selectInteraction
     */
    export class DragInteraction extends Interaction {
        minDragDistance: number;
        moveNodes: Node[];
        mousedown: boolean;
        lastCoordinate: Vector2d;
        onMouseDown: (canvas: Canvas) => void;
        onMouseMove: (canvas: Canvas) => void;
        onMouseUp: (canvas: Canvas) => void;
        handleEvent(canvas: Canvas, event: Event): void;
    }
    export const dragInteraction: DragInteraction;
    export default DragInteraction;
}
declare module "interaction/dropInteraction" {
    import Interaction from "interaction/Interaction";
    import Canvas from "core/Canvas";
    /**
     * drop
     */
    export class DropInteraction extends Interaction {
        onDrop: (canvas: Canvas, e: Event) => void;
        onDragOver: (canvas: Canvas, e: Event) => void;
        handleEvent(canvas: Canvas, event: Event): void;
    }
    export const dropInteraction: DropInteraction;
    export default DropInteraction;
}
declare module "interaction/moveCanvasInteraction" {
    import Interaction from "interaction/Interaction";
    import Canvas from "core/Canvas";
    import Vector2d from "utils/Vector2d";
    /**
     * 拖动整个画布
     */
    export class MoveCanvasInteraction extends Interaction {
        minDragDistance: number;
        mouseDown: boolean;
        move: boolean;
        lastCoordinate: Vector2d;
        onMouseDown: (canvas: Canvas) => void;
        onMouseMove: (canvas: Canvas) => void;
        onMouseUp: (canvas: Canvas) => void;
        handleEvent(canvas: Canvas, event: Event): void;
    }
    export const moveCanvasInteraction: MoveCanvasInteraction;
    export default MoveCanvasInteraction;
}
declare module "interaction/wheelZoomInteraction" {
    import Interaction from "interaction/Interaction";
    import Canvas from "core/Canvas";
    /**
     * 滚轮缩放
     */
    export class WheelZoomInteraction extends Interaction {
        onWheel: (canvas: Canvas, e: Event) => void;
        handleEvent(canvas: Canvas, event: Event): void;
    }
    export const wheelZoomInteraction: WheelZoomInteraction;
    export default WheelZoomInteraction;
}
declare module "interaction/selectInteraction" {
    import Interaction from "interaction/Interaction";
    import { Canvas } from "core/Canvas";
    /**
     * 选中图元
     */
    export class SelectInteraction extends Interaction {
        onMouseDown: (canvas: Canvas) => void;
        handleEvent(canvas: Canvas, event: Event): void;
    }
    export const selectInteraction: SelectInteraction;
    export default SelectInteraction;
}
declare module "interaction/areaPickInteraction" {
    import Interaction from "interaction/Interaction";
    import Canvas from "core/Canvas";
    import Vector2d from "utils/Vector2d";
    import Node from "graph/Node";
    /**
     * 框选交互
     */
    export class AreaPickInteraction extends Interaction {
        minDragDistance: number;
        mouseDown: boolean;
        activeNodes: Node[];
        dragMove: boolean;
        lastCoordinate: Vector2d;
        onInstall: (canvas: Canvas) => void;
        onUninstall: (canvas: Canvas) => void;
        onMouseDown: (canvas: Canvas, e: Event) => void;
        onMouseMove: (canvas: Canvas, e: Event) => void;
        onMouseUp: (canvas: Canvas, e: Event) => void;
        handleEvent(canvas: Canvas, event: Event): void;
    }
    export const areaPickInteraction: AreaPickInteraction;
    export default AreaPickInteraction;
}
declare module "node/RectCanvasNode" {
    import RectNode, { IRectNodeOptions } from "graph/RectNode";
    export interface IRectCanvasNodeOptions extends IRectNodeOptions {
    }
    export class RectCanvasNode extends RectNode {
        readonly renderType = "CANVAS";
        cacheCanvas: HTMLCanvasElement;
        constructor(options: IRectCanvasNodeOptions);
        render(ctx?: CanvasRenderingContext2D): void;
        update(ctx?: CanvasRenderingContext2D): void;
    }
    export default RectCanvasNode;
}
declare module "node/RectCanvasGroup" {
    import { RectCanvasNode, IRectCanvasNodeOptions } from "node/RectCanvasNode";
    export interface IRectCanvasGroupOptions extends IRectCanvasNodeOptions {
        isExpanded?: boolean;
    }
    /**
     * 矩形组
     */
    export class RectCanvasGroup extends RectCanvasNode {
        static shape: string;
        isGroup: boolean;
        canResize: boolean;
        constructor(options: IRectCanvasGroupOptions);
        render(ctx?: CanvasRenderingContext2D): void;
        update(ctx?: CanvasRenderingContext2D): void;
        drawThumbnail(ctx: CanvasRenderingContext2D): void;
    }
    export default RectCanvasGroup;
}
declare module "plugin/Plugin" {
    import Canvas from "core/Canvas";
    export abstract class Plugin {
        /**
         * 画布实例
         */
        canvas: Canvas | null;
        /**
         * 是否启用
         */
        enable: boolean;
        /**
         * 安装
         */
        abstract install(canvas: Canvas): void;
        /**
         * 销毁
         */
        abstract destroy(): void;
        /**
         * 更新（画布更新时调用）
         */
        update(): void;
        /**
         * 处理事件
         * @param event
         */
        handleEvent(event: Event): void;
    }
    export default Plugin;
}
declare module "plugin/ContextMenu" {
    import Plugin from "plugin/Plugin";
    import Canvas from "core/Canvas";
    import Node from "graph/Node";
    import Edge from "graph/Edge";
    import Vector2d from "utils/Vector2d";
    export interface IMenu {
        label: string;
        command: string;
        [key: string]: any;
    }
    export class ContextMenu extends Plugin {
        position: Vector2d;
        mounted: boolean;
        container: HTMLDivElement;
        onContextMenu: ((instance: this, target: Node | Edge | null, nodes: Node[], edges: Edge[]) => IMenu[]) | null;
        menu: IMenu[];
        constructor();
        handleEvent(event: Event): void;
        install(canvas: Canvas): void;
        destroy(): void;
        /**
         * 显示
         */
        show(menu?: IMenu[], left?: number, top?: number): void;
        /**
         * 隐藏
         */
        hide: () => void;
        /**
         * 处理上下文菜单事件
         */
        handleContextMenu: (e: MouseEvent) => void;
        /**
         * 处理菜单点击事件
         */
        handleClick: (e: MouseEvent) => void;
    }
    export default ContextMenu;
}
declare module "interaction/createGroupInteraction" {
    import Interaction from "interaction/Interaction";
    import Canvas from "core/Canvas";
    import Node from "graph/Node";
    /**
     * 创建组
     */
    export class CreateGroupInteraction extends Interaction {
        canvas: Canvas;
        parentNode: Node | undefined;
        onCreate: () => Node;
        constructor(onCreate?: () => Node);
        onContextMenu: (canvas: Canvas, e: Event) => void;
        onInstall: (canvas: Canvas) => void;
        onUninstall: (canvas: Canvas) => void;
        onAddToGroup: (menu: any) => void;
        handleEvent(canvas: Canvas, event: Event): void;
    }
    export const createGroupInteraction: CreateGroupInteraction;
    export default CreateGroupInteraction;
}
declare module "node/CircleCanvasNode" {
    import Circle, { ICircleNodeOptions } from "graph/CircleNode";
    export interface ICircleCanvasNodeOptions extends ICircleNodeOptions {
    }
    export class CircleCanvasNode extends Circle {
        readonly renderType = "CANVAS";
        cacheCanvas: HTMLCanvasElement;
        constructor(options: ICircleCanvasNodeOptions);
        render(): void;
        update(): void;
    }
    export default CircleCanvasNode;
}
declare module "interaction/resizeInteraction" {
    import Interaction from "interaction/Interaction";
    import Canvas from "core/Canvas";
    import Node from "graph/Node";
    /**
     * resize
     */
    export class ResizeInteraction extends Interaction {
        activeNode: Node | undefined;
        flag: boolean;
        activeAnchorIndex: number;
        onInstall: (canvas: Canvas) => void;
        onUninstall: (canvas: Canvas) => void;
        onMouseUp: (canvas: Canvas) => void;
        onMouseDown: (canvas: Canvas) => void;
        onMouseMove: (canvas: Canvas, e: Event) => void;
        onUpdate: (canvas: Canvas) => void;
        getActiveAnchorIndex(canvas: Canvas): number;
        handleEvent(canvas: Canvas, event: Event): void;
    }
    export const resizeInteraction: ResizeInteraction;
    export default ResizeInteraction;
}
declare module "interaction/collapseAndExpandInteraction" {
    import Interaction from "interaction/Interaction";
    import Canvas from "core/Canvas";
    /**
     * 折叠与展开操作
     */
    export class CollapseAndExpandInteraction extends Interaction {
        lastTimestamp: number;
        onMouseDown: (canvas: Canvas) => void;
        handleEvent(canvas: Canvas, event: Event): void;
    }
    export const collapseAndExpandInteraction: CollapseAndExpandInteraction;
    export default CollapseAndExpandInteraction;
}
declare module "element/Element" {
    import Vector2d from "utils/Vector2d";
    export abstract class Element {
        position: Vector2d;
        offset: Vector2d;
        rotate: number;
        /**
         * 渲染
         * @param ctx
         */
        abstract render(ctx: CanvasRenderingContext2D): void;
        /**
         * 判断点是否处于图形内
         * @param point
         */
        abstract isPointIn(point: Vector2d): boolean;
    }
    export default Element;
}
declare module "element/Triangle" {
    import Element from "element/Element";
    import Vector2d from "utils/Vector2d";
    interface ITriangleOptions {
        width: number;
        height: number;
    }
    export class Triangle extends Element {
        width: number;
        height: number;
        constructor(options: ITriangleOptions);
        render(ctx: CanvasRenderingContext2D): void;
        isPointIn(point: Vector2d): boolean;
    }
    export default Triangle;
}
declare module "element/Rect" {
    import Element from "element/Element";
    import Vector2d from "utils/Vector2d";
    interface IRectOptions {
        width: number;
        height: number;
    }
    export class Rect extends Element {
        width: number;
        height: number;
        fillStyle: string;
        strokeStyle: string;
        constructor(options: IRectOptions);
        render(ctx: CanvasRenderingContext2D): void;
        isPointIn(point: Vector2d): boolean;
    }
    export default Rect;
}
declare module "element/Text" {
    import Element from "element/Element";
    import Vector2d from "utils/Vector2d";
    import Rect from "element/Rect";
    export class Text extends Element {
        text: string;
        font: string;
        backgroundColor: string;
        readonly textAlign: CanvasTextAlign;
        readonly textBaseline: CanvasTextBaseline;
        rectElement: Rect;
        constructor(text: string);
        render(ctx: CanvasRenderingContext2D): void;
        get width(): number;
        get height(): number;
        isPointIn(point: Vector2d): boolean;
    }
    export default Text;
}
declare module "element/Polyline" {
    import Element from "element/Element";
    import Vector2d from "utils/Vector2d";
    export class Polyline extends Element {
        points: Vector2d[];
        lineWidth: number;
        render(ctx: CanvasRenderingContext2D): void;
        isPointIn(point: Vector2d): boolean;
    }
    export default Polyline;
}
declare module "animate/PathAnimate" {
    import Vector2d from "utils/Vector2d";
    import Element from "element/Element";
    export class PathAnimate {
        path: Vector2d[];
        element: Element | null;
        duration: number;
        progress: number;
        private _lastPoint;
        update(timeDelta: number): void;
        render(ctx: CanvasRenderingContext2D): void;
    }
    export default PathAnimate;
}
declare module "edge/Line" {
    import { IStyle } from "graph/Graph";
    import Vector2d from "utils/Vector2d";
    import { Edge, IEdgeOptions } from "graph/Edge";
    import Element from "element/Element";
    import Triangle from "element/Triangle";
    import Text from "element/Text";
    import Polyline from "element/Polyline";
    import PathAnimate from "animate/PathAnimate";
    export interface ILineOptions extends IEdgeOptions {
        dash?: boolean;
        arrow?: boolean;
        doubleArrow?: boolean;
        animateElement?: Element;
        /**
         * 动画持续时间
         */
        animateDuration?: number;
    }
    export interface ILineStyle extends IStyle {
        lineWidth: number;
    }
    export class Line extends Edge {
        dash: boolean;
        arrow: boolean;
        doubleArrow: boolean;
        begin: Vector2d | undefined;
        end: Vector2d | undefined;
        lineElement: Polyline;
        sourceArrowElement: Triangle;
        targetArrowElement: Triangle;
        textElement: Text;
        animate: PathAnimate;
        constructor(options: ILineOptions);
        isInRect(): boolean;
        isPointIn(): boolean;
        render(ctx?: CanvasRenderingContext2D): void;
        drawThumbnail(ctx: CanvasRenderingContext2D): void;
    }
    export default Line;
}
declare module "interaction/CreateEdgeInteraction" {
    import Interaction from "interaction/Interaction";
    import Canvas from "core/Canvas";
    import Node from "graph/Node";
    import Edge from "graph/Edge";
    type CreateEdge = (sourceNode: Node, targetNode: Node) => Edge;
    /**
     * 创建连线
     */
    export class CreateEdgeInteraction extends Interaction {
        targetNode: Node | undefined;
        sourceNode: Node | undefined;
        edge: Edge | undefined;
        onCreate: CreateEdge;
        constructor(onCreate?: CreateEdge);
        onMouseUp: (canvas: Canvas) => void;
        onMouseMove: (canvas: Canvas) => void;
        onUninstall: (canvas: Canvas) => void;
        handleEvent(canvas: Canvas, event: Event): void;
    }
    export default CreateEdgeInteraction;
}
declare module "edge/L" {
    import { Vector2d } from "utils/Vector2d";
    import { Edge, IEdgeOptions } from "graph/Edge";
    import Triangle from "element/Triangle";
    import Text from "element/Text";
    import Element from "element/Element";
    import Polyline from "element/Polyline";
    import PathAnimate from "animate/PathAnimate";
    export interface ILOptions extends IEdgeOptions {
        dash?: boolean;
        text?: string;
        arrow?: boolean;
        doubleArrow?: boolean;
        animateElement?: Element;
        /**
         * 动画持续时间
         */
        animateDuration?: number;
    }
    /**
     * L型线段
     */
    export class L extends Edge {
        dash: boolean;
        arrow: boolean;
        doubleArrow: boolean;
        arrowStart: Vector2d | undefined;
        middlePoints: Vector2d[];
        centerPoint: Vector2d | null;
        sourceJoinPoint: Vector2d | undefined;
        targetJoinPoint: Vector2d | undefined;
        sourceArrowElement: Triangle;
        targetArrowElement: Triangle;
        textElement: Text;
        lineElement: Polyline;
        animate: PathAnimate;
        constructor(options: ILOptions);
        isInRect: () => boolean;
        isPointIn(): boolean;
        render(ctx?: CanvasRenderingContext2D): void;
        drawThumbnail(ctx: CanvasRenderingContext2D): void;
    }
    export default L;
}
declare module "mode/modes" {
    import Interaction from "interaction/Interaction";
    export const MODE_DEFAULT = "mode.default";
    export const MODE_VIEW = "mode.view";
    export const MODE_CREATE_EDGE = "mode.create.edge";
    export const MODE_CREATE_L = "mode.create.L";
    export const MODE_AREA_PICK = "mode.area.pick";
    export const MODE_BORDER = "mode.border";
    interface IMode {
        [name: string]: Interaction[];
    }
    /**
     * 模式管理器
     */
    class ModeManager {
        modes: IMode;
        /**
         * 注册一个模式
         * @param modeName
         * @param interactions
         */
        registerMode(modeName: string, interactions: Interaction[]): void;
        /**
         * 注销一个模式
         * @param modeName
         */
        unregisterMode(modeName: string): void;
        /**
         * 使用
         * @param modeName
         */
        use(modeName: string): Interaction[];
        /**
         * 检车是否存在指定模式
         * @param modeName
         */
        hasMode(modeName: string): boolean;
    }
    const modeManager: ModeManager;
    export default modeManager;
}
declare module "layout/Layout" {
    import Canvas from "core/Canvas";
    import Vector2d from "utils/Vector2d";
    import Node from "graph/Node";
    export class Transport {
        destination: Vector2d;
        distance: Vector2d;
        speed: Vector2d;
        node: Node | null;
        duration: number;
        pass: number;
        complete: boolean;
        update(timeDelta: number): void;
    }
    export abstract class Layout {
        canvas: Canvas;
        transports: Transport[];
        constructor(canvas: Canvas);
        /**
         * 更新
         */
        update(): boolean;
        /**
         * 布局
         */
        abstract layout(): void;
    }
    export default Layout;
}
declare module "core/Clock" {
    export class Clock {
        current: number;
        delta: number;
        update(): void;
        getDelta(): number;
    }
    export default Clock;
}
declare module "core/Canvas" {
    import EventEmitter from "events/eventEmitter";
    import Vector2d from "utils/Vector2d";
    import { Edge } from "graph/Edge";
    import Node from "graph/Node";
    import VirtualNode from "graph/VirtualNode";
    import Interaction from "interaction/Interaction";
    import Plugin from "plugin/Plugin";
    import Layout from "layout/Layout";
    import Clock from "core/Clock";
    type RenderType = 'CANVAS' | 'DOM';
    export interface ICanvasOptions {
        container: HTMLElement;
        scale?: number;
        maxScale?: number;
        minScale?: number;
        mode?: string;
        animate?: boolean;
        renderType?: RenderType;
    }
    export class Canvas {
        /**
         * 注册模式
         * @param modeName
         * @param interactions
         */
        static registerMode(modeName: string, interactions: Interaction[]): void;
        private mounted;
        private _running;
        private _animationFrameId;
        protected name: string;
        eventEmitter: EventEmitter;
        nativeEvent: Event | null;
        optimize: boolean;
        /**
         * 时钟
         */
        clock: Clock;
        /**
         * 节点渲染类型
         */
        renderType: RenderType;
        interactionMode: string;
        protected container: HTMLElement;
        wrapper: HTMLDivElement;
        containerClientRect: ClientRect | undefined;
        protected graphCanvas: HTMLCanvasElement;
        graphCanvasCtx: CanvasRenderingContext2D;
        topCanvas: HTMLCanvasElement;
        /**
         * 交互画布是否已挂载
         */
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
        /**
         * 画布根节点（虚拟节点，不可见）
         */
        rootNode: VirtualNode;
        /**
         * 舞台
         */
        get stage(): VirtualNode;
        /**
         * 插件列表
         */
        plugins: Plugin[];
        /**
         * 布局
         */
        layout: Layout | null;
        constructor(options: ICanvasOptions);
        /**
         * 设置缩放
         * @param scale
         */
        setZoom(scale: number): void;
        /**
         * 原生事件监听
         */
        protected nativeEventInit(): void;
        /**
         * 销毁
         */
        destroy(): void;
        /**
         * 原生事件分发处理
         */
        handleNativeEvent: (event: Event) => void;
        /**
         * 添加节点
         * @param node
         */
        addNode(node: Node): void;
        /**
         * 将节点置顶显示
         * @param node
         */
        setNodeTop(node: Node): void;
        /**
         * 获取激活状态的节点列表
         */
        getActiveNodes(): Node[];
        /**
         * 删除节点
         * @param node
         * @param destroy 是否销毁,默认true
         */
        removeNode(node: Node, destroy?: boolean): void;
        /**
         * 删除所有节点
         * @param destroy 是否销毁,默认true
         */
        removeAllNode(destroy?: boolean): void;
        /**
         * 添加边线
         * @param edge
         */
        addEdge(edge: Edge): void;
        /**
         * 删除边线
         * @param edge
         */
        removeEdge(edge: Edge): void;
        /**
         * 获取激活状态的边线列表
         */
        getActiveEdges(): Edge[];
        /**
         * 获取画布容器边界盒
         */
        getBoundingClientRect(): ClientRect;
        /**
         * 获取画布内容边界盒
         */
        getContentBoundingRect(): Vector2d[];
        /**
         * 将视口坐标转换成画布坐标。注：不考虑缩放
         * @param coordinate 鼠标位于视口的坐标
         */
        viewportToCanvasCoordinate(coordinate: Vector2d): Vector2d;
        /**
         * 画布坐标转换成视口坐标
         * @param coordinate
         */
        canvasToViewportCoordinate(coordinate: Vector2d): Vector2d;
        /**
         * 将画布坐标转换成像素坐标
         * @param coordinate 画布坐标
         */
        canvasToPixelCoordinate(coordinate: Vector2d): Vector2d;
        /**
         * 将像素坐标转换成画布坐标
         * @param coordinate 像素坐标
         */
        pixelToCanvasCoordinate(coordinate: Vector2d): Vector2d;
        /**
         * 将视口坐标转换成像素坐标
         * @param coordinate
         */
        viewportToPixelCoordinate(coordinate: Vector2d): Vector2d;
        /**
         * 将像素坐标转换成视口坐标
         * @param coordinate
         */
        pixelToViewportCoordinate(coordinate: Vector2d): Vector2d;
        /**
         * 画布可见边界盒
         */
        get canvasVisibleRect(): Vector2d[];
        /**
         * 画布放大
         * @param focus 缩放焦点相对于视口的坐标
         */
        zoomIn(focus?: Vector2d): void;
        /**
         * 画布缩小
         * @param focus 缩放焦点相对于视口的坐标
         */
        zoomOut(focus?: Vector2d): void;
        /**
         * 设置模式
         * @param mode
         */
        setMode(mode: string): void;
        /**
         * 优化节点显示
         */
        optimizeNode(): void;
        /**
         * 使用插件
         * @param plugin
         */
        use(plugin: Plugin): void;
        /**
         * 初始化画布
         */
        initCanvas(): void;
        /**
         * 挂载
         */
        mount(): void;
        /**
         * 卸载
         */
        unmount(): void;
        /**
         * 交互画布挂载
         */
        topCanvasMount(): void;
        /**
         * 交互画布卸载
         */
        topCanvasUnmount(): void;
        start(): void;
        stop(): void;
        loop(): void;
        /**
         * 渲染节点
         */
        private render;
    }
    export default Canvas;
}
declare module "node/CircleCanvasGroup" {
    import CircleCanvasNode, { ICircleCanvasNodeOptions } from "node/CircleCanvasNode";
    interface IGroupOptions extends ICircleCanvasNodeOptions {
        isExpanded?: boolean;
    }
    /**
     * 圆形组
     */
    export class CircleCanvasGroup extends CircleCanvasNode {
        static shape: string;
        isGroup: boolean;
        canResize: boolean;
        constructor(options: IGroupOptions);
        render(ctx?: CanvasRenderingContext2D): void;
        update(ctx?: CanvasRenderingContext2D): void;
        drawThumbnail(ctx: CanvasRenderingContext2D): void;
    }
    export default CircleCanvasGroup;
}
declare module "element/Image" {
    import Element from "element/Element";
    import Vector2d from "utils/Vector2d";
    export class Img extends Element {
        image: CanvasImageSource | undefined;
        constructor(source: string | CanvasImageSource);
        render(ctx: CanvasRenderingContext2D): void;
        isPointIn(point: Vector2d): boolean;
    }
    export default Img;
}
declare module "plugin/MiniMap" {
    import Plugin from "plugin/Plugin";
    import Canvas from "core/Canvas";
    export class MiniMap extends Plugin {
        canvasElement: HTMLCanvasElement;
        /**
         * 地图宽度
         */
        get width(): number;
        set width(value: number);
        /**
         * 地图高度
         */
        get height(): number;
        set height(value: number);
        constructor(width?: number, height?: number);
        install(canvas: Canvas): void;
        destroy(): void;
        update(): void;
        render(): void;
        handleMouseMove: (...params: any[]) => void;
        /**
         * 挂载
         * @param container
         */
        mount(container: HTMLElement): void;
        /**
         * 卸载
         */
        unmount(): void;
    }
    export default MiniMap;
}
declare module "layout/CircularLayout" {
    import Layout from "layout/Layout";
    /**
     * 环形布局
     */
    export class CircularLayout extends Layout {
        clockwise: boolean;
        radius: number;
        startAngle: number;
        endAngle: number;
        duration: number;
        gap: number;
        nodeRadius: number;
        layout(): void;
    }
    export default CircularLayout;
}
declare module "layout/MatrixLayout" {
    import Layout, { Transport } from "layout/Layout";
    /**
     * 行列布局
     */
    export class MatrixLayout extends Layout {
        /**
         * 行数
         */
        rows: number;
        /**
         * 行间隙
         */
        rowGap: number;
        /**
         * 列数
         */
        columns: number;
        /**
         * 列间隙
         */
        columnGap: number;
        /**
         * 节点半径
         */
        nodeRadius: number;
        /**
         * 布局过渡时间
         */
        duration: number;
        transports: Transport[];
        layout(): void;
    }
    export default MatrixLayout;
}
declare module "layout/ForceLayout" {
    import Layout, { Transport } from "layout/Layout";
    import Vector2d from "utils/Vector2d";
    class ForceTransport extends Transport {
        /**
         * 质量
         */
        M: number;
        /**
         * 电荷
         */
        Q: number;
        /**
         * 受力
         */
        force: Vector2d;
        /**
         * 加速度
         */
        accelerate: Vector2d;
        update(): void;
    }
    /**
     * 力导布局
     */
    export class ForceLayout extends Layout {
        transports: ForceTransport[];
        /**
         * 弹性系数
         */
        elasticity: number;
        /**
         * 中心吸引系数
         */
        attractive: number;
        /**
         * 斥力系数
         */
        repulsion: number;
        /**
         * 阻尼系数
         */
        damping: number;
        /**
         * 连线自然长度
         */
        edgeLength: number;
        /**
         * 布局完成?
         */
        complete: boolean;
        /**
         * 布局动画?
         */
        animate: boolean;
        layout(): void;
        update(): boolean;
        /**
         * 计算受力
         */
        calculateForce(): void;
    }
    export default ForceLayout;
}
declare module "index" {
    export * from "core/Canvas";
    export * from "events/eventEmitter";
    export * from "graph/Edge";
    export * from "graph/Node";
    export * from "mode/modes";
    export * from "interaction/Interaction";
    export * from "interaction/selectInteraction";
    export * from "interaction/dragInteraction";
    export * from "interaction/dropInteraction";
    export * from "interaction/moveCanvasInteraction";
    export * from "interaction/wheelZoomInteraction";
    export * from "interaction/areaPickInteraction";
    export * from "interaction/createGroupInteraction";
    export * from "interaction/CreateEdgeInteraction";
    export * from "node/RectDomNode";
    export * from "node/RectCanvasNode";
    export * from "node/CircleCanvasNode";
    export * from "node/RectCanvasGroup";
    export * from "node/RectDomGroup";
    export * from "node/CircleCanvasGroup";
    export * from "edge/Line";
    export * from "edge/L";
    export * from "utils/Math2d";
    export * from "utils/Vector2d";
    export * from "utils/utils";
    export * from "element/Image";
    export * from "element/Rect";
    export * from "element/Text";
    export * from "element/Triangle";
    export * from "element/Polyline";
    export * from "plugin/MiniMap";
    export * from "plugin/ContextMenu";
    export * from "layout/CircularLayout";
    export * from "layout/MatrixLayout";
    export * from "layout/ForceLayout";
}
