"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var eventEmitter_1 = __importDefault(require("../events/eventEmitter"));
var Vector2d_1 = __importDefault(require("../utils/Vector2d"));
var utils_1 = require("../utils/utils");
var resize_observer_polyfill_1 = __importDefault(require("resize-observer-polyfill"));
var VirtualNode_1 = __importDefault(require("../graph/VirtualNode"));
var modes_1 = __importStar(require("../mode/modes"));
var Clock_1 = __importDefault(require("./Clock"));
var canvas_less_1 = __importDefault(require("./canvas.less"));
var nativeEvents = [
    'click',
    'dblclick',
    'mousedown',
    'wheel',
    'dragover',
    'drop',
    'contextmenu',
    'mouseenter'
];
var Canvas = (function () {
    function Canvas(options) {
        var _this = this;
        this.mounted = false;
        this._running = false;
        this._animationFrameId = 0;
        this.name = 'application';
        this.eventEmitter = new eventEmitter_1.default();
        this.nativeEvent = null;
        this.optimize = true;
        this.clock = new Clock_1.default();
        this.interactionMode = modes_1.MODE_DEFAULT;
        this.wrapper = document.createElement('div');
        this.graphCanvas = document.createElement('canvas');
        this.topCanvas = document.createElement('canvas');
        this.topCanvasMounted = false;
        this.virtualNode = new VirtualNode_1.default({});
        this.mousedownPosition = new Vector2d_1.default();
        this.mouseupPosition = new Vector2d_1.default();
        this.mousemovePosition = new Vector2d_1.default();
        this.viewWidth = 0;
        this.viewHeight = 0;
        this.canvasWidth = 0;
        this.canvasHeight = 0;
        this.repaint = false;
        this.animate = false;
        this.rootNode = new VirtualNode_1.default({
            id: 'rootNode'
        });
        this.plugins = [];
        this.layout = null;
        this.handleNativeEvent = function (event) {
            _this.nativeEvent = event;
            switch (event.type) {
                case 'mousedown':
                    {
                        var _a = event, clientX = _a.clientX, clientY = _a.clientY;
                        _this.mousedownPosition.x = clientX;
                        _this.mousedownPosition.y = clientY;
                        _this.getBoundingClientRect();
                        break;
                    }
                case 'mousemove':
                    {
                        var _b = event, clientY = _b.clientY, clientX = _b.clientX;
                        _this.mousemovePosition.x = clientX;
                        _this.mousemovePosition.y = clientY;
                        _this.optimizeNode();
                        break;
                    }
                case 'mouseup':
                    {
                        var _c = event, clientX = _c.clientX, clientY = _c.clientY;
                        _this.mouseupPosition.x = clientX;
                        _this.mouseupPosition.y = clientY;
                        break;
                    }
                case 'mouseenter':
                case 'drop':
                    _this.getBoundingClientRect();
                    break;
                case 'contextmenu':
                    event.preventDefault();
                    break;
            }
            _this.plugins.forEach(function (plugin) {
                plugin.handleEvent(event);
            });
            modes_1.default.use(_this.interactionMode).forEach(function (interaction) {
                interaction.handleEvent(_this, event);
            });
            _this.eventEmitter.emit(event.type, event);
        };
        this.container = options.container;
        this.wrapper.className = canvas_less_1.default.topology;
        this.graphCanvasCtx = this.graphCanvas.getContext('2d');
        this.topCanvasCtx = this.topCanvas.getContext('2d');
        this.canvasScale = options.scale || 1;
        this.maxScale = options.maxScale || 5;
        this.minScale = options.minScale || 0.1;
        this.animate = options.animate || false;
        this.renderType = options.renderType || 'DOM';
        this.rootNode.canvas = this;
        this.virtualNode.maxDepth = true;
        this.ro = new resize_observer_polyfill_1.default(function (entries, observer) {
            for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                var entry = entries_1[_i];
                var _a = entry.contentRect, width = _a.width, height = _a.height;
                _this.viewWidth = width;
                _this.viewHeight = height;
                _this.canvasWidth = width / _this.canvasScale;
                _this.canvasHeight = height / _this.canvasScale;
                _this.getBoundingClientRect();
            }
            _this.mount();
            _this.initCanvas();
            _this.optimizeNode();
            _this.repaint = true;
        });
        this.ro.observe(this.container);
        this.nativeEventInit();
        this.setMode(options.mode || modes_1.MODE_DEFAULT);
    }
    Canvas.registerMode = function (modeName, interactions) {
        modes_1.default.registerMode(modeName, interactions);
    };
    Object.defineProperty(Canvas.prototype, "stage", {
        get: function () {
            return this.rootNode;
        },
        enumerable: true,
        configurable: true
    });
    Canvas.prototype.setZoom = function (scale) {
        this.canvasScale = scale;
        this.canvasWidth = this.viewWidth / this.canvasScale;
        this.canvasHeight = this.viewHeight / this.canvasScale;
        this.initCanvas();
        this.optimizeNode();
        this.repaint = true;
    };
    Canvas.prototype.nativeEventInit = function () {
        var _this = this;
        nativeEvents.forEach(function (eventType) {
            _this.wrapper.addEventListener(eventType, _this.handleNativeEvent);
        });
        document.addEventListener('mousemove', this.handleNativeEvent);
        document.addEventListener('mouseup', this.handleNativeEvent);
    };
    Canvas.prototype.destroy = function () {
        var _this = this;
        nativeEvents.forEach(function (eventType) {
            _this.wrapper.removeEventListener(eventType, _this.handleNativeEvent);
        });
        document.removeEventListener('mousemove', this.handleNativeEvent);
        document.removeEventListener('mouseup', this.handleNativeEvent);
        this.ro.unobserve(this.container);
        this.ro.disconnect();
        this.eventEmitter.clear();
        this.unmount();
        this.removeAllNode();
        while (this.plugins.length) {
            var plugin = this.plugins.pop();
            if (plugin) {
                plugin.canvas = null;
                plugin.destroy();
            }
        }
    };
    Canvas.prototype.addNode = function (node) {
        if (this.rootNode.hasChild(node))
            return;
        node.visible = node.isInRect(this.canvasVisibleRect);
        this.rootNode.addChild(node);
        this.repaint = true;
    };
    Canvas.prototype.setNodeTop = function (node) {
        var parent = node.parent;
        if (!parent)
            return;
        var zIndex = parent.lastChild && parent.lastChild.zIndex || 0;
        node.zIndex = Math.max(zIndex, node.zIndex);
        parent.removeChild(node, false);
        parent.addChild(node);
        node.mount(true);
        node.getDescendantBF(function (child) {
            child.mount(true);
        });
        this.repaint = true;
    };
    Canvas.prototype.getActiveNodes = function () {
        return this.rootNode.getActiveDescendant();
    };
    Canvas.prototype.removeNode = function (node, destroy) {
        var _this = this;
        if (destroy === void 0) { destroy = true; }
        if (!this.rootNode.hasDescendant(node))
            return;
        if (!node.parent)
            return;
        node.parent.removeChild(node, destroy);
        var edges = __spreadArrays(node.edges);
        edges.forEach(function (edge) {
            _this.removeEdge(edge);
        });
        this.repaint = true;
    };
    Canvas.prototype.removeAllNode = function (destroy) {
        if (destroy === void 0) { destroy = true; }
        this.rootNode.removeAllChild(destroy);
    };
    Canvas.prototype.addEdge = function (edge) {
        edge.sourceNode.addEdge(edge);
        edge.targetNode.addEdge(edge);
        edge.canvas = this;
        this.repaint = true;
    };
    Canvas.prototype.removeEdge = function (edge) {
        edge.sourceNode.removeEdge(edge);
        edge.targetNode.removeEdge(edge);
        edge.canvas = undefined;
        this.repaint = true;
    };
    Canvas.prototype.getActiveEdges = function () {
        var activeEdges = [];
        var sign = Math.random();
        this.rootNode.getDescendantBF(function (node) {
            node.edges.forEach(function (edge) {
                if (edge.renderSign === sign)
                    return;
                edge.renderSign = sign;
                if (edge.active) {
                    activeEdges.push(edge);
                }
            });
        });
        return activeEdges;
    };
    Canvas.prototype.getBoundingClientRect = function () {
        this.containerClientRect = this.container.getBoundingClientRect();
        return this.containerClientRect;
    };
    Canvas.prototype.getContentBoundingRect = function () {
        var leftTop = new Vector2d_1.default(0, 0);
        var rightBottom = new Vector2d_1.default(this.canvasWidth, this.canvasHeight);
        this.rootNode.getDescendantBF(function (node) {
            var boundingRect = node.boundingRect;
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
        return [leftTop, new Vector2d_1.default(rightBottom.x, leftTop.y), rightBottom, new Vector2d_1.default(leftTop.x, rightBottom.y)];
    };
    Canvas.prototype.viewportToCanvasCoordinate = function (coordinate) {
        var _a = this.containerClientRect || this.getBoundingClientRect(), top = _a.top, left = _a.left;
        return coordinate.clone().substract(new Vector2d_1.default(left, top));
    };
    Canvas.prototype.canvasToViewportCoordinate = function (coordinate) {
        var _a = this.containerClientRect || this.getBoundingClientRect(), top = _a.top, left = _a.left;
        return coordinate.clone().add(new Vector2d_1.default(left, top));
    };
    Canvas.prototype.canvasToPixelCoordinate = function (coordinate) {
        return coordinate.clone().scale(1 / this.canvasScale);
    };
    Canvas.prototype.pixelToCanvasCoordinate = function (coordinate) {
        return coordinate.clone().scale(this.canvasScale);
    };
    Canvas.prototype.viewportToPixelCoordinate = function (coordinate) {
        return this.canvasToPixelCoordinate(this.viewportToCanvasCoordinate(coordinate));
    };
    Canvas.prototype.pixelToViewportCoordinate = function (coordinate) {
        return this.canvasToViewportCoordinate(this.pixelToCanvasCoordinate(coordinate));
    };
    Object.defineProperty(Canvas.prototype, "canvasVisibleRect", {
        get: function () {
            return [
                new Vector2d_1.default(0, 0),
                new Vector2d_1.default(this.canvasWidth, 0),
                new Vector2d_1.default(this.canvasWidth, this.canvasHeight),
                new Vector2d_1.default(0, this.canvasHeight)
            ];
        },
        enumerable: true,
        configurable: true
    });
    Canvas.prototype.zoomIn = function (focus) {
        focus = focus ? this.viewportToCanvasCoordinate(focus) : new Vector2d_1.default(this.viewWidth / 2, this.viewHeight / 2);
        var coordinate = this.canvasToPixelCoordinate(focus);
        this.canvasScale += 0.15;
        this.canvasScale = this.canvasScale > this.maxScale ? this.maxScale : this.canvasScale;
        var offset = this.canvasToPixelCoordinate(focus).substract(coordinate);
        this.canvasWidth = this.viewWidth / this.canvasScale;
        this.canvasHeight = this.viewHeight / this.canvasScale;
        this.rootNode.children.forEach(function (child) {
            child.translate(offset);
        });
        this.optimizeNode();
        this.initCanvas();
        this.repaint = true;
        this.eventEmitter.emit('canvas:zoom');
    };
    Canvas.prototype.zoomOut = function (focus) {
        focus = focus ? this.viewportToCanvasCoordinate(focus) : new Vector2d_1.default(this.viewWidth / 2, this.viewHeight / 2);
        var coordinate = this.canvasToPixelCoordinate(focus);
        this.canvasScale -= 0.15;
        this.canvasScale = this.canvasScale < this.minScale ? this.minScale : this.canvasScale;
        var offset = this.canvasToPixelCoordinate(focus).substract(coordinate);
        this.canvasWidth = this.viewWidth / this.canvasScale;
        this.canvasHeight = this.viewHeight / this.canvasScale;
        this.rootNode.children.forEach(function (child) {
            child.translate(offset);
        });
        this.optimizeNode();
        this.initCanvas();
        this.repaint = true;
        this.eventEmitter.emit('canvas:zoom');
    };
    Canvas.prototype.setMode = function (mode) {
        var _this = this;
        if (!modes_1.default.hasMode(mode)) {
            console.warn("\u8BE5\u6A21\u5F0F\u4E0D\u5B58\u5728:" + mode);
            return;
        }
        modes_1.default.use(this.interactionMode).forEach(function (action) {
            action.onUninstall(_this);
        });
        this.interactionMode = mode;
        modes_1.default.use(this.interactionMode).forEach(function (action) {
            action.onInstall(_this);
        });
    };
    Canvas.prototype.optimizeNode = function () {
        if (!this.optimize)
            return;
        var canvasRect = this.canvasVisibleRect;
        this.rootNode.getDescendantDF(function (node) {
            node.visible = node.isInRect(canvasRect);
        });
    };
    Canvas.prototype.use = function (plugin) {
        plugin.install(this);
        this.plugins.push(plugin);
    };
    Canvas.prototype.initCanvas = function () {
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
    };
    Canvas.prototype.mount = function () {
        if (this.mounted)
            return;
        this.wrapper.appendChild(this.graphCanvas);
        this.container.appendChild(this.wrapper);
        this.eventEmitter.emit('canvas:mounted');
        this.mounted = true;
    };
    Canvas.prototype.unmount = function () {
        if (!this.mounted)
            return;
        this.container.removeChild(this.wrapper);
        this.mounted = false;
    };
    Canvas.prototype.topCanvasMount = function () {
        if (this.topCanvasMounted)
            return;
        this.wrapper.appendChild(this.topCanvas);
        this.topCanvasMounted = true;
    };
    Canvas.prototype.topCanvasUnmount = function () {
        if (!this.topCanvasMounted)
            return;
        this.wrapper.removeChild(this.topCanvas);
        this.topCanvasMounted = false;
    };
    Canvas.prototype.start = function () {
        if (this._running)
            return;
        this._running = true;
        this.loop();
    };
    Canvas.prototype.stop = function () {
        if (!this._running)
            return;
        cancelAnimationFrame(this._animationFrameId);
        this._running = false;
    };
    Canvas.prototype.loop = function () {
        var _this = this;
        if (!this._running)
            return;
        this._animationFrameId = requestAnimationFrame(function () {
            _this.clock.update();
            if (_this.repaint || _this.animate) {
                _this.graphCanvasCtx.clearRect(0, 0, _this.viewWidth, _this.viewHeight);
                _this.graphCanvasCtx.save();
                _this.graphCanvasCtx.scale(_this.canvasScale, _this.canvasScale);
                var repaint = _this.layout && _this.layout.update() || false;
                _this.render();
                _this.graphCanvasCtx.restore();
                modes_1.default.use(_this.interactionMode).forEach(function (action) {
                    action.onUpdate(_this);
                });
                _this.plugins.forEach(function (plugin) {
                    plugin.enable && plugin.update();
                });
                _this.repaint = repaint;
            }
            _this.loop();
        });
    };
    Canvas.prototype.render = function () {
        var _this = this;
        if (this.renderType === 'CANVAS') {
            this.rootNode.getDescendantBF(function (node) {
                var nodeVisible = node.visible;
                node.edges.forEach(function (edge) {
                    if (edge.renderSign === _this._animationFrameId)
                        return;
                    var targetNode = edge.targetNode;
                    var sourceNode = edge.sourceNode;
                    if (sourceNode === node) {
                        if (node.depth > targetNode.depth || targetNode.renderSign === _this._animationFrameId) {
                            edge.render();
                            edge.renderSign = _this._animationFrameId;
                        }
                    }
                    else {
                        if (node.depth > sourceNode.depth || sourceNode.renderSign === _this._animationFrameId) {
                            edge.render();
                            edge.renderSign = _this._animationFrameId;
                        }
                    }
                });
                if (nodeVisible) {
                    node.update();
                }
                node.renderSign = _this._animationFrameId;
            });
            this.virtualNode.edges.forEach(function (edge) {
                edge.render();
            });
        }
        else {
            this.virtualNode.edges.forEach(function (edge) {
                edge.render(_this.graphCanvasCtx);
            });
            this.rootNode.getDescendantBF(function (node) {
                if (node.visible) {
                    node.mount();
                    if (node.isUpdate) {
                        node.update();
                        node.isUpdate = false;
                    }
                }
                else {
                    node.unmount();
                }
                node.renderSign = _this._animationFrameId;
            });
            this.rootNode.getDescendantDF(function (node) {
                node.edges.forEach(function (edge) {
                    if (edge.renderSign === _this._animationFrameId)
                        return;
                    edge.render(_this.graphCanvasCtx);
                    edge.renderSign = _this._animationFrameId;
                });
                if (utils_1.isRectNode(node) && node.visible) {
                    var _a = node.getPosition(), x = _a.x, y = _a.y;
                    var width = node.getWidth();
                    var height = node.getHeight();
                    _this.graphCanvasCtx.beginPath();
                    _this.graphCanvasCtx.rect(0, 0, _this.canvasWidth, _this.canvasHeight);
                    _this.graphCanvasCtx.rect(x, y, width, height);
                    _this.graphCanvasCtx.clip('evenodd');
                }
            });
        }
    };
    return Canvas;
}());
exports.Canvas = Canvas;
exports.default = Canvas;
