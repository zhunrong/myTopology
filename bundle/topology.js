var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define("events/eventEmitter", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EventEmitter = /** @class */ (function () {
        function EventEmitter() {
            this.events = {};
        }
        /**
         * 监听事件
         * @param eventName
         * @param listener
         */
        EventEmitter.prototype.on = function (eventName, listener) {
            this.events[eventName] = this.events[eventName] || [];
            this.events[eventName].push(listener);
        };
        /**
         * 移除监听回调
         * @param eventName
         * @param listener
         */
        EventEmitter.prototype.off = function (eventName, listener) {
            if (!this.events[eventName])
                return;
            var index = this.events[eventName].findIndex(function (item) { return item === listener; });
            this.events[eventName].splice(index, 1);
        };
        /**
         * 激发事件
         * @param eventName
         * @param params
         */
        EventEmitter.prototype.emit = function (eventName, params) {
            if (this.events[eventName]) {
                this.events[eventName].forEach(function (listener) {
                    listener(params);
                });
            }
        };
        /**
         * 清除所有事件
         */
        EventEmitter.prototype.clear = function () {
            var _this = this;
            Object.keys(this.events).forEach(function (key) {
                delete _this.events[key];
            });
        };
        return EventEmitter;
    }());
    exports.EventEmitter = EventEmitter;
    exports.default = EventEmitter;
});
define("utils/Vector2d", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Vector2d = /** @class */ (function () {
        function Vector2d(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Vector2d.copy = function (target) {
            return target.clone();
        };
        Object.defineProperty(Vector2d.prototype, "magnitude", {
            get: function () {
                return this.getMagnitude();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 取模
         */
        Vector2d.prototype.getMagnitude = function () {
            if (this.x === 0 && this.y === 0) {
                return 0.000000001;
            }
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };
        /**
         * 矢量加
         * @param target
         */
        Vector2d.prototype.add = function (target) {
            this.x += target.x;
            this.y += target.y;
            return this;
        };
        /**
         * 矢量减
         * @param target
         */
        Vector2d.prototype.substract = function (target) {
            this.x -= target.x;
            this.y -= target.y;
            return this;
        };
        /**
         * 点积
         * @param target
         */
        Vector2d.prototype.dotProduct = function (target) {
            return this.x * target.x + this.y * target.y;
        };
        /**
         * 叉积
         * @param target
         */
        Vector2d.prototype.crossProduct = function (target) {
            return this.x * target.y - this.y * target.x;
        };
        /**
         * 与标量的积
         * @param scalar
         */
        Vector2d.prototype.scale = function (scalar) {
            this.x *= scalar;
            this.y *= scalar;
            return this;
        };
        /**
         * 求边缘向量,返回新向量
         */
        Vector2d.prototype.edge = function (target) {
            return this.clone().substract(target);
        };
        /**
         * 求正交向量,返回新向量
         */
        Vector2d.prototype.perpendicular = function () {
            return new Vector2d(this.y, -this.x);
        };
        /**
         * 求单位向量,返回新向量
         */
        Vector2d.prototype.normalize = function () {
            var magnitude = this.getMagnitude();
            return new Vector2d(this.x / magnitude, this.y / magnitude);
        };
        /**
         * 求法向量,返回新向量
         */
        Vector2d.prototype.normal = function () {
            return this.perpendicular().normalize();
        };
        /**
         * 求与目标向量的夹角余弦值
         * @param target
         */
        Vector2d.prototype.cosAngle = function (target) {
            return this.dotProduct(target) / (this.magnitude * target.magnitude);
        };
        /**
         * 求与目标向量的夹角 弧度值
         * @param target
         */
        Vector2d.prototype.angle = function (target) {
            return Math.acos(this.cosAngle(target));
        };
        /**
         * 与x轴夹角(顺时针为正) [-Math.PI,Math.PI]
         */
        Vector2d.prototype.xAxisAngle = function () {
            var angle = this.angle(Vector2d.xAxis);
            return this.y > 0 ? angle : -angle;
        };
        /**
         * 对向量进行旋转(参数为弧度值)
         * @param deg
         */
        Vector2d.prototype.rotate = function (deg) {
            var _a = this, x = _a.x, y = _a.y;
            this.x = x * Math.cos(deg) - y * Math.sin(deg);
            this.y = x * Math.sin(deg) + y * Math.cos(deg);
            return this;
        };
        /**
         * 在目标向量上的投影,返回新向量
         * @param target
         */
        Vector2d.prototype.project = function (target) {
            var magnitude = this.dotProduct(target) / target.magnitude;
            return target.normalize().scale(magnitude);
        };
        /**
         * 是否与目标向量相等
         * @param target
         */
        Vector2d.prototype.equal = function (target) {
            return this.x === target.x && this.y === target.y;
        };
        /**
         * 与目标向量的距离
         * @param target
         */
        Vector2d.prototype.distance = function (target) {
            return this.edge(target).magnitude;
        };
        /**
         * 复制目标向量
         * @param target
         */
        Vector2d.prototype.copy = function (target) {
            this.x = target.x;
            this.y = target.y;
            return this;
        };
        /**
         * 克隆,复制当前向量返回新的向量
         */
        Vector2d.prototype.clone = function () {
            return new Vector2d(this.x, this.y);
        };
        Vector2d.xAxis = new Vector2d(1, 0);
        Vector2d.yAxis = new Vector2d(0, 1);
        return Vector2d;
    }());
    exports.Vector2d = Vector2d;
    exports.default = Vector2d;
});
define("graph/Graph", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var graphId = 1;
    var Graph = /** @class */ (function () {
        function Graph(options) {
            this.active = false;
            // 是否更新
            this.isUpdate = true;
            // 图元id
            this.graphId = graphId++;
            /**
             * 用户数据
             */
            this.data = null;
            /**
             * 样式属性
             */
            this.style = {
                color: '#29c1f8',
                activeColor: '#e96160',
                lineWidth: 2
            };
            this._visible = options.visible || true;
            this._text = options.text || '';
            this.zIndex = options.zIndex || 0;
            this.data = options.data;
        }
        Object.defineProperty(Graph.prototype, "visible", {
            /**
             * 可见性
             */
            get: function () {
                return this._visible;
            },
            set: function (visible) {
                this._visible = visible;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Graph.prototype, "text", {
            /**
             * 文本
             */
            get: function () {
                return this._text;
            },
            set: function (value) {
                this._text = value;
                if (this.canvas) {
                    this.canvas.repaint = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Graph.prototype, "miniMapVisible", {
            /**
             * 在鹰眼地图上是否可见
             */
            get: function () {
                return this.visible;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 是否在一个矩形内
         * @param points
         */
        Graph.prototype.isInRect = function (points) {
            return false;
        };
        /**
         * 是否被指定矩形包围
         * @param rect
         */
        Graph.prototype.isWrappedInRect = function (rect) { return false; };
        /**
         * 是否被指定圆包围
         */
        Graph.prototype.isWrappedInCircle = function () { return false; };
        /**
         * hook:渲染时调用
         */
        Graph.prototype.render = function (ctx) { };
        /**
         * hook:更新时调用
         */
        Graph.prototype.update = function (ctx) { };
        /**
         * hook:销毁时调用
         */
        Graph.prototype.destroy = function () { };
        /**
         * hook:销毁前调用
         */
        Graph.prototype.beforeDestroy = function () { };
        /**
         * 导出配置json
         */
        Graph.prototype.exportJson = function () { };
        return Graph;
    }());
    exports.Graph = Graph;
    exports.default = Graph;
});
define("graph/Node", ["require", "exports", "graph/Graph", "utils/Vector2d"], function (require, exports, Graph_1, Vector2d_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Graph_1 = __importDefault(Graph_1);
    Vector2d_1 = __importDefault(Vector2d_1);
    var Node = /** @class */ (function (_super) {
        __extends(Node, _super);
        function Node(options) {
            var _this = _super.call(this, options) || this;
            /**
             * 是否已挂载(只对DOM节点有效)
             */
            _this.mounted = false;
            /**
             * 是否为组
             */
            _this.isGroup = false;
            /**
             * 是否展开
             */
            _this.isExpanded = true;
            /**
             * 是否可以调节尺寸
             */
            _this.canResize = false;
            /**
             * 子节点
             */
            _this.children = [];
            /**
             * 相关的边线
             */
            _this.edges = [];
            _this.position = new Vector2d_1.default(options.x, options.y);
            _this.id = options.id;
            return _this;
        }
        /**
         * 获取位置
         */
        Node.prototype.getPosition = function () {
            return this.position;
        };
        Object.defineProperty(Node.prototype, "visible", {
            get: function () {
                if (!this._visible)
                    return false;
                if (this.parent && (!this.parent.visible || !this.parent.isExpanded))
                    return false;
                return true;
            },
            set: function (visible) {
                this._visible = visible;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Node.prototype, "miniMapVisible", {
            get: function () {
                if (this.parent && (!this.parent.miniMapVisible || !this.parent.isExpanded))
                    return false;
                return true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Node.prototype, "text", {
            get: function () {
                return this._text;
            },
            set: function (value) {
                this._text = value;
                this.render();
                if (this.canvas) {
                    this.canvas.repaint = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 将节点以及其子元素位置偏移
         * @param offset
         */
        Node.prototype.translate = function (offset) {
            this.position.add(offset);
            this.isUpdate = true;
            this.children.forEach(function (child) {
                child.translate(offset);
            });
        };
        /**
         * 添加边线
         * @param edge
         */
        Node.prototype.addEdge = function (edge) {
            if (this.edges.find(function (item) { return item === edge; }))
                return;
            this.edges.push(edge);
        };
        /**
         * 删除边线
         * @param edge
         */
        Node.prototype.removeEdge = function (edge) {
            var index = this.edges.findIndex(function (item) { return item === edge; });
            if (index > -1) {
                this.edges.splice(index, 1);
            }
        };
        /**
         * 添加子节点，按zIndex升序排序
         * @param child
         */
        Node.prototype.addChild = function (child) {
            // fix: 禁止将祖先节点添加为子节点，否则会造成引用死循环
            if (child.hasDescendant(this))
                return;
            if (this.hasChild(child))
                return;
            var index = this.children.length - 1;
            var current = this.children[index];
            while (current) {
                if (current.zIndex <= child.zIndex) {
                    return this.addChildAt(child, index + 1);
                }
                index--;
                current = this.children[index];
            }
            return this.addChildAt(child, 0);
        };
        /**
         * 在指定位置追加子节点
         * @param child
         * @param index
         */
        Node.prototype.addChildAt = function (child, index) {
            var _this = this;
            if (index >= 0 && index <= this.children.length) {
                if (child.parent) {
                    child.parent.removeChild(child, false);
                }
                child.parent = this;
                this.children.splice(index, 0, child);
                if (this.canvas) {
                    child.canvas = this.canvas;
                    //
                    child.render();
                    child.getDescendantBF(function (node) {
                        node.canvas = _this.canvas;
                        //
                        node.render();
                    });
                }
                return child;
            }
            else {
                return undefined;
            }
        };
        /**
         * 删除并且销毁子节点
         * @param child
         * @param destroy 是否销毁
         */
        Node.prototype.removeChild = function (child, destroy) {
            if (destroy === void 0) { destroy = true; }
            var index = this.children.findIndex(function (node) { return node === child; });
            if (index === -1)
                return false;
            destroy && child.destroy();
            child.canvas = undefined;
            this.children.splice(index, 1);
            return true;
        };
        /**
         * 删除所有子节点
         * @param destroy 是否销毁
         */
        Node.prototype.removeAllChild = function (destroy) {
            var _this = this;
            if (destroy === void 0) { destroy = true; }
            var children = __spreadArrays(this.children);
            children.forEach(function (child) {
                _this.removeChild(child, destroy);
            });
        };
        /**
         * 判断是否为子节点
         * @param child
         */
        Node.prototype.hasChild = function (child) {
            return !!this.children.find(function (item) { return item === child; });
        };
        /**
         * 判断是否为子孙节点
         * @param descendant
         */
        Node.prototype.hasDescendant = function (descendant) {
            var result = false;
            this.getDescendantBF(function (node) {
                if (node === descendant) {
                    return result = true;
                }
            });
            return result;
        };
        /**
         * 判断是否有激活的祖先节点
         */
        Node.prototype.hasActiveAncestor = function () {
            return !!this.parent && (this.parent.active || this.parent.hasActiveAncestor());
        };
        /**
         * 获取激活状态的子节点列表
         */
        Node.prototype.getActiveChild = function () {
            return this.children.filter(function (child) { return child.active; });
        };
        /**
         * 获取激活状态的子孙节点列表
         */
        Node.prototype.getActiveDescendant = function () {
            var nodes = [];
            this.getDescendantBF(function (node) {
                if (node.active) {
                    nodes.push(node);
                }
            });
            return nodes;
        };
        /**
         * 遍历子孙节点，深度优先
         * 遍历顺序：1.深度优先
         *          2.从右到左
         *          3.从下到上
         * 场景：鼠标点击判定顺序
         * @param handler
         */
        Node.prototype.getDescendantDF = function (handler) {
            var breakFlag = false;
            var descendants = [];
            function getDescendantDF(handler) {
                for (var i = this.children.length - 1; i >= 0; i--) {
                    var current = this.children[i];
                    getDescendantDF.call(current, handler);
                    if (breakFlag)
                        return descendants;
                    descendants.push(current);
                    if (handler && handler(current)) {
                        breakFlag = true;
                        return descendants;
                    }
                }
                return descendants;
            }
            return getDescendantDF.call(this, handler);
        };
        /**
         * 遍历子孙节点，广度优先
         * 遍历顺序：1.广度优先
         *          2.从左到右
         *          3.从上到下
         * 场景：节点渲染顺序
         * @param handler
         */
        Node.prototype.getDescendantBF = function (handler) {
            var descendants = [];
            var queue = __spreadArrays(this.children);
            while (queue.length) {
                var first = queue.shift();
                descendants.push(first);
                queue.push.apply(queue, first.children);
                if (handler && handler(first)) {
                    break;
                }
            }
            return descendants;
        };
        Object.defineProperty(Node.prototype, "root", {
            /**
             * 获取根节点
             */
            get: function () {
                return this.parent ? this.parent.root : this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Node.prototype, "depth", {
            /**
             * 获取节点深度
             */
            get: function () {
                return this.parent ? this.parent.depth + 1 : 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Node.prototype, "firstChild", {
            /**
             * 获取第一个子节点
             */
            get: function () {
                return this.children[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Node.prototype, "lastChild", {
            /**
             * 获取最后一个子节点
             */
            get: function () {
                return this.children[this.children.length - 1];
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 挂载（只对DOM节点有效）
         */
        Node.prototype.mount = function (force) {
            if (force === void 0) { force = false; }
        };
        /**
         * 卸载（只对DOM节点有效）
         */
        Node.prototype.unmount = function () { };
        Node.prototype.destroy = function () {
            this.removeAllChild();
            this.beforeDestroy();
            this.unmount();
        };
        return Node;
    }(Graph_1.default));
    exports.Node = Node;
    exports.default = Node;
});
define("graph/Edge", ["require", "exports", "graph/Graph"], function (require, exports, Graph_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Graph_2 = __importDefault(Graph_2);
    var Edge = /** @class */ (function (_super) {
        __extends(Edge, _super);
        function Edge(options) {
            var _this = _super.call(this, options) || this;
            _this.renderType = 'CANVAS';
            _this.targetNode = options.targetNode;
            _this.sourceNode = options.sourceNode;
            return _this;
        }
        /**
         * 获取目标节点
         */
        Edge.prototype.getTargetNode = function () {
            var parent = this.targetNode.parent;
            var isAllExpanded = true;
            while (parent) {
                if (!parent.isExpanded) {
                    isAllExpanded = false;
                }
                parent = parent.parent;
            }
            if (isAllExpanded) {
                return this.targetNode;
            }
            else {
                var node = this.targetNode;
                while (!node.visible && node.parent && node.parent.renderType !== 'NONE') {
                    node = node.parent;
                }
                return node;
            }
        };
        /**
         * 获取源节点
         */
        Edge.prototype.getSourceNode = function () {
            var parent = this.sourceNode.parent;
            var isAllExpanded = true;
            while (parent) {
                if (!parent.isExpanded) {
                    isAllExpanded = false;
                }
                parent = parent.parent;
            }
            if (isAllExpanded) {
                return this.sourceNode;
            }
            else {
                var node = this.sourceNode;
                while (!node.visible && node.parent && node.parent.renderType !== 'NONE') {
                    node = node.parent;
                }
                return node;
            }
        };
        return Edge;
    }(Graph_2.default));
    exports.Edge = Edge;
    exports.default = Edge;
});
define("utils/Math2d", ["require", "exports", "utils/Vector2d"], function (require, exports, Vector2d_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Vector2d_2 = __importDefault(Vector2d_2);
    var Math2d = /** @class */ (function () {
        function Math2d() {
        }
        /**
         * 判断点是否在矩形内
         * @param P
         * @param rectPosition
         * @param width
         * @param height
         */
        Math2d.isPointInRect = function (P, rectPosition, width, height) {
            if (P.x < rectPosition.x)
                return false;
            if (P.y < rectPosition.y)
                return false;
            if (P.x > rectPosition.x + width)
                return false;
            if (P.y > rectPosition.y + height)
                return false;
            return true;
        };
        /**
         * 判断点是否在圆内
         * @param P
         * @param C
         * @param radius
         */
        Math2d.isPointInCircle = function (P, C, radius) {
            return Vector2d_2.default.copy(C).substract(P).magnitude <= radius;
        };
        /**
         * 判断点是否在三角形内
         * @param point
         * @param v0
         * @param v1
         * @param v2
         */
        Math2d.isPointInTriangle = function (P, A, B, C) {
            var PA = Vector2d_2.default.copy(A).substract(P);
            var PB = Vector2d_2.default.copy(B).substract(P);
            var PC = Vector2d_2.default.copy(C).substract(P);
            var b1 = PA.crossProduct(PB) < 0;
            var b2 = PB.crossProduct(PC) < 0;
            var b3 = PC.crossProduct(PA) < 0;
            return b1 === b2 && b2 === b3;
        };
        /**
         * 判断点是否在多边形内
         * @param P
         * @param points
         */
        Math2d.isPointInPolygon = function (P, points) {
            if (points.length < 3)
                return false;
            for (var i = 2; i < points.length; i++) {
                if (Math2d.isPointInTriangle(P, points[0], points[i - 1], points[i]))
                    return true;
            }
            return false;
        };
        /**
         * 判断点是否在线段上
         * @param P
         * @param lineSegment
         * @param deviation 计算偏差 最小为0
         */
        Math2d.isPointInLineSegment = function (P, lineSegment, deviation) {
            if (deviation === void 0) { deviation = 0.01; }
            var A = lineSegment[0];
            var B = lineSegment[1];
            var AP = Vector2d_2.default.copy(P).substract(A);
            var BP = Vector2d_2.default.copy(P).substract(B);
            var BA = Vector2d_2.default.copy(A).substract(B);
            if (AP.magnitude + BP.magnitude - BA.magnitude < deviation) {
                return true;
            }
            return false;
        };
        /**
         * 判断点是否在多线段上
         * @param P
         * @param polyline
         * @param deviation
         */
        Math2d.isPointInPolyline = function (P, polyline, deviation) {
            if (deviation === void 0) { deviation = 0.01; }
            var length = polyline.length;
            if (length < 2)
                return false;
            for (var i = 1; i < length; i++) {
                if (Math2d.isPointInLineSegment(P, [polyline[i - 1], polyline[i]], deviation))
                    return true;
            }
            return false;
        };
        /**
         * 判断两条线是否相交
         * @param line1
         * @param line2
         */
        Math2d.isIntersect = function (line1, line2) {
            var A = line1[0];
            var B = line1[1];
            var C = line2[0];
            var D = line2[1];
            if (Math2d.isPointInLineSegment(A, line2))
                return true;
            if (Math2d.isPointInLineSegment(B, line2))
                return true;
            if (Math2d.isPointInLineSegment(C, line1))
                return true;
            if (Math2d.isPointInLineSegment(D, line1))
                return true;
            var AC = Vector2d_2.default.copy(C).substract(A);
            var AD = Vector2d_2.default.copy(D).substract(A);
            var BC = Vector2d_2.default.copy(C).substract(B);
            var BD = Vector2d_2.default.copy(D).substract(B);
            var b1 = AC.crossProduct(AD) < 0;
            var b2 = BC.crossProduct(BD) < 0;
            if (b1 === b2)
                return false;
            var CA = Vector2d_2.default.copy(A).substract(C);
            var CB = Vector2d_2.default.copy(B).substract(C);
            var DA = Vector2d_2.default.copy(A).substract(D);
            var DB = Vector2d_2.default.copy(B).substract(D);
            var b3 = CA.crossProduct(CB) < 0;
            var b4 = DA.crossProduct(DB) < 0;
            if (b3 === b4)
                return false;
            return true;
        };
        /**
         * 获取两条相交线段的交点
         * @param line1
         * @param line2
         */
        Math2d.getLineIntersect = function (line1, line2) {
            var A = line1[0];
            var B = line1[1];
            var C = line2[0];
            var D = line2[1];
            var AB = Vector2d_2.default.copy(B).substract(A);
            var CD = Vector2d_2.default.copy(D).substract(C);
            var perpendicular = CD.perpendicular();
            // C,A,B 在perpendicular的投影  a----c----->b
            var c = C.project(perpendicular);
            var a = A.project(perpendicular);
            var b = B.project(perpendicular);
            var ac = Vector2d_2.default.copy(c).substract(a);
            var cb = Vector2d_2.default.copy(b).substract(c);
            // 设交点P,则AP的模
            var magnitude = AB.magnitude * ac.magnitude / (ac.magnitude + cb.magnitude);
            var AP = AB.normalize().scale(magnitude);
            return AP.add(A);
        };
        /**
         * 根据ratio,获取线段上点的坐标,起点为0,终点为1
         * @param line
         * @param ratio
         */
        Math2d.getLinePoint = function (line, ratio) {
            var len = line.length;
            if (len < 2)
                return null;
            if (ratio > 1)
                ratio = 1;
            if (ratio < 0)
                ratio = 0;
            var length = Math2d.getPolyLineLength(line) * ratio;
            var sum = 0;
            for (var i = 1; i < len; i++) {
                sum += line[i].distance(line[i - 1]);
                if (sum >= length) {
                    var diff = sum - length;
                    return Vector2d_2.default.copy(line[i]).add(Vector2d_2.default.copy(line[i - 1]).substract(line[i]).normalize().scale(diff));
                }
            }
            return new Vector2d_2.default(0, 0);
        };
        /**
         * 获取多线段的长度
         * @param line
         */
        Math2d.getPolyLineLength = function (line) {
            var length = line.length;
            if (length < 2)
                return 0;
            var sum = 0;
            for (var i = 1; i < length; i++) {
                sum += line[i].distance(line[i - 1]);
            }
            return sum;
        };
        return Math2d;
    }());
    exports.Math2d = Math2d;
    // let count = 10000
    // const before = Date.now()
    // const p = new Vector2d(-10, 10)
    // const a = new Vector2d(10, 10)
    // const b = new Vector2d(-10, -10)
    // const c = new Vector2d(10, -10)
    // while (count--) {
    //   Math2d.getLineIntersect([p, c], [a, b])
    // }
    // console.log(Date.now() - before)
    exports.default = Math2d;
});
define("graph/RectNode", ["require", "exports", "graph/Node", "utils/Vector2d", "utils/Math2d"], function (require, exports, Node_1, Vector2d_3, Math2d_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Node_1 = __importDefault(Node_1);
    Vector2d_3 = __importDefault(Vector2d_3);
    Math2d_1 = __importDefault(Math2d_1);
    var RectNode = /** @class */ (function (_super) {
        __extends(RectNode, _super);
        function RectNode(options) {
            var _this = _super.call(this, options) || this;
            _this.shapeType = 'rect';
            /**
             * 折叠宽度
             */
            _this.collapseWidth = 50;
            /**
             * 折叠高度
             */
            _this.collapseHeight = 50;
            _this.width = options.width || 100;
            _this.height = options.height || 100;
            _this.minWidth = options.minWidth || 30;
            _this.minHeight = options.minHeight || 30;
            return _this;
        }
        Object.defineProperty(RectNode.prototype, "vertexes", {
            get: function () {
                return this.getBoundingRect();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RectNode.prototype, "boundingRect", {
            get: function () {
                return this.getBoundingRect();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RectNode.prototype, "boundingJoinPoints", {
            get: function () {
                return this.getBoundingJoinPoints();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RectNode.prototype, "centerPoint", {
            get: function () {
                return this.getCenterPoint();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RectNode.prototype, "circumradius", {
            get: function () {
                var width = this.getWidth();
                var height = this.getHeight();
                return Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 获取实际位置
         */
        RectNode.prototype.getPosition = function () {
            if /* 展开状态 */ (this.isExpanded) {
                return this.position;
            } /* 折叠状态 */
            else {
                var _a = this.position, x = _a.x, y = _a.y;
                return new Vector2d_3.default(x + (this.width - this.collapseWidth) / 2, y + (this.height - this.collapseHeight) / 2);
            }
        };
        /**
         * 获取计算宽度
         */
        RectNode.prototype.getWidth = function () {
            return this.isExpanded ? this.width : this.collapseWidth;
        };
        /**
         * 获取计算高度
         */
        RectNode.prototype.getHeight = function () {
            return this.isExpanded ? this.height : this.collapseHeight;
        };
        RectNode.prototype.isPointIn = function () {
            var canvas = this.canvas;
            if (!canvas)
                return false;
            if (!this.visible)
                return false;
            if (!canvas.nativeEvent)
                return false;
            var event = canvas.nativeEvent;
            var point = canvas.viewportToPixelCoordinate(new Vector2d_3.default(event.clientX, event.clientY));
            return Math2d_1.default.isPointInRect(point, this.getPosition(), this.getWidth(), this.getHeight());
        };
        Object.defineProperty(RectNode.prototype, "joinPoint", {
            get: function () {
                var _a = this.getPosition(), x = _a.x, y = _a.y;
                return new Vector2d_3.default(x + this.getWidth() / 2, y + this.getHeight() / 2);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 边界矩形坐标数组
         */
        RectNode.prototype.getBoundingRect = function () {
            var width = this.getWidth();
            var height = this.getHeight();
            var _a = this.getPosition(), x = _a.x, y = _a.y;
            return [
                new Vector2d_3.default(x, y),
                new Vector2d_3.default(x + width, y),
                new Vector2d_3.default(x + width, y + height),
                new Vector2d_3.default(x, y + height)
            ];
        };
        /**
         * 边界矩形上的连接点坐标数组
         */
        RectNode.prototype.getBoundingJoinPoints = function () {
            var width = this.getWidth();
            var height = this.getHeight();
            var _a = this.getPosition(), x = _a.x, y = _a.y;
            return [
                new Vector2d_3.default(x + width / 2, y),
                new Vector2d_3.default(x + width, y + height / 2),
                new Vector2d_3.default(x + width / 2, y + height),
                new Vector2d_3.default(x, y + height / 2)
            ];
        };
        /**
         * 几何中点坐标
         */
        RectNode.prototype.getCenterPoint = function () {
            var width = this.getWidth();
            var height = this.getHeight();
            var _a = this.getPosition(), x = _a.x, y = _a.y;
            return new Vector2d_3.default(x + width / 2, y + height / 2);
        };
        /**
         * 是否在矩形中
         * @param points
         */
        RectNode.prototype.isInRect = function (points) {
            var vertexes = this.getBoundingRect();
            // 左
            if (points[0].x > vertexes[2].x)
                return false;
            // 右
            if (points[2].x < vertexes[0].x)
                return false;
            // 上
            if (points[0].y > vertexes[2].y)
                return false;
            // 下
            if (points[2].y < vertexes[0].y)
                return false;
            return true;
        };
        /**
         * 是否包含于某矩形
         * @param rect
         */
        RectNode.prototype.isWrappedInRect = function (rect) {
            var vertexes = this.getBoundingRect();
            return rect[0].x <= vertexes[0].x && rect[0].y <= vertexes[0].y && rect[2].x >= vertexes[2].x && rect[2].y >= vertexes[2].y;
        };
        RectNode.prototype.drawThumbnail = function (ctx) {
            var _a = this.getPosition(), x = _a.x, y = _a.y;
            var width = this.getWidth();
            var height = this.getHeight();
            ctx.save();
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.fillStyle = this.active ? this.style.activeColor : this.style.color;
            ctx.fill();
            ctx.restore();
        };
        return RectNode;
    }(Node_1.default));
    exports.RectNode = RectNode;
    exports.default = RectNode;
});
define("graph/CircleNode", ["require", "exports", "graph/Node", "utils/Vector2d", "utils/Math2d"], function (require, exports, Node_2, Vector2d_4, Math2d_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Node_2 = __importDefault(Node_2);
    Vector2d_4 = __importDefault(Vector2d_4);
    Math2d_2 = __importDefault(Math2d_2);
    var CircleNode = /** @class */ (function (_super) {
        __extends(CircleNode, _super);
        function CircleNode(options) {
            var _this = _super.call(this, options) || this;
            _this.shapeType = 'circle';
            _this.radius = options.radius || 50;
            _this.minRadius = options.minRadius || 30;
            _this.text = options.text || '';
            return _this;
        }
        Object.defineProperty(CircleNode.prototype, "boundingJoinPoints", {
            get: function () {
                return this.getBoundingJoinPoints();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CircleNode.prototype, "boundingRect", {
            get: function () {
                return this.getBoundingRect();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CircleNode.prototype, "centerPoint", {
            get: function () {
                return this.getCenterPoint();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CircleNode.prototype, "vertexes", {
            get: function () {
                return this.getBoundingRect();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CircleNode.prototype, "circumradius", {
            get: function () {
                return this.radius;
            },
            enumerable: true,
            configurable: true
        });
        CircleNode.prototype.isPointIn = function () {
            var _a = this, canvas = _a.canvas, centerPoint = _a.centerPoint, radius = _a.radius;
            if (!canvas)
                return false;
            if (!this.visible)
                return false;
            if (!canvas.nativeEvent)
                return false;
            var event = canvas.nativeEvent;
            var point = canvas.viewportToPixelCoordinate(new Vector2d_4.default(event.clientX, event.clientY));
            return Math2d_2.default.isPointInCircle(point, centerPoint, radius);
        };
        /**
         * 边界矩形坐标数组
         */
        CircleNode.prototype.getBoundingRect = function () {
            var _a = this, radius = _a.radius, _b = _a.position, x = _b.x, y = _b.y;
            var diameter = 2 * radius;
            return [
                new Vector2d_4.default(x, y),
                new Vector2d_4.default(x + diameter, y),
                new Vector2d_4.default(x + diameter, y + diameter),
                new Vector2d_4.default(x, y + diameter)
            ];
        };
        /**
         * 边界矩形上的连接点坐标数组
         */
        CircleNode.prototype.getBoundingJoinPoints = function () {
            var _a = this, radius = _a.radius, _b = _a.position, x = _b.x, y = _b.y;
            var diameter = 2 * radius;
            return [
                new Vector2d_4.default(x + radius, y),
                new Vector2d_4.default(x + diameter, y + radius),
                new Vector2d_4.default(x + radius, y + diameter),
                new Vector2d_4.default(x, y + radius)
            ];
        };
        /**
         * 几何中点坐标
         */
        CircleNode.prototype.getCenterPoint = function () {
            var _a = this, _b = _a.position, x = _b.x, y = _b.y, radius = _a.radius;
            return new Vector2d_4.default(x + radius, y + radius);
        };
        /**
         * 是否相交于某矩形
         * @param points
         */
        CircleNode.prototype.isInRect = function (points) {
            var vertexes = this.getBoundingRect();
            // 左
            if (points[0].x > vertexes[2].x)
                return false;
            // 右
            if (points[2].x < vertexes[0].x)
                return false;
            // 上
            if (points[0].y > vertexes[2].y)
                return false;
            // 下
            if (points[2].y < vertexes[0].y)
                return false;
            return true;
        };
        /**
         * 是否包含于某矩形
         * @param rect
         */
        CircleNode.prototype.isWrappedInRect = function (rect) {
            var vertexes = this.getBoundingRect();
            return rect[0].x <= vertexes[0].x && rect[0].y <= vertexes[0].y && rect[2].x >= vertexes[2].x && rect[2].y >= vertexes[2].y;
        };
        CircleNode.prototype.drawThumbnail = function (ctx) {
            var _a = this.centerPoint, x = _a.x, y = _a.y;
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.active ? this.style.activeColor : this.style.color;
            ctx.fill();
            ctx.restore();
        };
        return CircleNode;
    }(Node_2.default));
    exports.CircleNode = CircleNode;
    exports.default = CircleNode;
});
define("node/RectDomNode", ["require", "exports", "graph/RectNode", "./rectDomNode.less"], function (require, exports, RectNode_1, rectDomNode_less_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    RectNode_1 = __importDefault(RectNode_1);
    rectDomNode_less_1 = __importDefault(rectDomNode_less_1);
    var RectDomNode = /** @class */ (function (_super) {
        __extends(RectDomNode, _super);
        function RectDomNode(options) {
            var _this = _super.call(this, options) || this;
            _this.renderType = 'DOM';
            _this.$el = document.createElement('div');
            _this.$el.className = rectDomNode_less_1.default.node;
            return _this;
        }
        RectDomNode.prototype.mount = function (force) {
            if (force === void 0) { force = false; }
            if (this.mounted && !force)
                return;
            if (this.canvas) {
                this.mounted = true;
                this.canvas.wrapper.appendChild(this.$el);
            }
        };
        RectDomNode.prototype.unmount = function () {
            if (!this.mounted || !this.canvas)
                return;
            this.mounted = false;
            if (this.$el.parentElement) {
                this.$el.parentElement.removeChild(this.$el);
            }
        };
        RectDomNode.prototype.render = function (ctx) {
            this.$el.innerHTML = "<div style=\"height:100%;\n                                      display:flex;\n                                      align-items:center;\n                                      justify-content:center;\n                                      border:1px solid #29c1f8;\n                                      box-sizing: border-box;\n                                      font-size:12px;\n                                      user-select: none;\n                                      color:#29c1f8;\">" + this.text + "</div>";
        };
        RectDomNode.prototype.update = function (ctx) {
            if (!this.canvas)
                return;
            var _a = this.getPosition(), x = _a.x, y = _a.y;
            var width = this.getWidth();
            var height = this.getHeight();
            Object.assign(this.$el.style, {
                transform: "scale(" + this.canvas.canvasScale + ") translate3d(" + x + "px," + y + "px,0)",
                width: width + "px",
                height: height + "px",
                boxShadow: this.active ? "0 0 5px 0 " + this.style.activeColor : 'none'
            });
        };
        return RectDomNode;
    }(RectNode_1.default));
    exports.RectDomNode = RectDomNode;
    exports.default = RectDomNode;
});
define("node/RectDomGroup", ["require", "exports", "node/RectDomNode"], function (require, exports, RectDomNode_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    RectDomNode_1 = __importDefault(RectDomNode_1);
    var RectDomGroup = /** @class */ (function (_super) {
        __extends(RectDomGroup, _super);
        function RectDomGroup(options) {
            var _this = _super.call(this, options) || this;
            // 是组
            _this.isGroup = true;
            // 默认可调接尺寸
            _this.canResize = true;
            if (typeof options.isExpanded === 'boolean') {
                _this.isExpanded = options.isExpanded;
            }
            return _this;
        }
        RectDomGroup.prototype.render = function () {
            this.$el.innerHTML = "<div style=\"height:100%;\n                                      display:flex;\n                                      align-items:center;\n                                      justify-content:center;\n                                      border:1px solid #066df2;\n                                      box-sizing:border-box;\">\n                            " + (this.isExpanded ? '' : '...') + "\n                          </div>";
        };
        RectDomGroup.prototype.drawThumbnail = function (ctx) {
            var _a = this.getPosition(), x = _a.x, y = _a.y;
            var width = this.getWidth();
            var height = this.getHeight();
            ctx.save();
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.strokeStyle = this.active ? this.style.activeColor : this.style.color;
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.restore();
        };
        return RectDomGroup;
    }(RectDomNode_1.default));
    exports.RectDomGroup = RectDomGroup;
    exports.default = RectDomGroup;
});
define("utils/utils", ["require", "exports", "graph/RectNode", "graph/CircleNode", "node/RectDomGroup"], function (require, exports, RectNode_2, CircleNode_1, RectDomGroup_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    RectNode_2 = __importDefault(RectNode_2);
    CircleNode_1 = __importDefault(CircleNode_1);
    RectDomGroup_1 = __importDefault(RectDomGroup_1);
    /**
     * 节流函数
     * @param func
     */
    function throttle(func) {
        var running = false;
        return function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            if (running)
                return;
            running = true;
            func.apply(void 0, params);
            requestAnimationFrame(function () {
                running = false;
            });
        };
    }
    exports.throttle = throttle;
    /**
     * 图片加载器
     * @param src
     */
    function imgLoad(src) {
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.src = src;
            img.onload = function () {
                resolve(img);
            };
            img.onerror = function () {
                reject();
            };
        });
    }
    exports.imgLoad = imgLoad;
    /**
     * 原型混入
     * @param derivedCtor 获得混入属性的构造函数
     * @param baseCtors 提供混入属性的构造函数列表
     */
    function applyMixins(derivedCtor, baseCtors) {
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                if (name === 'constructor')
                    return;
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            });
        });
    }
    exports.applyMixins = applyMixins;
    /**
     * 是否为矩形节点
     * @param node
     */
    function isRectNode(node) {
        return node instanceof RectNode_2.default;
    }
    exports.isRectNode = isRectNode;
    /**
     * 是否为圆形节点
     * @param node
     */
    function isCircleNode(node) {
        return node instanceof CircleNode_1.default;
    }
    exports.isCircleNode = isCircleNode;
    /**
     * 是否为矩形DOM组
     * @param node
     */
    function isRectDomGroup(node) {
        return node instanceof RectDomGroup_1.default;
    }
    exports.isRectDomGroup = isRectDomGroup;
});
define("graph/VirtualNode", ["require", "exports", "graph/Node", "utils/Vector2d"], function (require, exports, Node_3, Vector2d_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Node_3 = __importDefault(Node_3);
    Vector2d_5 = __importDefault(Vector2d_5);
    var VirtualNode = /** @class */ (function (_super) {
        __extends(VirtualNode, _super);
        function VirtualNode(options) {
            var _this = _super.call(this, options) || this;
            _this.maxDepth = false;
            _this.renderType = 'NONE';
            _this.shapeType = 'circle';
            _this.radius = 1;
            return _this;
        }
        Object.defineProperty(VirtualNode.prototype, "vertexes", {
            get: function () {
                return this.boundingRect;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VirtualNode.prototype, "boundingRect", {
            get: function () {
                var _a = this.position, x = _a.x, y = _a.y;
                return [
                    new Vector2d_5.default(x - this.radius, y - this.radius),
                    new Vector2d_5.default(x + this.radius, y - this.radius),
                    new Vector2d_5.default(x + this.radius, y + this.radius),
                    new Vector2d_5.default(x - this.radius, y + this.radius),
                ];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VirtualNode.prototype, "boundingJoinPoints", {
            get: function () {
                var _a = this.position, x = _a.x, y = _a.y;
                return [
                    new Vector2d_5.default(x, y - this.radius),
                    new Vector2d_5.default(x + this.radius, y),
                    new Vector2d_5.default(x, y + this.radius),
                    new Vector2d_5.default(x - this.radius, y)
                ];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VirtualNode.prototype, "joinPoint", {
            get: function () {
                return this.position;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VirtualNode.prototype, "centerPoint", {
            get: function () {
                return this.position;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VirtualNode.prototype, "depth", {
            get: function () {
                return this.maxDepth ? Number.MAX_SAFE_INTEGER : (this.parent ? this.parent.depth + 1 : 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VirtualNode.prototype, "circumradius", {
            get: function () {
                return this.radius;
            },
            enumerable: true,
            configurable: true
        });
        VirtualNode.prototype.isInRect = function () { return false; };
        VirtualNode.prototype.isPointIn = function () { return false; };
        VirtualNode.prototype.render = function () { };
        VirtualNode.prototype.destroy = function () { };
        VirtualNode.prototype.updatePosition = function () { };
        VirtualNode.prototype.updateRender = function () { };
        VirtualNode.prototype.drawThumbnail = function () { };
        return VirtualNode;
    }(Node_3.default));
    exports.VirtualNode = VirtualNode;
    exports.default = VirtualNode;
});
define("interaction/Interaction", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function noop(canvas, e) { }
    var Interaction = /** @class */ (function () {
        function Interaction() {
            // 模式安装
            this.onInstall = noop;
            // 模式卸载
            this.onUninstall = noop;
            // 渲染更新
            this.onUpdate = noop;
        }
        /**
         * 处理画布事件
         * @param canvas
         * @param event
         */
        Interaction.prototype.handleEvent = function (canvas, event) { };
        return Interaction;
    }());
    exports.Interaction = Interaction;
    exports.default = Interaction;
});
define("interaction/dragInteraction", ["require", "exports", "interaction/Interaction", "utils/Vector2d"], function (require, exports, Interaction_1, Vector2d_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Interaction_1 = __importDefault(Interaction_1);
    Vector2d_6 = __importDefault(Vector2d_6);
    /**
     * 可拖拽图元或整个画布
     * 前置依赖：selectInteraction
     */
    var DragInteraction = /** @class */ (function (_super) {
        __extends(DragInteraction, _super);
        function DragInteraction() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            // 最小拖动距离
            _this.minDragDistance = 3;
            _this.moveNodes = [];
            _this.mousedown = false;
            // 记录上一次鼠标位置
            _this.lastCoordinate = new Vector2d_6.default();
            _this.onMouseDown = function (canvas) {
                var activeNodes = canvas.getActiveNodes();
                if (activeNodes.length) {
                    _this.moveNodes = __spreadArrays(activeNodes);
                }
                else {
                    _this.moveNodes = __spreadArrays(canvas.rootNode.children);
                }
                _this.mousedown = true;
                _this.lastCoordinate.copy(canvas.mousedownPosition);
            };
            _this.onMouseMove = function (canvas) {
                if (!_this.mousedown)
                    return;
                // 移动距离太小，认为是误操作，过滤掉
                if (Vector2d_6.default.copy(canvas.mousemovePosition).substract(canvas.mousedownPosition).magnitude < _this.minDragDistance)
                    return;
                var offset = Vector2d_6.default.copy(canvas.mousemovePosition).substract(_this.lastCoordinate);
                _this.lastCoordinate.copy(canvas.mousemovePosition);
                var pixelOffset = offset.scale(1 / canvas.canvasScale);
                _this.moveNodes.forEach(function (node) {
                    node.translate(pixelOffset);
                });
                canvas.repaint = true;
            };
            _this.onMouseUp = function (canvas) {
                if (_this.moveNodes.length === 1) {
                    var activeNode_1 = _this.moveNodes[0];
                    var wrap_1 = false;
                    canvas.rootNode.getDescendantDF(function (node) {
                        if (!node.visible)
                            return;
                        if (node === activeNode_1)
                            return;
                        if (!node.isGroup)
                            return;
                        if (activeNode_1.hasDescendant(node))
                            return;
                        if (activeNode_1.isWrappedInRect(node.boundingRect)) {
                            node.addChild(activeNode_1);
                            return wrap_1 = true;
                        }
                    });
                    if (!wrap_1) {
                        canvas.rootNode.addChild(activeNode_1);
                    }
                }
                _this.moveNodes = [];
                _this.mousedown = false;
            };
            return _this;
        }
        DragInteraction.prototype.handleEvent = function (canvas, event) {
            switch (event.type) {
                case 'mousedown':
                    this.onMouseDown(canvas);
                    break;
                case 'mousemove':
                    this.onMouseMove(canvas);
                    break;
                case 'mouseup':
                    this.onMouseUp(canvas);
                    break;
            }
        };
        return DragInteraction;
    }(Interaction_1.default));
    exports.DragInteraction = DragInteraction;
    exports.dragInteraction = new DragInteraction();
    exports.default = DragInteraction;
});
define("interaction/dropInteraction", ["require", "exports", "interaction/Interaction", "utils/Vector2d"], function (require, exports, Interaction_2, Vector2d_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Interaction_2 = __importDefault(Interaction_2);
    Vector2d_7 = __importDefault(Vector2d_7);
    /**
     * drop
     */
    var DropInteraction = /** @class */ (function (_super) {
        __extends(DropInteraction, _super);
        function DropInteraction() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.onDrop = function (canvas, e) {
                var event = e;
                canvas.eventEmitter.emit('canvas:drop', {
                    coordinate: canvas.viewportToPixelCoordinate(new Vector2d_7.default(event.clientX, event.clientY)),
                    dataTransfer: event.dataTransfer
                });
            };
            _this.onDragOver = function (canvas, e) {
                e.preventDefault();
            };
            return _this;
        }
        DropInteraction.prototype.handleEvent = function (canvas, event) {
            switch (event.type) {
                case 'drop':
                    this.onDrop(canvas, event);
                    break;
                case 'dragover':
                    this.onDragOver(canvas, event);
                    break;
            }
        };
        return DropInteraction;
    }(Interaction_2.default));
    exports.DropInteraction = DropInteraction;
    exports.dropInteraction = new DropInteraction();
    exports.default = DropInteraction;
});
define("interaction/moveCanvasInteraction", ["require", "exports", "interaction/Interaction", "utils/Vector2d"], function (require, exports, Interaction_3, Vector2d_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Interaction_3 = __importDefault(Interaction_3);
    Vector2d_8 = __importDefault(Vector2d_8);
    /**
     * 拖动整个画布
     */
    var MoveCanvasInteraction = /** @class */ (function (_super) {
        __extends(MoveCanvasInteraction, _super);
        function MoveCanvasInteraction() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            // 最小拖动距离
            _this.minDragDistance = 3;
            _this.mouseDown = false;
            _this.move = false;
            _this.lastCoordinate = new Vector2d_8.default();
            _this.onMouseDown = function (canvas) {
                _this.mouseDown = true;
                _this.lastCoordinate.copy(canvas.mousedownPosition);
            };
            _this.onMouseMove = function (canvas) {
                if (!_this.mouseDown)
                    return;
                // 移动距离太小，认为是误操作，过滤掉
                if (Vector2d_8.default.copy(canvas.mousemovePosition).substract(canvas.mousedownPosition).magnitude < _this.minDragDistance)
                    return;
                var offset = Vector2d_8.default.copy(canvas.mousemovePosition).substract(_this.lastCoordinate);
                _this.lastCoordinate.copy(canvas.mousemovePosition);
                _this.move = true;
                var pixelOffset = offset.scale(1 / canvas.canvasScale);
                canvas.rootNode.translate(pixelOffset);
                canvas.repaint = true;
            };
            _this.onMouseUp = function (canvas) {
                _this.mouseDown = false;
                if (_this.move) {
                    canvas.eventEmitter.emit('interaction:canvasMoveEnd');
                    _this.move = false;
                }
            };
            return _this;
        }
        MoveCanvasInteraction.prototype.handleEvent = function (canvas, event) {
            switch (event.type) {
                case 'mousedown':
                    this.onMouseDown(canvas);
                    break;
                case 'mousemove':
                    this.onMouseMove(canvas);
                    break;
                case 'mouseup':
                    this.onMouseUp(canvas);
                    break;
            }
        };
        return MoveCanvasInteraction;
    }(Interaction_3.default));
    exports.MoveCanvasInteraction = MoveCanvasInteraction;
    exports.moveCanvasInteraction = new MoveCanvasInteraction();
    exports.default = MoveCanvasInteraction;
});
define("interaction/wheelZoomInteraction", ["require", "exports", "interaction/Interaction", "utils/Vector2d"], function (require, exports, Interaction_4, Vector2d_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Interaction_4 = __importDefault(Interaction_4);
    Vector2d_9 = __importDefault(Vector2d_9);
    /**
     * 滚轮缩放
     */
    var WheelZoomInteraction = /** @class */ (function (_super) {
        __extends(WheelZoomInteraction, _super);
        function WheelZoomInteraction() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.onWheel = function (canvas, e) {
                var _a = e, deltaY = _a.deltaY, clientX = _a.clientX, clientY = _a.clientY;
                e.preventDefault();
                if (deltaY > 0) {
                    canvas.zoomOut(new Vector2d_9.default(clientX, clientY));
                }
                else {
                    canvas.zoomIn(new Vector2d_9.default(clientX, clientY));
                }
            };
            return _this;
        }
        WheelZoomInteraction.prototype.handleEvent = function (canvas, event) {
            switch (event.type) {
                case 'wheel':
                    this.onWheel(canvas, event);
                    break;
            }
        };
        return WheelZoomInteraction;
    }(Interaction_4.default));
    exports.WheelZoomInteraction = WheelZoomInteraction;
    exports.wheelZoomInteraction = new WheelZoomInteraction();
    exports.default = WheelZoomInteraction;
});
define("interaction/selectInteraction", ["require", "exports", "interaction/Interaction"], function (require, exports, Interaction_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Interaction_5 = __importDefault(Interaction_5);
    /**
     * 选中图元
     */
    var SelectInteraction = /** @class */ (function (_super) {
        __extends(SelectInteraction, _super);
        function SelectInteraction() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.onMouseDown = function (canvas) {
                var activeNode;
                var activeEdge;
                var sign = Math.random();
                canvas.rootNode.getDescendantDF(function (node) {
                    if /* 已存在激活图元或本身不可见 */ (activeNode || activeEdge || !node.visible) {
                        node.active = false;
                    }
                    else {
                        node.active = node.isPointIn();
                        if (node.active) {
                            activeNode = node;
                            canvas.setNodeTop(node);
                        }
                    }
                    node.isUpdate = true;
                    node.edges.forEach(function (edge) {
                        if /* 是否已遍历 */ (edge.renderSign === sign)
                            return;
                        edge.renderSign = sign;
                        edge.active = false;
                        if /* 已存在激活图元 */ (activeEdge || activeNode)
                            return;
                        if /* 边线不可见 */ (!edge.sourceNode.visible && !edge.targetNode.visible)
                            return;
                        edge.active = edge.isPointIn();
                        if (edge.active) {
                            activeEdge = edge;
                        }
                    });
                });
                canvas.repaint = true;
            };
            return _this;
        }
        SelectInteraction.prototype.handleEvent = function (canvas, event) {
            switch (event.type) {
                case 'mousedown':
                    this.onMouseDown(canvas);
                    break;
            }
        };
        return SelectInteraction;
    }(Interaction_5.default));
    exports.SelectInteraction = SelectInteraction;
    exports.selectInteraction = new SelectInteraction();
    exports.default = SelectInteraction;
});
define("interaction/areaPickInteraction", ["require", "exports", "interaction/Interaction", "utils/Vector2d"], function (require, exports, Interaction_6, Vector2d_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Interaction_6 = __importDefault(Interaction_6);
    Vector2d_10 = __importDefault(Vector2d_10);
    /**
     * 框选交互
     */
    var AreaPickInteraction = /** @class */ (function (_super) {
        __extends(AreaPickInteraction, _super);
        function AreaPickInteraction() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.minDragDistance = 5;
            _this.mouseDown = false;
            _this.activeNodes = [];
            _this.dragMove = false;
            _this.lastCoordinate = new Vector2d_10.default();
            _this.onInstall = function (canvas) {
                // 显示交互画布
                canvas.topCanvasMount();
            };
            _this.onUninstall = function (canvas) {
                // 移除交互画布
                canvas.topCanvasCtx.clearRect(0, 0, canvas.viewWidth, canvas.viewHeight);
                canvas.topCanvasUnmount();
            };
            _this.onMouseDown = function (canvas, e) {
                // const { button } = e as MouseEvent
                // if (button !== 0) return
                _this.dragMove = false;
                _this.lastCoordinate.copy(canvas.mousedownPosition);
                var activeNodes = canvas.getActiveNodes();
                if /* 选中已激活元素 */ (activeNodes.length && activeNodes.find(function (node) { return node.visible && node.isPointIn(); })) {
                    _this.dragMove = true;
                    _this.activeNodes = activeNodes;
                }
                else {
                    _this.activeNodes = [];
                    canvas.rootNode.getDescendantDF(function (node) {
                        node.isUpdate = true;
                        if (!_this.activeNodes.length && node.visible && node.isPointIn()) {
                            _this.activeNodes.push(node);
                            _this.dragMove = true;
                            node.active = true;
                        }
                        else {
                            node.active = false;
                        }
                    });
                    canvas.repaint = true;
                }
                _this.mouseDown = true;
                canvas.topCanvasCtx.fillStyle = 'rgba(41, 193, 248, 0.3)';
                canvas.topCanvasCtx.strokeStyle = 'rgb(41, 193, 248)';
            };
            _this.onMouseMove = function (canvas, e) {
                if (!_this.mouseDown)
                    return;
                if (_this.dragMove) {
                    var offset = Vector2d_10.default.copy(canvas.mousemovePosition).substract(_this.lastCoordinate);
                    _this.lastCoordinate.copy(canvas.mousemovePosition);
                    var pixelOffset_1 = offset.scale(1 / canvas.canvasScale);
                    _this.activeNodes.forEach(function (node) {
                        node.translate(pixelOffset_1);
                    });
                    canvas.repaint = true;
                }
                else {
                    var mousedownPosition = canvas.mousedownPosition, mousemovePosition = canvas.mousemovePosition, topCanvasCtx = canvas.topCanvasCtx, viewWidth = canvas.viewWidth, viewHeight = canvas.viewHeight;
                    var offset = Vector2d_10.default.copy(mousemovePosition).substract(mousedownPosition);
                    if (offset.magnitude < _this.minDragDistance)
                        return;
                    var p0 = canvas.viewportToCanvasCoordinate(mousedownPosition);
                    var p2 = canvas.viewportToCanvasCoordinate(mousemovePosition);
                    var p1 = new Vector2d_10.default(p0.x, p2.y);
                    var p3 = new Vector2d_10.default(p2.x, p0.y);
                    // 绘制拖选框
                    topCanvasCtx.clearRect(0, 0, viewWidth, viewHeight);
                    topCanvasCtx.beginPath();
                    topCanvasCtx.moveTo(p0.x, p0.y);
                    topCanvasCtx.lineTo(p1.x, p1.y);
                    topCanvasCtx.lineTo(p2.x, p2.y);
                    topCanvasCtx.lineTo(p3.x, p3.y);
                    topCanvasCtx.closePath();
                    topCanvasCtx.fill();
                    topCanvasCtx.stroke();
                    var v0 = void 0;
                    var v1 = void 0;
                    var v2 = void 0;
                    var v3 = void 0;
                    if (mousedownPosition.x > mousemovePosition.x) {
                        if (mousedownPosition.y > mousemovePosition.y) {
                            v0 = canvas.viewportToPixelCoordinate(mousemovePosition);
                            v2 = canvas.viewportToPixelCoordinate(mousedownPosition);
                            v1 = new Vector2d_10.default(v2.x, v0.y);
                            v3 = new Vector2d_10.default(v0.x, v2.y);
                        }
                        else {
                            v1 = canvas.viewportToPixelCoordinate(mousedownPosition);
                            v3 = canvas.viewportToPixelCoordinate(mousemovePosition);
                            v0 = new Vector2d_10.default(v3.x, v1.y);
                            v2 = new Vector2d_10.default(v1.x, v3.y);
                        }
                    }
                    else {
                        if (mousedownPosition.y > mousemovePosition.y) {
                            v1 = canvas.viewportToPixelCoordinate(mousemovePosition);
                            v3 = canvas.viewportToPixelCoordinate(mousedownPosition);
                            v0 = new Vector2d_10.default(v3.x, v1.y);
                            v2 = new Vector2d_10.default(v1.x, v3.y);
                        }
                        else {
                            v0 = canvas.viewportToPixelCoordinate(mousedownPosition);
                            v2 = canvas.viewportToPixelCoordinate(mousemovePosition);
                            v1 = new Vector2d_10.default(v2.x, v0.y);
                            v3 = new Vector2d_10.default(v0.x, v2.y);
                        }
                    }
                    var rect_1 = [v0, v1, v2, v3];
                    canvas.rootNode.getDescendantBF(function (node) {
                        var status = node.active;
                        if (node.hasActiveAncestor()) {
                            node.active = false;
                        }
                        else if (node.isWrappedInRect(rect_1)) {
                            node.active = true;
                        }
                        else {
                            node.active = false;
                        }
                        if (status !== node.active) {
                            node.isUpdate = true;
                        }
                    });
                    canvas.repaint = true;
                }
            };
            _this.onMouseUp = function (canvas, e) {
                if (!_this.mouseDown)
                    return;
                _this.dragMove = false;
                var topCanvasCtx = canvas.topCanvasCtx, viewWidth = canvas.viewWidth, viewHeight = canvas.viewHeight;
                _this.mouseDown = false;
                topCanvasCtx.clearRect(0, 0, viewWidth, viewHeight);
            };
            return _this;
        }
        AreaPickInteraction.prototype.handleEvent = function (canvas, event) {
            switch (event.type) {
                case 'mousedown':
                    this.onMouseDown(canvas, event);
                    break;
                case 'mousemove':
                    this.onMouseMove(canvas, event);
                    break;
                case 'mouseup':
                    this.onMouseUp(canvas, event);
                    break;
            }
        };
        return AreaPickInteraction;
    }(Interaction_6.default));
    exports.AreaPickInteraction = AreaPickInteraction;
    exports.areaPickInteraction = new AreaPickInteraction();
    exports.default = AreaPickInteraction;
});
define("node/RectCanvasNode", ["require", "exports", "graph/RectNode"], function (require, exports, RectNode_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    RectNode_3 = __importDefault(RectNode_3);
    var RectCanvasNode = /** @class */ (function (_super) {
        __extends(RectCanvasNode, _super);
        function RectCanvasNode(options) {
            var _this = _super.call(this, options) || this;
            _this.renderType = 'CANVAS';
            _this.cacheCanvas = document.createElement('canvas');
            return _this;
        }
        RectCanvasNode.prototype.render = function (ctx) {
            if (!this.canvas)
                return;
            var width = this.getWidth();
            var height = this.getHeight();
            ctx = ctx || this.cacheCanvas.getContext('2d');
            this.cacheCanvas.width = width + 4;
            this.cacheCanvas.height = height + 4;
            ctx.rect(2, 2, width, height);
            ctx.strokeStyle = '#29c1f8';
            ctx.fillStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.fill();
            ctx.stroke();
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.font = "14px serif";
            ctx.fillStyle = '#29c1f8';
            ctx.fillText(this.text, width / 2 + 2, height / 2 + 2);
            this.canvas.repaint = true;
        };
        RectCanvasNode.prototype.update = function (ctx) {
            if (!this.canvas)
                return;
            var graphCanvasCtx = this.canvas.graphCanvasCtx;
            var _a = this.getPosition(), x = _a.x, y = _a.y;
            graphCanvasCtx.save();
            if (this.active) {
                graphCanvasCtx.shadowBlur = 5;
                graphCanvasCtx.shadowColor = 'rgba(255,0,0,0.8)';
            }
            graphCanvasCtx.drawImage(this.cacheCanvas, x - 2, y - 2);
            graphCanvasCtx.restore();
        };
        return RectCanvasNode;
    }(RectNode_3.default));
    exports.RectCanvasNode = RectCanvasNode;
    exports.default = RectCanvasNode;
});
define("node/RectCanvasGroup", ["require", "exports", "node/RectCanvasNode"], function (require, exports, RectCanvasNode_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 矩形组
     */
    var RectCanvasGroup = /** @class */ (function (_super) {
        __extends(RectCanvasGroup, _super);
        function RectCanvasGroup(options) {
            var _this = _super.call(this, options) || this;
            // 是组
            _this.isGroup = true;
            // 默认可调接尺寸
            _this.canResize = true;
            if (typeof options.isExpanded === 'boolean') {
                _this.isExpanded = options.isExpanded;
            }
            return _this;
        }
        RectCanvasGroup.prototype.render = function (ctx) { };
        RectCanvasGroup.prototype.update = function (ctx) {
            ctx = ctx || (this.canvas && this.canvas.graphCanvasCtx);
            if (!ctx)
                return;
            var width = this.getWidth();
            var height = this.getHeight();
            var _a = this.getPosition(), x = _a.x, y = _a.y;
            var center = this.centerPoint;
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            if (!this.isExpanded) {
                ctx.moveTo(center.x, center.y - 10);
                ctx.lineTo(center.x, center.y + 10);
                ctx.moveTo(center.x - 10, center.y);
                ctx.lineTo(center.x + 10, center.y);
            }
            ctx.save();
            if (this.active) {
                ctx.shadowBlur = 5;
                ctx.shadowColor = this.active ? this.style.activeColor : this.style.color;
            }
            ctx.strokeStyle = this.active ? this.style.activeColor : this.style.color;
            ctx.stroke();
            ctx.restore();
        };
        RectCanvasGroup.prototype.drawThumbnail = function (ctx) {
            var _a = this.getPosition(), x = _a.x, y = _a.y;
            var width = this.getWidth();
            var height = this.getHeight();
            ctx.save();
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.strokeStyle = this.active ? this.style.activeColor : this.style.color;
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.restore();
        };
        RectCanvasGroup.shape = 'rect';
        return RectCanvasGroup;
    }(RectCanvasNode_1.RectCanvasNode));
    exports.RectCanvasGroup = RectCanvasGroup;
    exports.default = RectCanvasGroup;
});
define("plugin/Plugin", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Plugin = /** @class */ (function () {
        function Plugin() {
            /**
             * 画布实例
             */
            this.canvas = null;
            /**
             * 是否启用
             */
            this.enable = true;
        }
        /**
         * 更新（画布更新时调用）
         */
        Plugin.prototype.update = function () { };
        /**
         * 处理事件
         * @param event
         */
        Plugin.prototype.handleEvent = function (event) { };
        return Plugin;
    }());
    exports.Plugin = Plugin;
    exports.default = Plugin;
});
define("plugin/ContextMenu", ["require", "exports", "plugin/Plugin", "utils/Vector2d", "./ContextMenu.less"], function (require, exports, Plugin_1, Vector2d_11, ContextMenu_less_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Plugin_1 = __importDefault(Plugin_1);
    Vector2d_11 = __importDefault(Vector2d_11);
    ContextMenu_less_1 = __importDefault(ContextMenu_less_1);
    var ContextMenu = /** @class */ (function (_super) {
        __extends(ContextMenu, _super);
        function ContextMenu() {
            var _this = _super.call(this) || this;
            _this.position = new Vector2d_11.default();
            _this.mounted = false;
            _this.container = document.createElement('div');
            _this.onContextMenu = null;
            _this.menu = [];
            /**
             * 隐藏
             */
            _this.hide = function () {
                if (_this.container.parentElement) {
                    _this.container.parentElement.removeChild(_this.container);
                }
            };
            /**
             * 处理上下文菜单事件
             */
            _this.handleContextMenu = function (e) {
                if (!_this.canvas || !_this.onContextMenu)
                    return;
                _this.position.x = e.clientX;
                _this.position.y = e.clientY;
                var activeNodes = _this.canvas.getActiveNodes();
                var activeEdges = _this.canvas.getActiveEdges();
                var target = activeNodes.find(function (node) { return node.isPointIn(); }) || activeEdges.find(function (edge) { return edge.isPointIn(); }) || null;
                var menu = _this.onContextMenu(_this, target, activeNodes, activeEdges);
                _this.show(menu);
            };
            /**
             * 处理菜单点击事件
             */
            _this.handleClick = function (e) {
                if (!_this.canvas)
                    return;
                e.stopPropagation();
                var target = e.target;
                if (!target)
                    return;
                if (target === _this.container)
                    return;
                var command = target.dataset.command;
                var menu = _this.menu.find(function (item) { return item.command === command; });
                _this.canvas.eventEmitter.emit('canvas:menu', menu);
                _this.hide();
            };
            _this.container.className = ContextMenu_less_1.default.menu;
            return _this;
        }
        ContextMenu.prototype.handleEvent = function (event) {
            if (event.type === 'contextmenu') {
                this.handleContextMenu(event);
            }
        };
        ContextMenu.prototype.install = function (canvas) {
            this.canvas = canvas;
            this.container.addEventListener('click', this.handleClick);
            document.addEventListener('click', this.hide);
        };
        ContextMenu.prototype.destroy = function () {
            if (!this.canvas)
                return;
            this.container.removeEventListener('click', this.handleClick);
            document.removeEventListener('click', this.hide);
            this.canvas = null;
        };
        /**
         * 显示
         */
        ContextMenu.prototype.show = function (menu, left, top) {
            if (menu === void 0) { menu = []; }
            this.hide();
            if (!menu.length)
                return;
            this.menu = menu;
            var _a = this.position, x = _a.x, y = _a.y;
            x = left !== undefined ? left : x;
            y = top !== undefined ? top : y;
            var html = this.menu.map(function (item) {
                return "<div class=\"item\" data-command=\"" + item.command + "\">" + item.label + "</div>";
            });
            this.container.innerHTML = html.join('');
            Object.assign(this.container.style, {
                left: x + "px",
                top: y + "px"
            });
            document.body.appendChild(this.container);
        };
        return ContextMenu;
    }(Plugin_1.default));
    exports.ContextMenu = ContextMenu;
    exports.default = ContextMenu;
});
define("interaction/createGroupInteraction", ["require", "exports", "interaction/Interaction", "node/RectDomGroup", "node/RectCanvasGroup", "plugin/ContextMenu", "utils/utils"], function (require, exports, Interaction_7, RectDomGroup_2, RectCanvasGroup_1, ContextMenu_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Interaction_7 = __importDefault(Interaction_7);
    RectDomGroup_2 = __importDefault(RectDomGroup_2);
    RectCanvasGroup_1 = __importDefault(RectCanvasGroup_1);
    ContextMenu_1 = __importDefault(ContextMenu_1);
    /**
     * 创建组
     */
    var CreateGroupInteraction = /** @class */ (function (_super) {
        __extends(CreateGroupInteraction, _super);
        function CreateGroupInteraction(onCreate) {
            var _this = _super.call(this) || this;
            _this.onContextMenu = function (canvas, e) {
                var contextMenu = canvas.plugins.find(function (plugin) { return plugin instanceof ContextMenu_1.default; });
                if (!contextMenu)
                    return;
                var activeNodes = canvas.getActiveNodes();
                var event = e;
                if (activeNodes.length) {
                    _this.parentNode = undefined;
                    var index = activeNodes.findIndex(function (node) {
                        if (!node.parent)
                            return false;
                        if (_this.parentNode && _this.parentNode !== node.parent)
                            return true;
                        _this.parentNode = node.parent;
                        return false;
                    });
                    if (index === -1) {
                        contextMenu.show([
                            {
                                label: '添加到组',
                                command: 'addToGroup'
                            }
                        ], event.clientX, event.clientY);
                    }
                }
            };
            _this.onInstall = function (canvas) {
                _this.canvas = canvas;
                canvas.eventEmitter.on('canvas:menu', _this.onAddToGroup);
            };
            _this.onUninstall = function (canvas) {
                canvas.eventEmitter.off('canvas:menu', _this.onAddToGroup);
            };
            //
            _this.onAddToGroup = function (menu) {
                if (menu.command !== 'addToGroup')
                    return;
                var activeNodes = _this.canvas.getActiveNodes();
                if (!activeNodes.length)
                    return;
                var group = _this.onCreate();
                activeNodes.forEach(function (node) { return group.addChild(node); });
                var _a = getActiveNodesBoundingRect(activeNodes), xMin = _a.xMin, yMin = _a.yMin, xMax = _a.xMax, yMax = _a.yMax;
                if (utils_1.isRectNode(group)) {
                    group.width = xMax - xMin + 40;
                    group.height = yMax - yMin + 40;
                }
                // to be continue
                if (utils_1.isCircleNode(group)) { }
                group.position.x = xMin - 20;
                group.position.y = yMin - 20;
                if (_this.parentNode) {
                    _this.parentNode.addChild(group);
                    _this.canvas.setNodeTop(group);
                    _this.canvas.repaint = true;
                }
                else {
                    _this.canvas.addNode(group);
                }
            };
            _this.onCreate = onCreate || (function () {
                if (_this.canvas.renderType === 'CANVAS') {
                    return new RectCanvasGroup_1.default({
                        id: Math.random()
                    });
                }
                else {
                    return new RectDomGroup_2.default({
                        id: Math.random()
                    });
                }
            });
            return _this;
        }
        CreateGroupInteraction.prototype.handleEvent = function (canvas, event) {
            switch (event.type) {
                case 'contextmenu':
                    this.onContextMenu(canvas, event);
                    break;
            }
        };
        return CreateGroupInteraction;
    }(Interaction_7.default));
    exports.CreateGroupInteraction = CreateGroupInteraction;
    function getActiveNodesBoundingRect(activeNodes) {
        var xMin = Number.MAX_SAFE_INTEGER;
        var yMin = Number.MAX_SAFE_INTEGER;
        var xMax = Number.MIN_SAFE_INTEGER;
        var yMax = Number.MIN_SAFE_INTEGER;
        activeNodes.forEach(function (node) {
            node.boundingRect.forEach(function (point) {
                xMin = Math.min(xMin, point.x);
                yMin = Math.min(yMin, point.y);
                xMax = Math.max(xMax, point.x);
                yMax = Math.max(yMax, point.y);
            });
        });
        return { xMin: xMin, yMin: yMin, xMax: xMax, yMax: yMax };
    }
    exports.createGroupInteraction = new CreateGroupInteraction();
    exports.default = CreateGroupInteraction;
});
define("node/CircleCanvasNode", ["require", "exports", "graph/CircleNode"], function (require, exports, CircleNode_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    CircleNode_2 = __importDefault(CircleNode_2);
    var CircleCanvasNode = /** @class */ (function (_super) {
        __extends(CircleCanvasNode, _super);
        function CircleCanvasNode(options) {
            var _this = _super.call(this, options) || this;
            _this.renderType = 'CANVAS';
            _this.cacheCanvas = document.createElement('canvas');
            return _this;
        }
        CircleCanvasNode.prototype.render = function () {
            var _a = this, radius = _a.radius, canvas = _a.canvas, active = _a.active;
            if (!canvas)
                return;
            var diameter = 2 * radius;
            this.cacheCanvas.width = diameter + 2;
            this.cacheCanvas.height = diameter + 2;
            var ctx = this.cacheCanvas.getContext('2d');
            ctx.beginPath();
            ctx.arc(radius + 1, radius + 1, radius, 0, 2 * Math.PI);
            ctx.strokeStyle = '#29c1f8';
            ctx.fillStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fill();
            if (this.text) {
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.font = "14px serif";
                ctx.fillStyle = '#29c1f8';
                ctx.fillText(this.text, radius + 1, radius + 1);
            }
            canvas.repaint = true;
        };
        CircleCanvasNode.prototype.update = function () {
            if (!this.canvas)
                return;
            var graphCanvasCtx = this.canvas.graphCanvasCtx;
            var _a = this.getPosition(), x = _a.x, y = _a.y;
            graphCanvasCtx.save();
            if (this.active) {
                graphCanvasCtx.shadowBlur = 5;
                graphCanvasCtx.shadowColor = 'rgba(255,0,0,0.8)';
            }
            graphCanvasCtx.drawImage(this.cacheCanvas, x - 1, y - 1);
            graphCanvasCtx.restore();
        };
        return CircleCanvasNode;
    }(CircleNode_2.default));
    exports.CircleCanvasNode = CircleCanvasNode;
    exports.default = CircleCanvasNode;
});
define("interaction/resizeInteraction", ["require", "exports", "interaction/Interaction", "utils/Vector2d", "utils/Math2d", "interaction/selectInteraction", "interaction/dragInteraction"], function (require, exports, Interaction_8, Vector2d_12, Math2d_3, selectInteraction_1, dragInteraction_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Interaction_8 = __importDefault(Interaction_8);
    Vector2d_12 = __importDefault(Vector2d_12);
    Math2d_3 = __importDefault(Math2d_3);
    var anchorPositionOffset = new Vector2d_12.default(-3, -3);
    /**
     * resize
     */
    var ResizeInteraction = /** @class */ (function (_super) {
        __extends(ResizeInteraction, _super);
        function ResizeInteraction() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.flag = false;
            _this.activeAnchorIndex = -1;
            _this.onInstall = function (canvas) {
                // 显示交互画布
                canvas.topCanvasMount();
            };
            _this.onUninstall = function (canvas) {
                // 移除交互画布
                canvas.topCanvasCtx.clearRect(0, 0, canvas.viewWidth, canvas.viewHeight);
                canvas.topCanvasUnmount();
            };
            _this.onMouseUp = function (canvas) {
                _this.activeAnchorIndex = -1;
                dragInteraction_1.dragInteraction.onMouseUp(canvas);
            };
            _this.onMouseDown = function (canvas) {
                _this.activeAnchorIndex = _this.getActiveAnchorIndex(canvas);
                if (_this.activeAnchorIndex === -1) {
                    selectInteraction_1.selectInteraction.onMouseDown(canvas);
                    dragInteraction_1.dragInteraction.onMouseDown(canvas);
                    var activeNode = canvas.getActiveNodes()[0];
                    if (activeNode && activeNode.canResize && activeNode.isExpanded) {
                        _this.activeNode = activeNode;
                    }
                    else {
                        _this.activeNode = undefined;
                    }
                }
            };
            _this.onMouseMove = function (canvas, e) {
                var activeNode = _this.activeNode;
                if (_this.activeAnchorIndex > -1 && activeNode) {
                    var event_1 = e;
                    var coordinate = canvas.viewportToPixelCoordinate(new Vector2d_12.default(event_1.clientX, event_1.clientY));
                    activeNode.isUpdate = true;
                    canvas.repaint = true;
                    if (activeNode.shapeType === 'rect') {
                        resizeRectNode(activeNode, _this.activeAnchorIndex, coordinate);
                    }
                    else {
                        resizeCircleNode(activeNode, _this.activeAnchorIndex, coordinate);
                    }
                    activeNode.render();
                }
                else {
                    var index = _this.getActiveAnchorIndex(canvas);
                    var mouseCursor = 'default';
                    if (index > -1) {
                        switch (index) {
                            case 0: // 西北
                                mouseCursor = 'nwse-resize';
                                break;
                            case 1: // 东北
                                mouseCursor = 'nesw-resize';
                                break;
                            case 2: // 东南
                                mouseCursor = 'nwse-resize';
                                break;
                            case 3: // 西南
                                mouseCursor = 'nesw-resize';
                                break;
                            case 4: // 北
                                mouseCursor = 'ns-resize';
                                break;
                            case 5: // 东
                                mouseCursor = 'ew-resize';
                                break;
                            case 6: // 南
                                mouseCursor = 'ns-resize';
                                break;
                            case 7: // 西
                                mouseCursor = 'ew-resize';
                                break;
                        }
                    }
                    else {
                        dragInteraction_1.dragInteraction.onMouseMove(canvas);
                    }
                    canvas.wrapper.style.cursor = mouseCursor;
                }
            };
            _this.onUpdate = function (canvas) {
                canvas.topCanvasCtx.clearRect(0, 0, canvas.viewWidth, canvas.viewHeight);
                if (_this.activeNode) {
                    var points = __spreadArrays(_this.activeNode.boundingRect, _this.activeNode.boundingJoinPoints);
                    canvas.topCanvasCtx.save();
                    canvas.topCanvasCtx.fillStyle = '#2D8CF5';
                    canvas.topCanvasCtx.beginPath();
                    points.forEach(function (point) {
                        var canvasCoordinate = canvas.pixelToCanvasCoordinate(point);
                        canvas.topCanvasCtx.rect(canvasCoordinate.x - 3, canvasCoordinate.y - 3, 6, 6);
                        canvas.topCanvasCtx.fill();
                    });
                    canvas.topCanvasCtx.restore();
                }
            };
            return _this;
        }
        ResizeInteraction.prototype.getActiveAnchorIndex = function (canvas) {
            if (!this.activeNode)
                return -1;
            var points = __spreadArrays(this.activeNode.boundingRect, this.activeNode.boundingJoinPoints);
            var index = 0;
            var anchor = points.find(function (point, i) {
                var anchorRectPosition = canvas.pixelToViewportCoordinate(point).add(anchorPositionOffset);
                index = i;
                return Math2d_3.default.isPointInRect(canvas.mousemovePosition, anchorRectPosition, 6, 6);
            });
            if (!anchor)
                return -1;
            return index;
        };
        ResizeInteraction.prototype.handleEvent = function (canvas, event) {
            switch (event.type) {
                case 'mousedown':
                    this.onMouseDown(canvas);
                    break;
                case 'mousemove':
                    this.onMouseMove(canvas, event);
                    break;
                case 'mouseup':
                    this.onMouseUp(canvas);
                    break;
            }
        };
        return ResizeInteraction;
    }(Interaction_8.default));
    exports.ResizeInteraction = ResizeInteraction;
    /**
     * 矩形
     * @param activeNode
     * @param anchorIndex
     * @param coordinate
     */
    function resizeRectNode(activeNode, anchorIndex, coordinate) {
        var nodeBoundingRect = activeNode.boundingRect;
        var currentWidth = activeNode.getWidth();
        var currentHeight = activeNode.getHeight();
        switch (anchorIndex) {
            case 0: // 西北
                currentWidth = nodeBoundingRect[2].x - coordinate.x;
                currentHeight = nodeBoundingRect[2].y - coordinate.y;
                if (currentWidth >= activeNode.minWidth) {
                    activeNode.position.x = coordinate.x;
                    activeNode.width = currentWidth;
                }
                if (currentHeight >= activeNode.minHeight) {
                    activeNode.position.y = coordinate.y;
                    activeNode.height = currentHeight;
                }
                break;
            case 1: // 东北
                currentWidth = coordinate.x - nodeBoundingRect[3].x;
                currentHeight = nodeBoundingRect[3].y - coordinate.y;
                if (currentWidth >= activeNode.minWidth) {
                    activeNode.width = currentWidth;
                }
                if (currentHeight >= activeNode.minHeight) {
                    activeNode.position.y = coordinate.y;
                    activeNode.height = currentHeight;
                }
                break;
            case 2: // 东南
                currentWidth = coordinate.x - nodeBoundingRect[0].x;
                currentHeight = coordinate.y - nodeBoundingRect[0].y;
                if (currentWidth >= activeNode.minWidth) {
                    activeNode.width = currentWidth;
                }
                if (currentHeight >= activeNode.minHeight) {
                    activeNode.height = currentHeight;
                }
                break;
            case 3: // 西南
                currentWidth = nodeBoundingRect[1].x - coordinate.x;
                currentHeight = coordinate.y - nodeBoundingRect[1].y;
                if (currentWidth >= activeNode.minWidth) {
                    activeNode.position.x = coordinate.x;
                    activeNode.width = currentWidth;
                }
                if (currentHeight >= activeNode.minHeight) {
                    activeNode.height = currentHeight;
                }
                break;
            case 4: // 北
                currentHeight = nodeBoundingRect[2].y - coordinate.y;
                if (currentHeight >= activeNode.minHeight) {
                    activeNode.position.y = coordinate.y;
                    activeNode.height = currentHeight;
                }
                break;
            case 5: // 东
                currentWidth = coordinate.x - nodeBoundingRect[0].x;
                if (currentWidth >= activeNode.minWidth) {
                    activeNode.width = currentWidth;
                }
                break;
            case 6: // 南
                currentHeight = coordinate.y - nodeBoundingRect[0].y;
                if (currentHeight >= activeNode.minHeight) {
                    activeNode.height = currentHeight;
                }
                break;
            case 7: // 西
                currentWidth = nodeBoundingRect[2].x - coordinate.x;
                if (currentWidth >= activeNode.minWidth) {
                    activeNode.position.x = coordinate.x;
                    activeNode.width = currentWidth;
                }
                break;
        }
    }
    /**
     * 圆形
     * @param activeNode
     * @param anchorIndex
     * @param coordinate
     */
    function resizeCircleNode(activeNode, anchorIndex, coordinate) {
        var currentRadius = activeNode.radius;
        var minRadius = activeNode.minRadius;
        var center = activeNode.centerPoint;
        switch (anchorIndex) {
            case 0: // 西北
            case 1: // 东北
            case 2: // 东南
            case 3: // 西南
                currentRadius = Vector2d_12.default.copy(coordinate).substract(center).magnitude / Math.sqrt(2);
                break;
            case 4: // 北
            case 5: // 东
            case 6: // 南
            case 7: // 西
                currentRadius = Vector2d_12.default.copy(coordinate).substract(center).magnitude;
                break;
        }
        if (currentRadius >= minRadius) {
            activeNode.radius = currentRadius;
            activeNode.position.y = center.y - currentRadius;
            activeNode.position.x = center.x - currentRadius;
        }
    }
    exports.resizeInteraction = new ResizeInteraction();
    exports.default = ResizeInteraction;
});
define("interaction/collapseAndExpandInteraction", ["require", "exports", "interaction/Interaction"], function (require, exports, Interaction_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Interaction_9 = __importDefault(Interaction_9);
    /**
     * 折叠与展开操作
     */
    var CollapseAndExpandInteraction = /** @class */ (function (_super) {
        __extends(CollapseAndExpandInteraction, _super);
        function CollapseAndExpandInteraction() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.lastTimestamp = 0;
            _this.onMouseDown = function (canvas) {
                var now = Date.now();
                if (now - _this.lastTimestamp < 300) {
                    var activeNode = canvas.getActiveNodes()[0];
                    if (activeNode && activeNode.isGroup) {
                        activeNode.isExpanded = !activeNode.isExpanded;
                        activeNode.isUpdate = true;
                        activeNode.render();
                        canvas.repaint = true;
                    }
                }
                _this.lastTimestamp = now;
            };
            return _this;
        }
        CollapseAndExpandInteraction.prototype.handleEvent = function (canvas, event) {
            switch (event.type) {
                case 'mousedown':
                    this.onMouseDown(canvas);
                    break;
            }
        };
        return CollapseAndExpandInteraction;
    }(Interaction_9.default));
    exports.CollapseAndExpandInteraction = CollapseAndExpandInteraction;
    exports.collapseAndExpandInteraction = new CollapseAndExpandInteraction();
    exports.default = CollapseAndExpandInteraction;
});
define("element/Element", ["require", "exports", "utils/Vector2d"], function (require, exports, Vector2d_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Vector2d_13 = __importDefault(Vector2d_13);
    var Element = /** @class */ (function () {
        function Element() {
            this.position = new Vector2d_13.default();
            this.offset = new Vector2d_13.default();
            this.rotate = 0;
        }
        return Element;
    }());
    exports.Element = Element;
    exports.default = Element;
});
define("element/Triangle", ["require", "exports", "element/Element", "utils/Vector2d", "utils/Math2d"], function (require, exports, Element_1, Vector2d_14, Math2d_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Element_1 = __importDefault(Element_1);
    Vector2d_14 = __importDefault(Vector2d_14);
    Math2d_4 = __importDefault(Math2d_4);
    var Triangle = /** @class */ (function (_super) {
        __extends(Triangle, _super);
        function Triangle(options) {
            var _this = _super.call(this) || this;
            _this.width = options.width;
            _this.height = options.height;
            return _this;
        }
        Triangle.prototype.render = function (ctx) {
            var _a = this.position, x = _a.x, y = _a.y;
            var _b = this.offset, offsetX = _b.x, offsetY = _b.y;
            ctx.beginPath();
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(this.rotate);
            ctx.translate(offsetX, offsetY);
            ctx.moveTo(0, 0);
            ctx.lineTo(-this.height, +this.width / 2);
            ctx.lineTo(-this.height, -this.width / 2);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        };
        Triangle.prototype.isPointIn = function (point) {
            var p0 = new Vector2d_14.default(0, 0).add(this.offset).rotate(this.rotate);
            var p1 = new Vector2d_14.default(-this.height, +this.width / 2).add(this.offset).rotate(this.rotate);
            var p2 = new Vector2d_14.default(-this.height, -this.width / 2).add(this.offset).rotate(this.rotate);
            return Math2d_4.default.isPointInTriangle(Vector2d_14.default.copy(point).substract(this.position), p0, p1, p2);
        };
        return Triangle;
    }(Element_1.default));
    exports.Triangle = Triangle;
    exports.default = Triangle;
});
define("element/Rect", ["require", "exports", "element/Element", "utils/Vector2d", "utils/Math2d"], function (require, exports, Element_2, Vector2d_15, Math2d_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Element_2 = __importDefault(Element_2);
    Vector2d_15 = __importDefault(Vector2d_15);
    Math2d_5 = __importDefault(Math2d_5);
    var Rect = /** @class */ (function (_super) {
        __extends(Rect, _super);
        function Rect(options) {
            var _this = _super.call(this) || this;
            _this.fillStyle = '';
            _this.strokeStyle = '';
            _this.width = options.width;
            _this.height = options.height;
            return _this;
        }
        Rect.prototype.render = function (ctx) {
            var _a = this.position, x = _a.x, y = _a.y;
            var _b = this.offset, offsetX = _b.x, offsetY = _b.y;
            ctx.beginPath();
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(this.rotate);
            ctx.translate(offsetX, offsetY);
            if (this.fillStyle) {
                ctx.fillStyle = this.fillStyle;
                ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            }
            if (this.strokeStyle) {
                ctx.strokeStyle = this.strokeStyle;
                ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
            }
            ctx.restore();
        };
        Rect.prototype.isPointIn = function (point) {
            var p0 = new Vector2d_15.default(-this.width / 2, -this.height / 2).add(this.offset).rotate(this.rotate);
            var p1 = new Vector2d_15.default(-this.width / 2, this.height / 2).add(this.offset).rotate(this.rotate);
            var p2 = new Vector2d_15.default(this.width / 2, this.height / 2).add(this.offset).rotate(this.rotate);
            var p3 = new Vector2d_15.default(this.width / 2, -this.height / 2).add(this.offset).rotate(this.rotate);
            return Math2d_5.default.isPointInPolygon(Vector2d_15.default.copy(point).substract(this.position), [p0, p1, p2, p3]);
        };
        return Rect;
    }(Element_2.default));
    exports.Rect = Rect;
    exports.default = Rect;
});
define("element/Text", ["require", "exports", "element/Element", "utils/Vector2d", "utils/Math2d", "element/Rect"], function (require, exports, Element_3, Vector2d_16, Math2d_6, Rect_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Element_3 = __importDefault(Element_3);
    Vector2d_16 = __importDefault(Vector2d_16);
    Math2d_6 = __importDefault(Math2d_6);
    Rect_1 = __importDefault(Rect_1);
    var ctx = document.createElement('canvas').getContext('2d');
    var Text = /** @class */ (function (_super) {
        __extends(Text, _super);
        function Text(text) {
            var _this = _super.call(this) || this;
            _this.font = '14px sans-serif';
            _this.backgroundColor = '';
            _this.textAlign = 'center';
            _this.textBaseline = 'middle';
            _this.rectElement = new Rect_1.default({
                width: 0,
                height: 0
            });
            _this.text = text;
            return _this;
        }
        Text.prototype.render = function (ctx) {
            var _a = this.position, x = _a.x, y = _a.y;
            var _b = this.offset, offsetX = _b.x, offsetY = _b.y;
            ctx.save();
            if (this.backgroundColor) {
                this.rectElement.width = this.width;
                this.rectElement.height = this.height;
                this.rectElement.fillStyle = this.backgroundColor;
                this.rectElement.position.copy(this.position);
                this.rectElement.offset.copy(this.offset);
                this.rectElement.rotate = this.rotate;
                this.rectElement.render(ctx);
            }
            ctx.font = this.font;
            ctx.textAlign = this.textAlign;
            ctx.textBaseline = this.textBaseline;
            ctx.translate(x, y);
            ctx.rotate(this.rotate);
            ctx.fillText(this.text, offsetX, offsetY);
            ctx.restore();
        };
        Object.defineProperty(Text.prototype, "width", {
            get: function () {
                ctx.font = this.font;
                ctx.textAlign = this.textAlign;
                ctx.textBaseline = this.textBaseline;
                return ctx.measureText(this.text).width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text.prototype, "height", {
            get: function () {
                ctx.font = this.font;
                return parseInt(ctx.font);
            },
            enumerable: true,
            configurable: true
        });
        Text.prototype.isPointIn = function (point) {
            var textRectWidth = this.width;
            var textRectHeight = this.height;
            var p0 = new Vector2d_16.default(-textRectWidth / 2, -textRectHeight / 2).add(this.offset).rotate(this.rotate);
            var p1 = new Vector2d_16.default(-textRectWidth / 2, textRectHeight / 2).add(this.offset).rotate(this.rotate);
            var p2 = new Vector2d_16.default(textRectWidth / 2, textRectHeight / 2).add(this.offset).rotate(this.rotate);
            var p3 = new Vector2d_16.default(textRectWidth / 2, -textRectHeight / 2).add(this.offset).rotate(this.rotate);
            return Math2d_6.default.isPointInPolygon(Vector2d_16.default.copy(point).substract(this.position), [p0, p1, p2, p3]);
        };
        return Text;
    }(Element_3.default));
    exports.Text = Text;
    exports.default = Text;
});
define("element/Polyline", ["require", "exports", "element/Element", "utils/Vector2d", "utils/Math2d"], function (require, exports, Element_4, Vector2d_17, Math2d_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Element_4 = __importDefault(Element_4);
    Vector2d_17 = __importDefault(Vector2d_17);
    Math2d_7 = __importDefault(Math2d_7);
    var pointCopy = new Vector2d_17.default();
    var Polyline = /** @class */ (function (_super) {
        __extends(Polyline, _super);
        function Polyline() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.points = [];
            _this.lineWidth = 1;
            return _this;
        }
        Polyline.prototype.render = function (ctx) {
            if (this.points.length < 2)
                return;
            var _a = this.offset, offsetX = _a.x, offsetY = _a.y;
            ctx.save();
            ctx.lineWidth = this.lineWidth;
            ctx.beginPath();
            ctx.translate(offsetX, offsetY);
            this.points.forEach(function (point, index) {
                var x = point.x, y = point.y;
                if (index === 0) {
                    ctx.moveTo(x, y);
                }
                else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
            ctx.restore();
        };
        Polyline.prototype.isPointIn = function (point) {
            return Math2d_7.default.isPointInPolyline(pointCopy.copy(point).substract(this.offset), this.points, 0.1);
        };
        return Polyline;
    }(Element_4.default));
    exports.Polyline = Polyline;
    exports.default = Polyline;
});
define("animate/PathAnimate", ["require", "exports", "utils/Math2d"], function (require, exports, Math2d_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Math2d_8 = __importDefault(Math2d_8);
    var PathAnimate = /** @class */ (function () {
        function PathAnimate() {
            this.path = [];
            this.element = null;
            this.duration = 1000;
            this.progress = 0;
            this._lastPoint = null;
        }
        PathAnimate.prototype.update = function (timeDelta) {
            if (!this.element)
                return;
            if (this.duration <= 0)
                return;
            this.progress += timeDelta / this.duration;
            this.progress %= 1;
            var currentPoint = Math2d_8.default.getLinePoint(this.path, this.progress);
            if (!currentPoint)
                return;
            if (this._lastPoint) {
                var rotate = currentPoint.clone().substract(this._lastPoint).xAxisAngle();
                this.element.rotate = rotate;
                this.element.position.copy(currentPoint);
            }
            this._lastPoint = currentPoint;
        };
        PathAnimate.prototype.render = function (ctx) {
            if (!this.element)
                return;
            if (this.duration <= 0)
                return;
            this.element.render(ctx);
        };
        return PathAnimate;
    }());
    exports.PathAnimate = PathAnimate;
    exports.default = PathAnimate;
});
define("edge/Line", ["require", "exports", "utils/Vector2d", "graph/Edge", "utils/Math2d", "element/Triangle", "element/Text", "element/Polyline", "animate/PathAnimate", "utils/utils"], function (require, exports, Vector2d_18, Edge_1, Math2d_9, Triangle_1, Text_1, Polyline_1, PathAnimate_1, utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Vector2d_18 = __importDefault(Vector2d_18);
    Math2d_9 = __importDefault(Math2d_9);
    Triangle_1 = __importDefault(Triangle_1);
    Text_1 = __importDefault(Text_1);
    Polyline_1 = __importDefault(Polyline_1);
    PathAnimate_1 = __importDefault(PathAnimate_1);
    var ARROW_SIZE = { width: 8, height: 10 };
    var Line = /** @class */ (function (_super) {
        __extends(Line, _super);
        function Line(options) {
            var _this = _super.call(this, options) || this;
            _this.lineElement = new Polyline_1.default();
            _this.sourceArrowElement = new Triangle_1.default(ARROW_SIZE);
            _this.targetArrowElement = new Triangle_1.default(ARROW_SIZE);
            _this.textElement = new Text_1.default('');
            _this.animate = new PathAnimate_1.default();
            _this.dash = options.dash || false;
            _this.arrow = options.arrow || false;
            _this.doubleArrow = options.doubleArrow || false;
            _this.textElement.text = _this.text;
            _this.textElement.offset.y = -10;
            _this.style.lineWidth = 2;
            _this.animate.element = options.animateElement || null;
            _this.animate.duration = options.animateDuration || 0;
            return _this;
        }
        Line.prototype.isInRect = function () {
            return true;
        };
        Line.prototype.isPointIn = function () {
            var targetNode = this.getTargetNode();
            var sourceNode = this.getSourceNode();
            if (!targetNode.visible && !sourceNode.visible)
                return false;
            var canvas = this.canvas;
            if (!canvas)
                return false;
            if (!canvas.nativeEvent)
                return false;
            if (!this.begin || !this.end)
                return false;
            var event = canvas.nativeEvent;
            var viewCoordinate = new Vector2d_18.default(event.clientX, event.clientY);
            var pixelCoordinate = canvas.viewportToPixelCoordinate(viewCoordinate);
            // 判断点是否在线上
            if (this.lineElement.isPointIn(pixelCoordinate))
                return true;
            // 判断点是否在箭头上
            if (this.doubleArrow) {
                if (this.sourceArrowElement.isPointIn(pixelCoordinate))
                    return true;
                if (this.targetArrowElement.isPointIn(pixelCoordinate))
                    return true;
            }
            else if (this.arrow) {
                if (this.targetArrowElement.isPointIn(pixelCoordinate))
                    return true;
            }
            // 判断是否在文字上
            if (this.text && this.textElement.isPointIn(pixelCoordinate))
                return true;
            return false;
        };
        Line.prototype.render = function (ctx) {
            var targetNode = this.getTargetNode();
            var sourceNode = this.getSourceNode();
            ctx = ctx || (this.canvas && this.canvas.graphCanvasCtx);
            if (!ctx)
                return;
            if (sourceNode.visible || targetNode.visible) {
                var sourceCenter = sourceNode.centerPoint;
                var targetCenter = targetNode.centerPoint;
                var beginToEnd = [sourceCenter, targetCenter];
                if (utils_2.isCircleNode(sourceNode)) {
                    this.begin = intersectWithCircle(sourceCenter, sourceNode.radius, targetCenter);
                }
                else {
                    this.begin = intersectWithRect(beginToEnd, sourceNode.boundingRect);
                }
                if (!this.begin)
                    return;
                if (utils_2.isCircleNode(targetNode)) {
                    this.end = intersectWithCircle(targetCenter, targetNode.radius, sourceCenter);
                }
                else {
                    this.end = intersectWithRect(beginToEnd, targetNode.boundingRect);
                }
                if (!this.end)
                    return;
                var sourceToTarget = Vector2d_18.default.copy(this.end).substract(this.begin);
                ctx.save();
                ctx.strokeStyle = this.active ? this.style.activeColor : this.style.color;
                ctx.fillStyle = this.active ? this.style.activeColor : this.style.color;
                if /* 虚线 */ (this.dash) {
                    ctx.setLineDash([4, 4]);
                }
                // 画线
                this.lineElement.lineWidth = this.style.lineWidth;
                this.lineElement.points = [this.begin, this.end];
                this.lineElement.render(ctx);
                var rotate = sourceToTarget.xAxisAngle();
                if /* 文本 */ (this.text) {
                    this.textElement.text = this.text;
                    var lineCenter = Vector2d_18.default.copy(this.begin).add(Vector2d_18.default.copy(sourceToTarget).scale(1 / 2));
                    this.textElement.position.copy(lineCenter);
                    this.textElement.rotate = (-Math.PI / 2 <= rotate && rotate < Math.PI / 2) ? rotate : rotate - Math.PI;
                    this.textElement.render(ctx);
                }
                if /* 双向箭头 */ (this.doubleArrow) {
                    this.sourceArrowElement.position.copy(this.begin);
                    this.sourceArrowElement.rotate = rotate + Math.PI;
                    this.sourceArrowElement.render(ctx);
                    this.targetArrowElement.position.copy(this.end);
                    this.targetArrowElement.rotate = rotate;
                    this.targetArrowElement.render(ctx);
                }
                else if /* 单向箭头 */ (this.arrow) {
                    this.targetArrowElement.position.copy(this.end);
                    this.targetArrowElement.rotate = rotate;
                    this.targetArrowElement.render(ctx);
                }
                if (this.canvas) {
                    this.animate.path = [this.begin, this.end];
                    this.animate.update(this.canvas.clock.getDelta());
                    this.animate.render(ctx);
                }
                ctx.restore();
            }
        };
        Line.prototype.drawThumbnail = function (ctx) {
            this.render(ctx);
        };
        return Line;
    }(Edge_1.Edge));
    exports.Line = Line;
    /**
     * 获取线段与矩形的交点
     * @param line
     * @param rect
     */
    function intersectWithRect(line, rect) {
        var length = rect.length;
        for (var i = 0; i < length; i++) {
            var A = rect[i];
            var B = i === length - 1 ? rect[0] : rect[i + 1];
            if (Math2d_9.default.isIntersect(line, [A, B])) {
                return Math2d_9.default.getLineIntersect([A, B], line);
            }
        }
        return undefined;
    }
    /**
     * 获取从圆心出发的线段与该圆的交点
     * @param o 圆心坐标
     * @param radius 半径
     * @param point 线段的另一端点
     */
    function intersectWithCircle(o, radius, point) {
        var line = Vector2d_18.default.copy(point).substract(o);
        if (line.magnitude < radius)
            return undefined;
        var angle = line.xAxisAngle();
        return Vector2d_18.default.copy(o).add(new Vector2d_18.default(radius * Math.cos(angle), radius * Math.sin(angle)));
    }
    exports.default = Line;
});
define("interaction/CreateEdgeInteraction", ["require", "exports", "interaction/Interaction", "edge/Line"], function (require, exports, Interaction_10, Line_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Interaction_10 = __importDefault(Interaction_10);
    Line_1 = __importDefault(Line_1);
    /**
     * 创建连线
     */
    var CreateEdgeInteraction = /** @class */ (function (_super) {
        __extends(CreateEdgeInteraction, _super);
        function CreateEdgeInteraction(onCreate) {
            var _this = _super.call(this) || this;
            _this.onMouseUp = function (canvas) {
                if (_this.edge) {
                    canvas.rootNode.getDescendantDF(function (node) {
                        if (node.isPointIn()) {
                            _this.targetNode = node;
                            return true;
                        }
                    });
                    if (_this.targetNode && _this.sourceNode &&
                        _this.targetNode !== _this.sourceNode &&
                        !_this.targetNode.hasDescendant(_this.sourceNode) &&
                        !_this.sourceNode.hasDescendant(_this.targetNode)) {
                        _this.edge.targetNode = _this.targetNode;
                        _this.targetNode.addEdge(_this.edge);
                        canvas.virtualNode.removeEdge(_this.edge);
                        _this.targetNode.isUpdate = true;
                        _this.edge = undefined;
                        _this.targetNode = undefined;
                        _this.sourceNode = undefined;
                    }
                    else {
                        canvas.removeEdge(_this.edge);
                        _this.edge = undefined;
                        _this.targetNode = undefined;
                        _this.sourceNode = undefined;
                    }
                }
                else {
                    canvas.rootNode.getDescendantDF(function (node) {
                        if (node.isPointIn()) {
                            _this.sourceNode = node;
                            return true;
                        }
                    });
                    if (_this.sourceNode) {
                        _this.edge = _this.onCreate(_this.sourceNode, canvas.virtualNode);
                        canvas.addEdge(_this.edge);
                    }
                }
                canvas.repaint = true;
            };
            _this.onMouseMove = function (canvas) {
                canvas.virtualNode.position = canvas.viewportToPixelCoordinate(canvas.mousemovePosition);
                if (_this.sourceNode) {
                    canvas.virtualNode.isUpdate = true;
                }
                canvas.repaint = true;
            };
            _this.onUninstall = function (canvas) {
                if (_this.edge) {
                    canvas.removeEdge(_this.edge);
                    _this.edge = undefined;
                    _this.targetNode = undefined;
                    _this.sourceNode = undefined;
                }
                canvas.repaint = true;
            };
            _this.onCreate = onCreate || (function (sourceNode, targetNode) { return new Line_1.default({
                text: '',
                sourceNode: sourceNode,
                targetNode: targetNode,
                arrow: true,
                dash: false,
                doubleArrow: false
            }); });
            return _this;
        }
        CreateEdgeInteraction.prototype.handleEvent = function (canvas, event) {
            switch (event.type) {
                case 'mouseup':
                    this.onMouseUp(canvas);
                    break;
                case 'mousemove':
                    this.onMouseMove(canvas);
                    break;
            }
        };
        return CreateEdgeInteraction;
    }(Interaction_10.default));
    exports.CreateEdgeInteraction = CreateEdgeInteraction;
    exports.default = CreateEdgeInteraction;
});
define("edge/L", ["require", "exports", "utils/Vector2d", "graph/Edge", "utils/Math2d", "element/Triangle", "element/Text", "element/Polyline", "animate/PathAnimate"], function (require, exports, Vector2d_19, Edge_2, Math2d_10, Triangle_2, Text_2, Polyline_2, PathAnimate_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Math2d_10 = __importDefault(Math2d_10);
    Triangle_2 = __importDefault(Triangle_2);
    Text_2 = __importDefault(Text_2);
    Polyline_2 = __importDefault(Polyline_2);
    PathAnimate_2 = __importDefault(PathAnimate_2);
    var sourceJoinPointCopy = new Vector2d_19.Vector2d();
    var targetNodeCenterCopy = new Vector2d_19.Vector2d();
    var ARROW_SIZE = { width: 8, height: 10 };
    /**
     * L型线段
     */
    var L = /** @class */ (function (_super) {
        __extends(L, _super);
        function L(options) {
            var _this = _super.call(this, options) || this;
            _this.middlePoints = [];
            _this.centerPoint = null;
            _this.sourceArrowElement = new Triangle_2.default(ARROW_SIZE);
            _this.targetArrowElement = new Triangle_2.default(ARROW_SIZE);
            _this.textElement = new Text_2.default('');
            _this.lineElement = new Polyline_2.default();
            _this.animate = new PathAnimate_2.default();
            _this.isInRect = function () {
                return true;
            };
            _this.dash = options.dash || false;
            _this.arrow = options.arrow || false;
            _this.doubleArrow = options.doubleArrow || false;
            _this.style.lineWidth = 2;
            _this.textElement.text = _this.text;
            _this.animate.element = options.animateElement || null;
            _this.animate.duration = options.animateDuration || 0;
            return _this;
        }
        L.prototype.isPointIn = function () {
            var sourceNode = this.getSourceNode();
            var targetNode = this.getTargetNode();
            if (!sourceNode.visible && !targetNode.visible)
                return false;
            var canvas = this.canvas;
            if (!canvas)
                return false;
            if (!canvas.nativeEvent)
                return false;
            if (!this.sourceJoinPoint || !this.targetJoinPoint)
                return false;
            var event = canvas.nativeEvent;
            var viewCoordinate = new Vector2d_19.Vector2d(event.clientX, event.clientY);
            var pixelCoordinate = canvas.viewportToPixelCoordinate(viewCoordinate);
            // 判断点是否在线上
            if (this.lineElement.isPointIn(pixelCoordinate))
                return true;
            // 判断点是否在箭头上
            if (this.doubleArrow) {
                if (this.targetArrowElement.isPointIn(pixelCoordinate))
                    return true;
                if (this.sourceArrowElement.isPointIn(pixelCoordinate))
                    return true;
            }
            else if (this.arrow) {
                if (this.targetArrowElement.isPointIn(pixelCoordinate))
                    return true;
            }
            // 判断是否在文字上
            if (this.text && this.textElement.isPointIn(pixelCoordinate))
                return true;
            return false;
        };
        L.prototype.render = function (ctx) {
            var _this = this;
            ctx = ctx || (this.canvas && this.canvas.graphCanvasCtx);
            if (!ctx)
                return;
            var sourceNode = this.getSourceNode();
            var targetNode = this.getTargetNode();
            // 两端节点都存在且至少有一个是可见的
            if (sourceNode.visible || targetNode.visible) {
                var sourceJoinPoints = sourceNode.boundingJoinPoints;
                var targetJoinPoints_1 = targetNode.boundingJoinPoints;
                // 计算出两个节点间距离最近的连接点
                var minDistance_1 = 0;
                this.sourceJoinPoint = undefined;
                this.targetJoinPoint = undefined;
                sourceJoinPoints.forEach(function (point1) {
                    targetJoinPoints_1.forEach(function (point2) {
                        var distance = point1.distance(point2);
                        if (minDistance_1 > distance || !_this.sourceJoinPoint || !_this.targetJoinPoint) {
                            minDistance_1 = distance;
                            _this.sourceJoinPoint = point1;
                            _this.targetJoinPoint = point2;
                        }
                    });
                });
                if (!this.sourceJoinPoint || !this.targetJoinPoint)
                    return;
                var sourceJoinPoint = this.sourceJoinPoint;
                var targetJoinPoint = this.targetJoinPoint;
                sourceJoinPointCopy.copy(sourceJoinPoint);
                var outDirection = sourceJoinPointCopy.substract(sourceNode.centerPoint).normalize();
                targetNodeCenterCopy.copy(targetNode.centerPoint);
                var inDirection = targetNodeCenterCopy.substract(targetJoinPoint).normalize();
                if (outDirection.x === 1 || outDirection.x === -1) {
                    if (inDirection.x === 1 || inDirection.x === -1) {
                        var middleX = (sourceJoinPoint.x + targetJoinPoint.x) / 2;
                        this.middlePoints = [new Vector2d_19.Vector2d(middleX, sourceJoinPoint.y), new Vector2d_19.Vector2d(middleX, targetJoinPoint.y)];
                    }
                    else {
                        this.middlePoints = [new Vector2d_19.Vector2d(targetJoinPoint.x, sourceJoinPoint.y)];
                    }
                }
                else {
                    if (inDirection.x === 1 || inDirection.x === -1) {
                        this.middlePoints = [new Vector2d_19.Vector2d(sourceJoinPoint.x, targetJoinPoint.y)];
                    }
                    else {
                        var middleY = (sourceJoinPoint.y + targetJoinPoint.y) / 2;
                        this.middlePoints = [new Vector2d_19.Vector2d(sourceJoinPoint.x, middleY), new Vector2d_19.Vector2d(targetJoinPoint.x, middleY)];
                    }
                }
                ctx.save();
                ctx.strokeStyle = this.active ? this.style.activeColor : this.style.color;
                ctx.fillStyle = this.active ? this.style.activeColor : this.style.color;
                if /* 虚线 */ (this.dash) {
                    ctx.setLineDash([4, 4]);
                }
                this.lineElement.lineWidth = this.style.lineWidth;
                this.lineElement.points = __spreadArrays([sourceJoinPoint], this.middlePoints, [targetJoinPoint]);
                this.lineElement.render(ctx);
                if /* 文本 */ (this.text) {
                    this.centerPoint = Math2d_10.default.getLinePoint(__spreadArrays([sourceJoinPoint], this.middlePoints, [targetJoinPoint]), 0.5);
                    if (this.centerPoint) {
                        this.textElement.text = this.text;
                        this.textElement.font = '14px sans-serif';
                        this.textElement.backgroundColor = 'rgba(255,255,255,0.8)';
                        this.textElement.position.copy(this.centerPoint);
                        this.textElement.render(ctx);
                    }
                }
                if /* 双向箭头 */ (this.doubleArrow) {
                    this.arrowStart = targetJoinPoint;
                    this.targetArrowElement.position.copy(targetJoinPoint);
                    this.targetArrowElement.rotate = inDirection.xAxisAngle();
                    this.targetArrowElement.render(ctx);
                    this.sourceArrowElement.position.copy(sourceJoinPoint);
                    this.sourceArrowElement.rotate = outDirection.xAxisAngle() + Math.PI;
                    this.sourceArrowElement.render(ctx);
                }
                else if /* 单向箭头 */ (this.arrow) {
                    this.arrowStart = targetJoinPoint;
                    this.targetArrowElement.position.copy(targetJoinPoint);
                    this.targetArrowElement.rotate = inDirection.xAxisAngle();
                    this.targetArrowElement.render(ctx);
                }
                if (this.canvas) {
                    this.animate.path = __spreadArrays([sourceJoinPoint], this.middlePoints, [targetJoinPoint]);
                    this.animate.update(this.canvas.clock.getDelta());
                    this.animate.render(ctx);
                }
                ctx.restore();
            }
        };
        L.prototype.drawThumbnail = function (ctx) {
            this.render(ctx);
        };
        return L;
    }(Edge_2.Edge));
    exports.L = L;
    exports.default = L;
});
define("mode/modes", ["require", "exports", "interaction/dragInteraction", "interaction/dropInteraction", "interaction/moveCanvasInteraction", "interaction/wheelZoomInteraction", "interaction/selectInteraction", "interaction/areaPickInteraction", "interaction/createGroupInteraction", "interaction/resizeInteraction", "interaction/collapseAndExpandInteraction", "interaction/CreateEdgeInteraction", "edge/L"], function (require, exports, dragInteraction_2, dropInteraction_1, moveCanvasInteraction_1, wheelZoomInteraction_1, selectInteraction_2, areaPickInteraction_1, createGroupInteraction_1, resizeInteraction_1, collapseAndExpandInteraction_1, CreateEdgeInteraction_1, L_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    dragInteraction_2 = __importDefault(dragInteraction_2);
    dropInteraction_1 = __importDefault(dropInteraction_1);
    moveCanvasInteraction_1 = __importDefault(moveCanvasInteraction_1);
    wheelZoomInteraction_1 = __importDefault(wheelZoomInteraction_1);
    selectInteraction_2 = __importDefault(selectInteraction_2);
    areaPickInteraction_1 = __importDefault(areaPickInteraction_1);
    createGroupInteraction_1 = __importDefault(createGroupInteraction_1);
    resizeInteraction_1 = __importDefault(resizeInteraction_1);
    collapseAndExpandInteraction_1 = __importDefault(collapseAndExpandInteraction_1);
    CreateEdgeInteraction_1 = __importDefault(CreateEdgeInteraction_1);
    L_1 = __importDefault(L_1);
    // 默认模式
    exports.MODE_DEFAULT = 'mode.default';
    // 查看模式
    exports.MODE_VIEW = 'mode.view';
    // 创建连线
    exports.MODE_CREATE_EDGE = 'mode.create.edge';
    // 创建L型连线
    exports.MODE_CREATE_L = 'mode.create.L';
    // 框选模式
    exports.MODE_AREA_PICK = 'mode.area.pick';
    // 边框模式
    exports.MODE_BORDER = 'mode.border';
    /**
     * 模式管理器
     */
    var ModeManager = /** @class */ (function () {
        function ModeManager() {
            this.modes = {};
        }
        /**
         * 注册一个模式
         * @param modeName
         * @param interactions
         */
        ModeManager.prototype.registerMode = function (modeName, interactions) {
            this.modes[modeName] = interactions;
        };
        /**
         * 注销一个模式
         * @param modeName
         */
        ModeManager.prototype.unregisterMode = function (modeName) {
            delete this.modes[modeName];
        };
        /**
         * 使用
         * @param modeName
         */
        ModeManager.prototype.use = function (modeName) {
            return this.modes[modeName] || [];
        };
        /**
         * 检车是否存在指定模式
         * @param modeName
         */
        ModeManager.prototype.hasMode = function (modeName) {
            return this.modes.hasOwnProperty(modeName);
        };
        return ModeManager;
    }());
    var modeManager = new ModeManager();
    modeManager.registerMode(exports.MODE_DEFAULT, [
        new selectInteraction_2.default(),
        new dragInteraction_2.default(),
        new dropInteraction_1.default(),
        new wheelZoomInteraction_1.default(),
        new collapseAndExpandInteraction_1.default()
    ]);
    modeManager.registerMode(exports.MODE_VIEW, [
        new moveCanvasInteraction_1.default(),
        new wheelZoomInteraction_1.default()
    ]);
    modeManager.registerMode(exports.MODE_CREATE_EDGE, [
        new selectInteraction_2.default(),
        new wheelZoomInteraction_1.default(),
        new CreateEdgeInteraction_1.default(),
        new moveCanvasInteraction_1.default()
    ]);
    modeManager.registerMode(exports.MODE_CREATE_L, [
        new selectInteraction_2.default(),
        new wheelZoomInteraction_1.default(),
        new CreateEdgeInteraction_1.default(function (sourceNode, targetNode) {
            return new L_1.default({
                sourceNode: sourceNode,
                targetNode: targetNode,
                arrow: true
            });
        }),
        new moveCanvasInteraction_1.default()
    ]);
    modeManager.registerMode(exports.MODE_AREA_PICK, [
        new wheelZoomInteraction_1.default(),
        new areaPickInteraction_1.default(),
        new createGroupInteraction_1.default()
    ]);
    modeManager.registerMode(exports.MODE_BORDER, [
        new resizeInteraction_1.default(),
        new wheelZoomInteraction_1.default()
    ]);
    exports.default = modeManager;
});
define("layout/Layout", ["require", "exports", "utils/Vector2d"], function (require, exports, Vector2d_20) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Vector2d_20 = __importDefault(Vector2d_20);
    var Transport = /** @class */ (function () {
        function Transport() {
            this.destination = new Vector2d_20.default();
            this.distance = new Vector2d_20.default();
            this.speed = new Vector2d_20.default();
            this.node = null;
            this.duration = 0;
            this.pass = 0;
            this.complete = false;
        }
        Transport.prototype.update = function (timeDelta) {
            if (!this.node || this.complete)
                return;
            this.pass += timeDelta;
            var timeRemain = this.duration > this.pass ? this.duration - this.pass : 0;
            this.distance.copy(this.destination).substract(this.node.centerPoint);
            if (timeDelta < timeRemain) {
                if (this.distance.magnitude > 1) {
                    this.speed.copy(this.distance).scale(1 / timeRemain * timeDelta);
                    this.node.translate(this.speed);
                }
                else {
                    this.complete = true;
                }
            }
            else {
                this.node.translate(this.distance);
                this.complete = true;
            }
        };
        return Transport;
    }());
    exports.Transport = Transport;
    var Layout = /** @class */ (function () {
        function Layout(canvas) {
            this.transports = [];
            this.canvas = canvas;
        }
        /**
         * 更新
         */
        Layout.prototype.update = function () {
            var activeTrans = this.transports.filter(function (item) { return !item.complete; });
            this.canvas.optimizeNode();
            if (!activeTrans.length)
                return false;
            var timeDelta = this.canvas.clock.getDelta();
            activeTrans.forEach(function (transport) { return transport.update(timeDelta); });
            return true;
        };
        return Layout;
    }());
    exports.Layout = Layout;
    exports.default = Layout;
});
define("core/Clock", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Clock = /** @class */ (function () {
        function Clock() {
            this.current = 0;
            this.delta = 0;
        }
        Clock.prototype.update = function () {
            var current = (typeof performance === 'undefined' ? Date : performance).now();
            this.delta = this.current ? current - this.current : 0;
            this.current = current;
        };
        Clock.prototype.getDelta = function () {
            return this.delta;
        };
        return Clock;
    }());
    exports.Clock = Clock;
    exports.default = Clock;
});
define("core/Canvas", ["require", "exports", "events/eventEmitter", "utils/Vector2d", "utils/utils", "resize-observer-polyfill", "graph/VirtualNode", "mode/modes", "core/Clock", "./canvas.less"], function (require, exports, eventEmitter_1, Vector2d_21, utils_3, resize_observer_polyfill_1, VirtualNode_1, modes_1, Clock_1, canvas_less_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    eventEmitter_1 = __importDefault(eventEmitter_1);
    Vector2d_21 = __importDefault(Vector2d_21);
    resize_observer_polyfill_1 = __importDefault(resize_observer_polyfill_1);
    VirtualNode_1 = __importDefault(VirtualNode_1);
    modes_1 = __importStar(modes_1);
    Clock_1 = __importDefault(Clock_1);
    canvas_less_1 = __importDefault(canvas_less_1);
    /**
     * 原生事件监听列表
     */
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
    var Canvas = /** @class */ (function () {
        function Canvas(options) {
            var _this = this;
            this.mounted = false;
            this._running = false;
            this._animationFrameId = 0;
            this.name = 'application';
            this.eventEmitter = new eventEmitter_1.default();
            this.nativeEvent = null;
            this.optimize = true;
            /**
             * 时钟
             */
            this.clock = new Clock_1.default();
            // 交互模式
            this.interactionMode = modes_1.MODE_DEFAULT;
            // canvas与div的容器
            this.wrapper = document.createElement('div');
            // 主画布(用于绘制图形) 位于图层最底层
            this.graphCanvas = document.createElement('canvas');
            // 交互画布(交互时用到的辅助画布) 位于图层最顶层
            this.topCanvas = document.createElement('canvas');
            /**
             * 交互画布是否已挂载
             */
            this.topCanvasMounted = false;
            // 辅助节点(不需要实际渲染的)
            this.virtualNode = new VirtualNode_1.default({});
            this.mousedownPosition = new Vector2d_21.default();
            this.mouseupPosition = new Vector2d_21.default();
            this.mousemovePosition = new Vector2d_21.default();
            // 画布
            this.viewWidth = 0;
            this.viewHeight = 0;
            this.canvasWidth = 0;
            this.canvasHeight = 0;
            // 重绘
            this.repaint = false;
            // 开启动画
            this.animate = false;
            /**
             * 画布根节点（虚拟节点，不可见）
             */
            this.rootNode = new VirtualNode_1.default({
                id: 'rootNode'
            });
            /**
             * 插件列表
             */
            this.plugins = [];
            /**
             * 布局
             */
            this.layout = null;
            /**
             * 原生事件分发处理
             */
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
        /**
         * 注册模式
         * @param modeName
         * @param interactions
         */
        Canvas.registerMode = function (modeName, interactions) {
            modes_1.default.registerMode(modeName, interactions);
        };
        Object.defineProperty(Canvas.prototype, "stage", {
            /**
             * 舞台
             */
            get: function () {
                return this.rootNode;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置缩放
         * @param scale
         */
        Canvas.prototype.setZoom = function (scale) {
            this.canvasScale = scale;
            this.canvasWidth = this.viewWidth / this.canvasScale;
            this.canvasHeight = this.viewHeight / this.canvasScale;
            this.initCanvas();
            this.optimizeNode();
            this.repaint = true;
        };
        /**
         * 原生事件监听
         */
        Canvas.prototype.nativeEventInit = function () {
            var _this = this;
            nativeEvents.forEach(function (eventType) {
                _this.wrapper.addEventListener(eventType, _this.handleNativeEvent);
            });
            document.addEventListener('mousemove', this.handleNativeEvent);
            document.addEventListener('mouseup', this.handleNativeEvent);
        };
        /**
         * 销毁
         */
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
            // 销毁插件
            while (this.plugins.length) {
                var plugin = this.plugins.pop();
                if (plugin) {
                    plugin.canvas = null;
                    plugin.destroy();
                }
            }
        };
        /**
         * 添加节点
         * @param node
         */
        Canvas.prototype.addNode = function (node) {
            if (this.rootNode.hasChild(node))
                return;
            node.visible = node.isInRect(this.canvasVisibleRect);
            this.rootNode.addChild(node);
            this.repaint = true;
        };
        /**
         * 将节点置顶显示
         * @param node
         */
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
        /**
         * 获取激活状态的节点列表
         */
        Canvas.prototype.getActiveNodes = function () {
            return this.rootNode.getActiveDescendant();
        };
        /**
         * 删除节点
         * @param node
         * @param destroy 是否销毁,默认true
         */
        Canvas.prototype.removeNode = function (node, destroy) {
            var _this = this;
            if (destroy === void 0) { destroy = true; }
            if (!this.rootNode.hasDescendant(node))
                return;
            if (!node.parent)
                return;
            node.parent.removeChild(node, destroy);
            // 把相连的edge也删掉
            var edges = __spreadArrays(node.edges);
            edges.forEach(function (edge) {
                _this.removeEdge(edge);
            });
            this.repaint = true;
        };
        /**
         * 删除所有节点
         * @param destroy 是否销毁,默认true
         */
        Canvas.prototype.removeAllNode = function (destroy) {
            if (destroy === void 0) { destroy = true; }
            this.rootNode.removeAllChild(destroy);
        };
        /**
         * 添加边线
         * @param edge
         */
        Canvas.prototype.addEdge = function (edge) {
            edge.sourceNode.addEdge(edge);
            edge.targetNode.addEdge(edge);
            edge.canvas = this;
            this.repaint = true;
        };
        /**
         * 删除边线
         * @param edge
         */
        Canvas.prototype.removeEdge = function (edge) {
            edge.sourceNode.removeEdge(edge);
            edge.targetNode.removeEdge(edge);
            edge.canvas = undefined;
            this.repaint = true;
        };
        /**
         * 获取激活状态的边线列表
         */
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
        /**
         * 获取画布容器边界盒
         */
        Canvas.prototype.getBoundingClientRect = function () {
            this.containerClientRect = this.container.getBoundingClientRect();
            return this.containerClientRect;
        };
        /**
         * 获取画布内容边界盒
         */
        Canvas.prototype.getContentBoundingRect = function () {
            var leftTop = new Vector2d_21.default(0, 0);
            var rightBottom = new Vector2d_21.default(this.canvasWidth, this.canvasHeight);
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
            return [leftTop, new Vector2d_21.default(rightBottom.x, leftTop.y), rightBottom, new Vector2d_21.default(leftTop.x, rightBottom.y)];
        };
        /**
         * 将视口坐标转换成画布坐标。注：不考虑缩放
         * @param coordinate 鼠标位于视口的坐标
         */
        Canvas.prototype.viewportToCanvasCoordinate = function (coordinate) {
            var _a = this.containerClientRect || this.getBoundingClientRect(), top = _a.top, left = _a.left;
            return coordinate.clone().substract(new Vector2d_21.default(left, top));
        };
        /**
         * 画布坐标转换成视口坐标
         * @param coordinate
         */
        Canvas.prototype.canvasToViewportCoordinate = function (coordinate) {
            var _a = this.containerClientRect || this.getBoundingClientRect(), top = _a.top, left = _a.left;
            return coordinate.clone().add(new Vector2d_21.default(left, top));
        };
        /**
         * 将画布坐标转换成像素坐标
         * @param coordinate 画布坐标
         */
        Canvas.prototype.canvasToPixelCoordinate = function (coordinate) {
            return coordinate.clone().scale(1 / this.canvasScale);
        };
        /**
         * 将像素坐标转换成画布坐标
         * @param coordinate 像素坐标
         */
        Canvas.prototype.pixelToCanvasCoordinate = function (coordinate) {
            return coordinate.clone().scale(this.canvasScale);
        };
        /**
         * 将视口坐标转换成像素坐标
         * @param coordinate
         */
        Canvas.prototype.viewportToPixelCoordinate = function (coordinate) {
            return this.canvasToPixelCoordinate(this.viewportToCanvasCoordinate(coordinate));
        };
        /**
         * 将像素坐标转换成视口坐标
         * @param coordinate
         */
        Canvas.prototype.pixelToViewportCoordinate = function (coordinate) {
            return this.canvasToViewportCoordinate(this.pixelToCanvasCoordinate(coordinate));
        };
        Object.defineProperty(Canvas.prototype, "canvasVisibleRect", {
            /**
             * 画布可见边界盒
             */
            get: function () {
                return [
                    new Vector2d_21.default(0, 0),
                    new Vector2d_21.default(this.canvasWidth, 0),
                    new Vector2d_21.default(this.canvasWidth, this.canvasHeight),
                    new Vector2d_21.default(0, this.canvasHeight) // 左下
                ];
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 画布放大
         * @param focus 缩放焦点相对于视口的坐标
         */
        Canvas.prototype.zoomIn = function (focus) {
            focus = focus ? this.viewportToCanvasCoordinate(focus) : new Vector2d_21.default(this.viewWidth / 2, this.viewHeight / 2);
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
        /**
         * 画布缩小
         * @param focus 缩放焦点相对于视口的坐标
         */
        Canvas.prototype.zoomOut = function (focus) {
            // 默认:画布中心
            focus = focus ? this.viewportToCanvasCoordinate(focus) : new Vector2d_21.default(this.viewWidth / 2, this.viewHeight / 2);
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
        /**
         * 设置模式
         * @param mode
         */
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
        /**
         * 优化节点显示
         */
        Canvas.prototype.optimizeNode = function () {
            if (!this.optimize)
                return;
            // 优化：缓存画布可视矩形
            var canvasRect = this.canvasVisibleRect;
            this.rootNode.getDescendantDF(function (node) {
                node.visible = node.isInRect(canvasRect);
            });
        };
        /**
         * 使用插件
         * @param plugin
         */
        Canvas.prototype.use = function (plugin) {
            plugin.install(this);
            this.plugins.push(plugin);
        };
        /**
         * 初始化画布
         */
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
        /**
         * 挂载
         */
        Canvas.prototype.mount = function () {
            if (this.mounted)
                return;
            this.wrapper.appendChild(this.graphCanvas);
            this.container.appendChild(this.wrapper);
            this.eventEmitter.emit('canvas:mounted');
            this.mounted = true;
        };
        /**
         * 卸载
         */
        Canvas.prototype.unmount = function () {
            if (!this.mounted)
                return;
            this.container.removeChild(this.wrapper);
            this.mounted = false;
        };
        /**
         * 交互画布挂载
         */
        Canvas.prototype.topCanvasMount = function () {
            if (this.topCanvasMounted)
                return;
            this.wrapper.appendChild(this.topCanvas);
            this.topCanvasMounted = true;
        };
        /**
         * 交互画布卸载
         */
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
                // 判断是否需要重绘
                if (_this.repaint || _this.animate) {
                    _this.graphCanvasCtx.clearRect(0, 0, _this.viewWidth, _this.viewHeight);
                    _this.graphCanvasCtx.save();
                    _this.graphCanvasCtx.scale(_this.canvasScale, _this.canvasScale);
                    // 布局更新
                    var repaint = _this.layout && _this.layout.update() || false;
                    _this.render();
                    _this.graphCanvasCtx.restore();
                    // 交互更新
                    modes_1.default.use(_this.interactionMode).forEach(function (action) {
                        action.onUpdate(_this);
                    });
                    // 插件更新
                    _this.plugins.forEach(function (plugin) {
                        plugin.enable && plugin.update();
                    });
                    _this.repaint = repaint;
                }
                _this.loop();
            });
        };
        /**
         * 渲染节点
         */
        Canvas.prototype.render = function () {
            var _this = this;
            if (this.renderType === 'CANVAS') {
                this.rootNode.getDescendantBF(function (node) {
                    var nodeVisible = node.visible;
                    // 节点连线渲染
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
                    // 裁剪层级高的节点区域
                    if (utils_3.isRectNode(node) && node.visible) {
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
});
define("node/CircleCanvasGroup", ["require", "exports", "node/CircleCanvasNode"], function (require, exports, CircleCanvasNode_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    CircleCanvasNode_1 = __importDefault(CircleCanvasNode_1);
    /**
     * 圆形组
     */
    var CircleCanvasGroup = /** @class */ (function (_super) {
        __extends(CircleCanvasGroup, _super);
        function CircleCanvasGroup(options) {
            var _this = _super.call(this, options) || this;
            _this.isGroup = true;
            _this.canResize = true;
            if (typeof options.isExpanded === 'boolean') {
                _this.isExpanded = options.isExpanded;
            }
            return _this;
        }
        CircleCanvasGroup.prototype.render = function (ctx) { };
        CircleCanvasGroup.prototype.update = function (ctx) {
            ctx = ctx || (this.canvas && this.canvas.graphCanvasCtx);
            if (!ctx)
                return;
            var _a = this.getPosition(), x = _a.x, y = _a.y;
            ctx.beginPath();
            ctx.arc(x + this.radius, y + this.radius, this.radius, 0, 2 * Math.PI);
            ctx.save();
            if (this.active) {
                ctx.shadowBlur = 5;
                ctx.shadowColor = this.active ? this.style.activeColor : this.style.color;
            }
            ctx.strokeStyle = this.active ? this.style.activeColor : this.style.color;
            ctx.stroke();
            ctx.restore();
        };
        CircleCanvasGroup.prototype.drawThumbnail = function (ctx) {
            var _a = this.centerPoint, x = _a.x, y = _a.y;
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, this.radius, 0, Math.PI * 2);
            ctx.strokeStyle = this.active ? this.style.activeColor : this.style.color;
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.restore();
        };
        CircleCanvasGroup.shape = 'circle';
        return CircleCanvasGroup;
    }(CircleCanvasNode_1.default));
    exports.CircleCanvasGroup = CircleCanvasGroup;
    exports.default = CircleCanvasGroup;
});
define("element/Image", ["require", "exports", "element/Element", "utils/utils", "utils/Vector2d", "utils/Math2d"], function (require, exports, Element_5, utils_4, Vector2d_22, Math2d_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Element_5 = __importDefault(Element_5);
    Vector2d_22 = __importDefault(Vector2d_22);
    Math2d_11 = __importDefault(Math2d_11);
    var Img = /** @class */ (function (_super) {
        __extends(Img, _super);
        function Img(source) {
            var _this = _super.call(this) || this;
            if (typeof source === 'string') {
                (function () { return __awaiter(_this, void 0, void 0, function () {
                    var _a, error_1;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                _a = this;
                                return [4 /*yield*/, utils_4.imgLoad(source)];
                            case 1:
                                _a.image = _b.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                error_1 = _b.sent();
                                console.error(error_1);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); })();
            }
            else {
                _this.image = source;
            }
            return _this;
        }
        Img.prototype.render = function (ctx) {
            if (!this.image)
                return;
            var _a = this.image, width = _a.width, height = _a.height;
            var _b = this.position, x = _b.x, y = _b.y;
            var _c = this.offset, offsetX = _c.x, offsetY = _c.y;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(this.rotate);
            ctx.translate(offsetX, offsetY);
            ctx.drawImage(this.image, -width / 2, -height / 2);
            ctx.restore();
        };
        Img.prototype.isPointIn = function (point) {
            if (!this.image)
                return false;
            var _a = this.image, width = _a.width, height = _a.height;
            var p0 = new Vector2d_22.default(-width / 2, -height / 2).add(this.offset).rotate(this.rotate);
            var p1 = new Vector2d_22.default(-width / 2, +height / 2).add(this.offset).rotate(this.rotate);
            var p2 = new Vector2d_22.default(+width / 2, +height / 2).add(this.offset).rotate(this.rotate);
            var p3 = new Vector2d_22.default(+width / 2, -height / 2).add(this.offset).rotate(this.rotate);
            return Math2d_11.default.isPointInPolygon(Vector2d_22.default.copy(point).substract(this.position), [p0, p1, p2, p3]);
        };
        return Img;
    }(Element_5.default));
    exports.Img = Img;
    exports.default = Img;
});
define("plugin/MiniMap", ["require", "exports", "plugin/Plugin", "utils/Vector2d", "utils/utils"], function (require, exports, Plugin_2, Vector2d_23, utils_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Plugin_2 = __importDefault(Plugin_2);
    Vector2d_23 = __importDefault(Vector2d_23);
    var lastPoint = new Vector2d_23.default();
    var currentPoint = new Vector2d_23.default();
    var offset = new Vector2d_23.default();
    var MiniMap = /** @class */ (function (_super) {
        __extends(MiniMap, _super);
        function MiniMap(width, height) {
            if (width === void 0) { width = 200; }
            if (height === void 0) { height = 200; }
            var _this = _super.call(this) || this;
            _this.canvasElement = document.createElement('canvas');
            _this.handleMouseMove = utils_5.throttle(function (e) {
                if (e.buttons !== 1 || !_this.canvas || lastPoint.magnitude === 0) {
                    lastPoint.x = e.offsetX;
                    lastPoint.y = e.offsetY;
                    return;
                }
                currentPoint.x = e.offsetX;
                currentPoint.y = e.offsetY;
                // move...
                var boundingRect = _this.canvas.getContentBoundingRect();
                var width = boundingRect[2].x - boundingRect[0].x;
                var height = boundingRect[2].y - boundingRect[0].y;
                var scale = Math.max(width / _this.width, height / _this.height);
                offset.copy(currentPoint).substract(lastPoint).scale(-scale);
                _this.canvas.rootNode.translate(offset);
                _this.canvas.repaint = true;
                // done
                lastPoint.copy(currentPoint);
            });
            _this.canvasElement.width = width;
            _this.canvasElement.height = height;
            _this.canvasElement.draggable = false;
            return _this;
        }
        Object.defineProperty(MiniMap.prototype, "width", {
            /**
             * 地图宽度
             */
            get: function () {
                return this.canvasElement.width;
            },
            set: function (value) {
                this.canvasElement.width = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MiniMap.prototype, "height", {
            /**
             * 地图高度
             */
            get: function () {
                return this.canvasElement.height;
            },
            set: function (value) {
                this.canvasElement.height = value;
            },
            enumerable: true,
            configurable: true
        });
        MiniMap.prototype.install = function (canvas) {
            this.canvas = canvas;
            this.canvasElement.addEventListener('mousemove', this.handleMouseMove);
        };
        MiniMap.prototype.destroy = function () {
            this.canvasElement.removeEventListener('mousemove', this.handleMouseMove);
            this.canvas = null;
        };
        MiniMap.prototype.update = function () {
            this.render();
        };
        MiniMap.prototype.render = function () {
            if (!this.canvas)
                return;
            var boundingRect = this.canvas.getContentBoundingRect();
            var width = boundingRect[2].x - boundingRect[0].x;
            var height = boundingRect[2].y - boundingRect[0].y;
            // scale = 地图尺寸 / 画布尺寸
            var scale = Math.min(this.width / width, this.height / height);
            var ctx = this.canvasElement.getContext('2d');
            var offsetX = (this.width / scale - width) / 2 - boundingRect[0].x;
            var offsetY = (this.height / scale - height) / 2 - boundingRect[0].y;
            ctx.clearRect(0, 0, this.width, this.height);
            ctx.save();
            ctx.scale(scale, scale);
            ctx.translate(offsetX, offsetY);
            // 绘制节点与连线的缩略图
            var num = Math.random();
            this.canvas.rootNode.getDescendantBF(function (node) {
                node.edges.forEach(function (edge) {
                    if (edge.renderSign === num)
                        return;
                    if (edge.sourceNode === node) {
                        if (edge.targetNode.depth <= node.depth) {
                            edge.drawThumbnail(ctx);
                            edge.renderSign = num;
                        }
                    }
                    else {
                        if (edge.sourceNode.depth <= node.depth) {
                            edge.drawThumbnail(ctx);
                            edge.renderSign = num;
                        }
                    }
                });
                if (node.miniMapVisible) {
                    node.drawThumbnail(ctx);
                }
            });
            // 非可视区域在地图中以阴影表示
            ctx.translate(-offsetX, -offsetY);
            ctx.beginPath();
            ctx.rect(0, 0, this.width / scale, this.height / scale);
            // 绘制画布可视区域在小地图上的映射窗口
            ctx.rect(offsetX, offsetY, this.canvas.canvasWidth, this.canvas.canvasHeight);
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fill('evenodd');
            ctx.beginPath();
            ctx.rect(offsetX, offsetY, this.canvas.canvasWidth, this.canvas.canvasHeight);
            ctx.strokeStyle = '#29c1f8';
            ctx.lineWidth = 1 / scale;
            ctx.stroke();
            ctx.restore();
        };
        /**
         * 挂载
         * @param container
         */
        MiniMap.prototype.mount = function (container) {
            container.appendChild(this.canvasElement);
        };
        /**
         * 卸载
         */
        MiniMap.prototype.unmount = function () {
            if (this.canvasElement.parentElement) {
                this.canvasElement.parentElement.removeChild(this.canvasElement);
            }
        };
        return MiniMap;
    }(Plugin_2.default));
    exports.MiniMap = MiniMap;
    exports.default = MiniMap;
});
define("layout/CircularLayout", ["require", "exports", "layout/Layout", "utils/Vector2d"], function (require, exports, Layout_1, Vector2d_24) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Layout_1 = __importStar(Layout_1);
    Vector2d_24 = __importDefault(Vector2d_24);
    var PI2 = Math.PI * 2;
    /**
     * 环形布局
     */
    var CircularLayout = /** @class */ (function (_super) {
        __extends(CircularLayout, _super);
        function CircularLayout() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.clockwise = true;
            _this.radius = 0;
            _this.startAngle = 0;
            _this.endAngle = Math.PI * 2;
            _this.duration = 0;
            _this.gap = 10;
            _this.nodeRadius = 50;
            return _this;
        }
        CircularLayout.prototype.layout = function () {
            this.canvas.layout = this;
            var nodes = this.canvas.rootNode.children;
            var count = nodes.length;
            if (count === 0)
                return;
            this.transports = [];
            var totalAngle = Math.abs(this.endAngle - this.startAngle);
            // 圈数
            var rounds = 0;
            // 每圈个数
            var nums = 0;
            // 内圈半径
            var innerRadius = this.radius;
            if (totalAngle > 0) {
                rounds = Math.ceil(totalAngle / PI2);
                nums = Math.ceil(count / (totalAngle / PI2));
                innerRadius = (this.nodeRadius + this.gap / 2) / Math.sin(rounds === 1 ? totalAngle / count / 2 : PI2 / nums / 2);
            }
            else if (innerRadius > 0) {
                var avgAngle = Math.asin((this.nodeRadius + this.gap / 2) / innerRadius) * 2;
                nums = Math.floor(PI2 / avgAngle);
                rounds = Math.ceil(count / nums);
                totalAngle = PI2 / nums * count;
            }
            else {
                totalAngle = PI2;
                rounds = 1;
                nums = count;
                innerRadius = (this.nodeRadius + this.gap / 2) / Math.sin(totalAngle / count / 2);
            }
            var origin = new Vector2d_24.default(this.canvas.canvasWidth / 2, this.canvas.canvasHeight / 2);
            for /* 圈数 */ (var r = 1; r <= rounds; r++) {
                for /* 节点次序 */ (var n = 1; n <= nums; n++) {
                    var node = nodes[(r - 1) * nums + n - 1];
                    if (!node)
                        break;
                    var transport = new Layout_1.Transport();
                    this.transports.push(transport);
                    transport.node = node;
                    transport.duration = this.duration;
                    transport.destination.copy(Vector2d_24.default.xAxis);
                    var radius = innerRadius + (r - 1) * (this.nodeRadius * 2 + this.gap);
                    if /* 最后一圈 */ (r === rounds) {
                        var lastAngle = totalAngle % PI2 || PI2;
                        var lastNum = count % nums || nums;
                        var angleInterval = lastAngle === PI2 ? lastAngle / lastNum : lastAngle / ((lastNum - 1) || 2);
                        var angle = angleInterval * (n % lastNum);
                        var rotate = this.startAngle + (this.clockwise ? angle : -angle);
                        transport.destination.scale(radius).rotate(rotate).add(origin);
                    }
                    else {
                        var angleInterval = PI2 / nums;
                        var angle = angleInterval * (n - 1);
                        var rotate = this.startAngle + (this.clockwise ? angle : -angle);
                        transport.destination.scale(radius).rotate(rotate).add(origin);
                    }
                }
            }
            this.canvas.repaint = true;
        };
        return CircularLayout;
    }(Layout_1.default));
    exports.CircularLayout = CircularLayout;
    exports.default = CircularLayout;
});
define("layout/MatrixLayout", ["require", "exports", "layout/Layout", "utils/Vector2d"], function (require, exports, Layout_2, Vector2d_25) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Layout_2 = __importStar(Layout_2);
    Vector2d_25 = __importDefault(Vector2d_25);
    /**
     * 行列布局
     */
    var MatrixLayout = /** @class */ (function (_super) {
        __extends(MatrixLayout, _super);
        function MatrixLayout() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 行数
             */
            _this.rows = 0;
            /**
             * 行间隙
             */
            _this.rowGap = 10;
            /**
             * 列数
             */
            _this.columns = 0;
            /**
             * 列间隙
             */
            _this.columnGap = 10;
            /**
             * 节点半径
             */
            _this.nodeRadius = 50;
            /**
             * 布局过渡时间
             */
            _this.duration = 0;
            _this.transports = [];
            return _this;
        }
        MatrixLayout.prototype.layout = function () {
            this.canvas.layout = this;
            var nodes = this.canvas.rootNode.children;
            var count = nodes.length;
            if (count === 0)
                return;
            this.transports = [];
            var rows = 0;
            var columns = 0;
            if (this.rows > 0) {
                rows = this.rows;
                columns = Math.ceil(count / rows);
            }
            else if (this.columns > 0) {
                columns = this.columns;
                rows = Math.ceil(count / columns);
            }
            else {
                rows = Math.ceil(Math.sqrt(count));
                columns = Math.ceil(count / rows);
            }
            var totalWidth = columns * this.nodeRadius * 2 + (columns - 1) * this.columnGap;
            var totalHeight = rows * this.nodeRadius * 2 + (rows - 1) * this.rowGap;
            var origin = new Vector2d_25.default((this.canvas.canvasWidth - totalWidth) / 2 + this.nodeRadius, (this.canvas.canvasHeight - totalHeight) / 2 + this.nodeRadius);
            for /* 行 */ (var r = 1; r <= rows; r++) {
                for /* 列 */ (var c = 1; c <= columns; c++) {
                    var node = nodes[(r - 1) * columns + c - 1];
                    if (!node)
                        break;
                    var transport = new Layout_2.Transport();
                    transport.node = node;
                    transport.destination.copy(origin);
                    transport.destination.x += (c - 1) * (this.nodeRadius * 2 + this.columnGap);
                    transport.destination.y += (r - 1) * (this.nodeRadius * 2 + this.rowGap);
                    transport.duration = this.duration;
                    this.transports.push(transport);
                }
            }
            this.canvas.repaint = true;
        };
        return MatrixLayout;
    }(Layout_2.default));
    exports.MatrixLayout = MatrixLayout;
    exports.default = MatrixLayout;
});
define("layout/ForceLayout", ["require", "exports", "layout/Layout", "utils/Vector2d"], function (require, exports, Layout_3, Vector2d_26) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Layout_3 = __importStar(Layout_3);
    Vector2d_26 = __importDefault(Vector2d_26);
    var ForceTransport = /** @class */ (function (_super) {
        __extends(ForceTransport, _super);
        function ForceTransport() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 质量
             */
            _this.M = 1;
            /**
             * 电荷
             */
            _this.Q = 32;
            /**
             * 受力
             */
            _this.force = new Vector2d_26.default();
            /**
             * 加速度
             */
            _this.accelerate = new Vector2d_26.default();
            return _this;
        }
        ForceTransport.prototype.update = function () {
            if (!this.node)
                return;
            this.accelerate.copy(this.force).scale(1 / this.M);
            this.speed.add(this.accelerate);
            this.node.translate(this.speed);
        };
        return ForceTransport;
    }(Layout_3.Transport));
    /**
     * 节点中心最小距离
     */
    var MIN_DISTANCE_BETWEEN_NODE = 30;
    /**
     * 力导布局
     */
    var ForceLayout = /** @class */ (function (_super) {
        __extends(ForceLayout, _super);
        function ForceLayout() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.transports = [];
            /**
             * 弹性系数
             */
            _this.elasticity = 0.01;
            /**
             * 中心吸引系数
             */
            _this.attractive = 0.005;
            /**
             * 斥力系数
             */
            _this.repulsion = 20;
            /**
             * 阻尼系数
             */
            _this.damping = 0.1;
            /**
             * 连线自然长度
             */
            _this.edgeLength = 100;
            /**
             * 布局完成?
             */
            _this.complete = false;
            /**
             * 布局动画?
             */
            _this.animate = true;
            return _this;
        }
        ForceLayout.prototype.layout = function () {
            this.canvas.layout = this;
            var nodes = this.canvas.rootNode.children;
            var count = nodes.length;
            if (count === 0)
                return;
            this.complete = false;
            this.transports = nodes.map(function (node) {
                var transport = new ForceTransport();
                transport.node = node;
                return transport;
            });
            this.canvas.repaint = true;
        };
        ForceLayout.prototype.update = function () {
            if (this.complete)
                return false;
            this.calculateForce();
            var complete = true;
            this.transports.forEach(function (transport) {
                transport.update();
                if (complete) {
                    complete = complete && transport.speed.magnitude < 0.1;
                }
            });
            this.complete = complete;
            this.canvas.optimizeNode();
            return this.animate ? true : this.update();
        };
        /**
         * 计算受力
         */
        ForceLayout.prototype.calculateForce = function () {
            var _this = this;
            var canvasCenter = new Vector2d_26.default(this.canvas.canvasWidth / 2, this.canvas.canvasHeight / 2);
            this.transports.forEach(function (source) {
                var sourceNode = source.node;
                source.force.x = 0;
                source.force.y = 0;
                /**
                 * 1.库仑力
                 * F = (Q1 * Q2) / (distance ** 2) * k
                 */
                _this.transports.forEach(function (target) {
                    if (source === target)
                        return;
                    var targetNode = target.node;
                    var targetToSource = sourceNode.centerPoint.substract(targetNode.centerPoint);
                    var distance = targetToSource.magnitude;
                    distance = distance < MIN_DISTANCE_BETWEEN_NODE ? MIN_DISTANCE_BETWEEN_NODE : distance;
                    var forceSize = (source.Q * target.Q) / Math.pow(distance, 2) * _this.repulsion;
                    var coulombForce = targetToSource.normalize().scale(forceSize);
                    source.force.add(coulombForce);
                });
                /**
                 * 2.拉力
                 * F = L * K
                 */
                sourceNode.edges.forEach(function (edge) {
                    var targetNode = edge.sourceNode === sourceNode ? edge.targetNode : edge.sourceNode;
                    // 鼠标虚拟节点
                    if (targetNode.renderType === 'NONE')
                        return;
                    var sourceToTarget = targetNode.centerPoint.substract(sourceNode.centerPoint);
                    var L = sourceToTarget.magnitude;
                    L = L > _this.edgeLength ? L - _this.edgeLength : _this.edgeLength;
                    var forceSize = L * _this.elasticity;
                    var pullForce = sourceToTarget.normalize().scale(forceSize);
                    source.force.add(pullForce);
                });
                /**
                 * 阻尼力
                 * F = V * K
                 */
                {
                    var forceSize_1 = source.speed.magnitude * _this.damping;
                    var dampingForce = source.speed.clone().normalize().scale(-forceSize_1);
                    source.force.add(dampingForce);
                }
                /**
                 * 3.聚向画布中心的力
                 * F = d * K
                 */
                var sourceToCenter = canvasCenter.clone().substract(sourceNode.centerPoint);
                var forceSize = sourceToCenter.magnitude * _this.attractive;
                var F = sourceToCenter.normalize().scale(forceSize);
                source.force.add(F);
            });
        };
        return ForceLayout;
    }(Layout_3.default));
    exports.ForceLayout = ForceLayout;
    exports.default = ForceLayout;
});
define("index", ["require", "exports", "core/Canvas", "events/eventEmitter", "graph/Edge", "graph/Node", "mode/modes", "interaction/Interaction", "interaction/selectInteraction", "interaction/dragInteraction", "interaction/dropInteraction", "interaction/moveCanvasInteraction", "interaction/wheelZoomInteraction", "interaction/areaPickInteraction", "interaction/createGroupInteraction", "interaction/CreateEdgeInteraction", "node/RectDomNode", "node/RectCanvasNode", "node/CircleCanvasNode", "node/RectCanvasGroup", "node/RectDomGroup", "node/CircleCanvasGroup", "edge/Line", "edge/L", "utils/Math2d", "utils/Vector2d", "utils/utils", "element/Image", "element/Rect", "element/Text", "element/Triangle", "element/Polyline", "plugin/MiniMap", "plugin/ContextMenu", "layout/CircularLayout", "layout/MatrixLayout", "layout/ForceLayout"], function (require, exports, Canvas_1, eventEmitter_2, Edge_3, Node_4, modes_2, Interaction_11, selectInteraction_3, dragInteraction_3, dropInteraction_2, moveCanvasInteraction_2, wheelZoomInteraction_2, areaPickInteraction_2, createGroupInteraction_2, CreateEdgeInteraction_2, RectDomNode_2, RectCanvasNode_2, CircleCanvasNode_2, RectCanvasGroup_2, RectDomGroup_3, CircleCanvasGroup_1, Line_2, L_2, Math2d_12, Vector2d_27, utils_6, Image_1, Rect_2, Text_3, Triangle_3, Polyline_3, MiniMap_1, ContextMenu_2, CircularLayout_1, MatrixLayout_1, ForceLayout_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(Canvas_1);
    __export(eventEmitter_2);
    __export(Edge_3);
    __export(Node_4);
    // 模式
    __export(modes_2);
    // 交互
    __export(Interaction_11);
    __export(selectInteraction_3);
    __export(dragInteraction_3);
    __export(dropInteraction_2);
    __export(moveCanvasInteraction_2);
    __export(wheelZoomInteraction_2);
    __export(areaPickInteraction_2);
    __export(createGroupInteraction_2);
    __export(CreateEdgeInteraction_2);
    // node
    __export(RectDomNode_2);
    __export(RectCanvasNode_2);
    __export(CircleCanvasNode_2);
    __export(RectCanvasGroup_2);
    __export(RectDomGroup_3);
    __export(CircleCanvasGroup_1);
    // edge
    __export(Line_2);
    __export(L_2);
    // utils
    __export(Math2d_12);
    __export(Vector2d_27);
    __export(utils_6);
    // element
    __export(Image_1);
    __export(Rect_2);
    __export(Text_3);
    __export(Triangle_3);
    __export(Polyline_3);
    // plugin
    __export(MiniMap_1);
    __export(ContextMenu_2);
    // layout
    __export(CircularLayout_1);
    __export(MatrixLayout_1);
    __export(ForceLayout_1);
});
