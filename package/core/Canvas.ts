import EventEmitter from '../events/eventEmitter';
import Vector2d from '../utils/Vector2d';
import { Edge } from '../graph/Edge';
import { isRectNode } from '../utils/utils';
import ResizeObserver from 'resize-observer-polyfill';
import Node from '../graph/Node';
import VirtualNode from '../graph/VirtualNode';
import Interaction from '../interaction/Interaction';
import ModeManager, { MODE_DEFAULT } from '../mode/modes';
import Plugin from '../plugin/Plugin';
import Layout from '../layout/Layout';
import Clock from './Clock';
import style from './canvas.scss';

console.log(style);

/**
 * 原生事件监听列表
 */
const nativeEvents = [
  'click',
  'dblclick',
  'mousedown',
  'wheel',
  'dragover',
  'drop',
  'contextmenu',
  'mouseenter'
];

type RenderType = 'CANVAS' | 'DOM'

export interface ICanvasOptions {
  container: HTMLElement
  scale?: number
  maxScale?: number
  minScale?: number
  mode?: string
  animate?: boolean
  renderType?: RenderType
}
export class Canvas {
  /**
   * 注册模式
   * @param modeName
   * @param interactions
   */
  registerMode(modeName: string, interactions: Interaction[]) {
    this.modeManager.registerMode(modeName, interactions);
  }
  private mounted = false;
  private _running = false;
  private _animationFrameId = 0;
  protected name = 'application';
  eventEmitter: EventEmitter = new EventEmitter();
  nativeEvent: Event | null = null;
  optimize = true;

  /**
   * 时钟
   */
  clock = new Clock();

  /**
   * 节点渲染类型
   */
  renderType: RenderType;

  // 交互模式
  interactionMode: string = MODE_DEFAULT;
  modeManager: ModeManager = new ModeManager();
  // 最外层div
  protected container: HTMLElement;
  // canvas与div的容器
  wrapper: HTMLDivElement = document.createElement('div');

  containerClientRect: ClientRect | undefined;
  // 主画布(用于绘制图形) 位于图层最底层
  protected graphCanvas: HTMLCanvasElement = document.createElement('canvas');
  graphCanvasCtx: CanvasRenderingContext2D;
  // 交互画布(交互时用到的辅助画布) 位于图层最顶层
  topCanvas: HTMLCanvasElement = document.createElement('canvas');
  /**
   * 交互画布是否已挂载
   */
  topCanvasMounted = false;
  topCanvasCtx: CanvasRenderingContext2D;
  // 辅助节点(不需要实际渲染的)
  virtualNode: VirtualNode = new VirtualNode({});

  mousedownPosition = new Vector2d();
  mouseupPosition = new Vector2d();
  mousemovePosition = new Vector2d();
  // resize监听器
  private ro: ResizeObserver;
  // 画布
  viewWidth = 0;
  viewHeight = 0;
  canvasWidth = 0;
  canvasHeight = 0;
  canvasScale: number;
  maxScale: number;
  minScale: number;
  // 重绘
  repaint = false;
  // 开启动画
  animate = false;

  /**
   * 画布根节点（虚拟节点，不可见）
   */
  rootNode: VirtualNode = new VirtualNode({
    id: 'rootNode'
  });

  /**
   * 舞台
   */
  get stage() {
    return this.rootNode;
  }

  /**
   * 插件列表
   */
  plugins: Plugin[] = [];

  /**
   * 布局
   */
  layout: Layout | null = null;

  constructor(options: ICanvasOptions) {
    this.container = options.container;
    this.wrapper.className = style.topology;
    this.graphCanvasCtx = this.graphCanvas.getContext('2d') as CanvasRenderingContext2D;
    this.topCanvasCtx = this.topCanvas.getContext('2d') as CanvasRenderingContext2D;
    this.canvasScale = options.scale || 1;
    this.maxScale = options.maxScale || 5;
    this.minScale = options.minScale || 0.1;
    this.animate = options.animate || false;
    this.renderType = options.renderType || 'DOM';
    this.rootNode.canvas = this;
    this.virtualNode.maxDepth = true;
    this.ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        this.viewWidth = width;
        this.viewHeight = height;
        this.canvasWidth = width / this.canvasScale;
        this.canvasHeight = height / this.canvasScale;
        this.getBoundingClientRect();
      }
      this.mount();
      this.initCanvas();
      this.optimizeNode();
      this.repaint = true;
    });
    this.ro.observe(this.container);
    this.nativeEventInit();
    this.setMode(options.mode || MODE_DEFAULT);
  }

  /**
   * 设置缩放
   * @param scale
   */
  setZoom(scale: number) {
    this.canvasScale = scale;
    this.canvasWidth = this.viewWidth / this.canvasScale;
    this.canvasHeight = this.viewHeight / this.canvasScale;
    this.initCanvas();
    this.optimizeNode();
    this.repaint = true;
  }

  /**
   * 原生事件监听
   */
  protected nativeEventInit() {
    nativeEvents.forEach(eventType => {
      this.wrapper.addEventListener(eventType, this.handleNativeEvent);
    });
    document.addEventListener('mousemove', this.handleNativeEvent);
    document.addEventListener('mouseup', this.handleNativeEvent);
  }

  /**
   * 销毁
   */
  destroy() {
    nativeEvents.forEach(eventType => {
      this.wrapper.removeEventListener(eventType, this.handleNativeEvent);
    });
    document.removeEventListener('mousemove', this.handleNativeEvent);
    document.removeEventListener('mouseup', this.handleNativeEvent);
    this.ro.unobserve(this.container);
    this.ro.disconnect();
    this.eventEmitter.clear();
    this.unmount();
    this.removeAllNode();
    // 销毁插件
    while (this.plugins.length) {
      const plugin = this.plugins.pop();
      if (plugin) {
        plugin.canvas = null;
        plugin.destroy();
      }
    }
  }

  /**
   * 原生事件分发处理
   */
  handleNativeEvent = (event: Event) => {
    this.nativeEvent = event;
    switch (event.type) {
      case 'mousedown':
        {
          const { clientX, clientY } = event as MouseEvent;
          this.mousedownPosition.x = clientX;
          this.mousedownPosition.y = clientY;
          this.getBoundingClientRect();
          break;
        }
      case 'mousemove':
        {
          const { clientY, clientX } = event as MouseEvent;
          this.mousemovePosition.x = clientX;
          this.mousemovePosition.y = clientY;
          this.optimizeNode();
          break;
        }
      case 'mouseup':
        {
          const { clientX, clientY } = event as MouseEvent;
          this.mouseupPosition.x = clientX;
          this.mouseupPosition.y = clientY;
          break;
        }
      case 'mouseenter':
      case 'drop':
        this.getBoundingClientRect();
        break;
      case 'contextmenu':
        event.preventDefault();
        break;
    }
    this.plugins.forEach(plugin => {
      plugin.handleEvent(event);
    });
    this.modeManager.use(this.interactionMode).forEach(interaction => {
      interaction.handleEvent(this, event);
    });
    this.eventEmitter.emit(event.type, event);
  };

  /**
   * 添加节点
   * @param node
   */
  addNode(node: Node) {
    if (this.rootNode.hasChild(node)) return;
    node.visible = node.isInRect(this.canvasVisibleRect);
    this.rootNode.addChild(node);
    this.repaint = true;
  }

  /**
   * 将节点置顶显示
   * @param node
   */
  setNodeTop(node: Node) {
    const parent = node.parent;
    if (!parent) return;
    const zIndex = parent.lastChild && parent.lastChild.zIndex || 0;
    node.zIndex = Math.max(zIndex, node.zIndex);
    parent.removeChild(node, false);
    parent.addChild(node);
    node.mount(true);
    node.getDescendantBF(child => {
      child.mount(true);
    });
    this.repaint = true;
  }

  /**
   * 获取激活状态的节点列表
   */
  getActiveNodes(): Node[] {
    return this.rootNode.getActiveDescendant();
  }

  /**
   * 删除节点
   * @param node
   * @param destroy 是否销毁,默认true
   */
  removeNode(node: Node, destroy = true) {
    if (!this.rootNode.hasDescendant(node)) return;
    if (!node.parent) return;
    node.parent.removeChild(node, destroy);
    // 把相连的edge也删掉

    const edges = [...node.edges];
    edges.forEach(edge => {
      this.removeEdge(edge);
    });
    this.repaint = true;
  }

  /**
   * 删除所有节点
   * @param destroy 是否销毁,默认true
   */
  removeAllNode(destroy = true) {
    this.rootNode.removeAllChild(destroy);
  }

  /**
   * 添加边线
   * @param edge
   */
  addEdge(edge: Edge) {
    edge.sourceNode.addEdge(edge);
    edge.targetNode.addEdge(edge);
    edge.canvas = this;
    this.repaint = true;
  }

  /**
   * 删除边线
   * @param edge
   */
  removeEdge(edge: Edge) {
    edge.sourceNode.removeEdge(edge);
    edge.targetNode.removeEdge(edge);
    edge.canvas = undefined;
    this.repaint = true;
  }

  /**
   * 获取激活状态的边线列表
   */
  getActiveEdges(): Edge[] {
    const activeEdges: Edge[] = [];
    const sign = Math.random();
    this.rootNode.getDescendantBF(node => {
      node.edges.forEach(edge => {
        if (edge.renderSign === sign) return;
        edge.renderSign = sign;
        if (edge.active) {
          activeEdges.push(edge);
        }
      });
    });
    return activeEdges;
  }

  /**
   * 获取画布容器边界盒
   */
  getBoundingClientRect() {
    this.containerClientRect = this.container.getBoundingClientRect();
    return this.containerClientRect;
  }

  /**
   * 获取画布内容边界盒
   */
  getContentBoundingRect() {
    const leftTop = new Vector2d(0, 0);
    const rightBottom = new Vector2d(this.canvasWidth, this.canvasHeight);
    this.rootNode.getDescendantBF(node => {
      const boundingRect = node.boundingRect;
      if (boundingRect[0].x < leftTop.x) {
        leftTop.x = boundingRect[0].x;
      }
      if (boundingRect[0].y < leftTop.y) {
        leftTop.y = boundingRect[0].y;
      }
      if (boundingRect[2].x > rightBottom.x) {
        rightBottom.x = boundingRect[2].x;
      }
      if (boundingRect[2].y > rightBottom.y) {
        rightBottom.y = boundingRect[2].y;
      }
    });
    return [leftTop, new Vector2d(rightBottom.x, leftTop.y), rightBottom, new Vector2d(leftTop.x, rightBottom.y)];
  }

  /**
   * 将视口坐标转换成画布坐标。注：不考虑缩放
   * @param coordinate 鼠标位于视口的坐标
   */
  viewportToCanvasCoordinate(coordinate: Vector2d) {
    const { top, left } = this.containerClientRect || this.getBoundingClientRect();
    return coordinate.clone().substract(new Vector2d(left, top));
  }

  /**
   * 画布坐标转换成视口坐标
   * @param coordinate
   */
  canvasToViewportCoordinate(coordinate: Vector2d) {
    const { top, left } = this.containerClientRect || this.getBoundingClientRect();
    return coordinate.clone().add(new Vector2d(left, top));
  }

  /**
   * 将画布坐标转换成像素坐标
   * @param coordinate 画布坐标
   */
  canvasToPixelCoordinate(coordinate: Vector2d) {
    return coordinate.clone().scale(1 / this.canvasScale);
  }

  /**
   * 将像素坐标转换成画布坐标
   * @param coordinate 像素坐标
   */
  pixelToCanvasCoordinate(coordinate: Vector2d) {
    return coordinate.clone().scale(this.canvasScale);
  }

  /**
   * 将视口坐标转换成像素坐标
   * @param coordinate
   */
  viewportToPixelCoordinate(coordinate: Vector2d) {
    return this.canvasToPixelCoordinate(this.viewportToCanvasCoordinate(coordinate));
  }

  /**
   * 将像素坐标转换成视口坐标
   * @param coordinate
   */
  pixelToViewportCoordinate(coordinate: Vector2d) {
    return this.canvasToViewportCoordinate(this.pixelToCanvasCoordinate(coordinate));
  }

  /**
   * 画布可见边界盒
   */
  get canvasVisibleRect() {
    return [
      new Vector2d(0, 0), // 左上
      new Vector2d(this.canvasWidth, 0), // 右上
      new Vector2d(this.canvasWidth, this.canvasHeight), // 右下
      new Vector2d(0, this.canvasHeight) // 左下
    ];
  }

  /**
   * 画布放大
   * @param focus 缩放焦点相对于视口的坐标
   */
  zoomIn(focus?: Vector2d) {
    focus = focus ? this.viewportToCanvasCoordinate(focus) : new Vector2d(this.viewWidth / 2, this.viewHeight / 2);
    const coordinate = this.canvasToPixelCoordinate(focus);
    this.canvasScale += 0.15;
    this.canvasScale = this.canvasScale > this.maxScale ? this.maxScale : this.canvasScale;
    const offset = this.canvasToPixelCoordinate(focus).substract(coordinate);

    this.canvasWidth = this.viewWidth / this.canvasScale;
    this.canvasHeight = this.viewHeight / this.canvasScale;

    this.rootNode.children.forEach(child => {
      child.translate(offset);
    });
    this.optimizeNode();
    this.initCanvas();
    this.repaint = true;
    this.eventEmitter.emit('canvas:zoom');
  }

  /**
   * 画布缩小
   * @param focus 缩放焦点相对于视口的坐标
   */
  zoomOut(focus?: Vector2d) {
    // 默认:画布中心
    focus = focus ? this.viewportToCanvasCoordinate(focus) : new Vector2d(this.viewWidth / 2, this.viewHeight / 2);
    const coordinate = this.canvasToPixelCoordinate(focus);
    this.canvasScale -= 0.15;
    this.canvasScale = this.canvasScale < this.minScale ? this.minScale : this.canvasScale;
    const offset = this.canvasToPixelCoordinate(focus).substract(coordinate);

    this.canvasWidth = this.viewWidth / this.canvasScale;
    this.canvasHeight = this.viewHeight / this.canvasScale;

    this.rootNode.children.forEach(child => {
      child.translate(offset);
    });
    this.optimizeNode();
    this.initCanvas();
    this.repaint = true;
    this.eventEmitter.emit('canvas:zoom');
  }

  /**
   * 设置模式
   * @param mode
   */
  setMode(mode: string) {
    if (!this.modeManager.hasMode(mode)) {
      console.warn(`该模式不存在:${mode}`);
      return;
    }
    this.modeManager.use(this.interactionMode).forEach(action => {
      action.onUninstall(this);
    });
    this.interactionMode = mode;
    this.modeManager.use(this.interactionMode).forEach(action => {
      action.onInstall(this);
    });
  }

  /**
   * 优化节点显示
   */
  optimizeNode() {
    if (!this.optimize) return;
    // 优化：缓存画布可视矩形
    const canvasRect = this.canvasVisibleRect;
    this.rootNode.getDescendantDF(node => {
      node.visible = node.isInRect(canvasRect);
    });
  }

  /**
   * 使用插件
   * @param plugin
   */
  use(plugin: Plugin) {
    plugin.install(this);
    this.plugins.push(plugin);
  }

  /**
   * 初始化画布
   */
  initCanvas() {
    this.graphCanvas.width = this.topCanvas.width = this.viewWidth;
    this.graphCanvas.height = this.topCanvas.height = this.viewHeight;
    Object.assign(this.topCanvas.style, {
      pointerEvents: 'none',
      zIndex: 2
    });
    Object.assign(this.graphCanvas.style, {
      pointerEvents: 'none',
      zIndex: 1
    });
  }

  /**
   * 挂载
   */
  mount() {
    if (this.mounted) return;
    this.wrapper.appendChild(this.graphCanvas);
    this.container.appendChild(this.wrapper);
    this.eventEmitter.emit('canvas:mounted');
    this.mounted = true;
  }

  /**
   * 卸载
   */
  unmount() {
    if (!this.mounted) return;
    this.container.removeChild(this.wrapper);
    this.mounted = false;
  }

  /**
   * 交互画布挂载
   */
  topCanvasMount() {
    if (this.topCanvasMounted) return;
    this.wrapper.appendChild(this.topCanvas);
    this.topCanvasMounted = true;
  }

  /**
   * 交互画布卸载
   */
  topCanvasUnmount() {
    if (!this.topCanvasMounted) return;
    this.wrapper.removeChild(this.topCanvas);
    this.topCanvasMounted = false;
  }

  start() {
    if (this._running) return;
    this._running = true;
    this.loop();
  }
  stop() {
    if (!this._running) return;
    cancelAnimationFrame(this._animationFrameId);
    this._running = false;
  }
  loop() {
    if (!this._running) return;
    this._animationFrameId = requestAnimationFrame(() => {
      this.clock.update();
      // 判断是否需要重绘
      if (this.repaint || this.animate) {
        this.graphCanvasCtx.clearRect(0, 0, this.viewWidth, this.viewHeight);
        this.graphCanvasCtx.save();
        this.graphCanvasCtx.scale(this.canvasScale, this.canvasScale);
        // 布局更新
        const repaint = this.layout && this.layout.update() || false;
        this.render();
        this.graphCanvasCtx.restore();
        // 交互更新
        this.modeManager.use(this.interactionMode).forEach(action => {
          action.onUpdate(this);
        });
        // 插件更新
        this.plugins.forEach(plugin => {
          plugin.enable && plugin.update();
        });
        this.repaint = repaint;
      }
      this.loop();
    });
  }

  /**
   * 渲染节点
   */
  private render() {

    if (this.renderType === 'CANVAS') {
      this.rootNode.getDescendantBF(node => {
        const nodeVisible = node.visible;
        // 节点连线渲染
        node.edges.forEach(edge => {
          if (edge.renderSign === this._animationFrameId) return;
          const targetNode = edge.targetNode;
          const sourceNode = edge.sourceNode;
          if (sourceNode === node) {
            if (node.depth > targetNode.depth || targetNode.renderSign === this._animationFrameId) {
              edge.render();
              edge.renderSign = this._animationFrameId;
            }
          } else {
            if (node.depth > sourceNode.depth || sourceNode.renderSign === this._animationFrameId) {
              edge.render();
              edge.renderSign = this._animationFrameId;
            }
          }
        });

        if (nodeVisible) {
          node.update();
        }
        node.renderSign = this._animationFrameId;
      });
      this.virtualNode.edges.forEach(edge => {
        edge.render();
      });
    } else {
      this.virtualNode.edges.forEach(edge => {
        edge.render(this.graphCanvasCtx);
      });
      this.rootNode.getDescendantBF(node => {
        if (node.visible) {
          node.mount();
          if (node.isUpdate) {
            node.update();
            node.isUpdate = false;
          }
        } else {
          node.unmount();
        }
        node.renderSign = this._animationFrameId;
      });
      this.rootNode.getDescendantDF(node => {
        node.edges.forEach(edge => {
          if (edge.renderSign === this._animationFrameId) return;
          edge.render(this.graphCanvasCtx);
          edge.renderSign = this._animationFrameId;
        });

        // 裁剪层级高的节点区域
        if (isRectNode(node) && node.visible) {
          const { x, y } = node.getPosition();
          const width = node.getWidth();
          const height = node.getHeight();
          this.graphCanvasCtx.beginPath();
          this.graphCanvasCtx.rect(0, 0, this.canvasWidth, this.canvasHeight);
          this.graphCanvasCtx.rect(x, y, width, height);
          this.graphCanvasCtx.clip('evenodd');
        }
      });
    }
  }
}

export default Canvas;
