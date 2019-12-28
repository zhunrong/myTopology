"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var Graph_1 = __importDefault(require("./Graph"));
var Vector2d_1 = __importDefault(require("../utils/Vector2d"));
var Node = (function (_super) {
    __extends(Node, _super);
    function Node(options) {
        var _this = _super.call(this, options) || this;
        _this.mounted = false;
        _this.isGroup = false;
        _this.isExpanded = true;
        _this.canResize = false;
        _this.children = [];
        _this.edges = [];
        _this.position = new Vector2d_1.default(options.x, options.y);
        _this.id = options.id;
        return _this;
    }
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
    Node.prototype.translate = function (offset) {
        this.position.add(offset);
        this.isUpdate = true;
        this.children.forEach(function (child) {
            child.translate(offset);
        });
    };
    Node.prototype.addEdge = function (edge) {
        if (this.edges.find(function (item) { return item === edge; }))
            return;
        this.edges.push(edge);
    };
    Node.prototype.removeEdge = function (edge) {
        var index = this.edges.findIndex(function (item) { return item === edge; });
        if (index > -1) {
            this.edges.splice(index, 1);
        }
    };
    Node.prototype.addChild = function (child) {
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
                child.render();
                child.getDescendantBF(function (node) {
                    node.canvas = _this.canvas;
                    node.render();
                });
            }
            return child;
        }
        else {
            return undefined;
        }
    };
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
    Node.prototype.removeAllChild = function (destroy) {
        var _this = this;
        if (destroy === void 0) { destroy = true; }
        var children = __spreadArrays(this.children);
        children.forEach(function (child) {
            _this.removeChild(child, destroy);
        });
    };
    Node.prototype.hasChild = function (child) {
        return !!this.children.find(function (item) { return item === child; });
    };
    Node.prototype.hasDescendant = function (descendant) {
        var result = false;
        this.getDescendantBF(function (node) {
            if (node === descendant) {
                return result = true;
            }
        });
        return result;
    };
    Node.prototype.hasActiveAncestor = function () {
        return !!this.parent && (this.parent.active || this.parent.hasActiveAncestor());
    };
    Node.prototype.getActiveChild = function () {
        return this.children.filter(function (child) { return child.active; });
    };
    Node.prototype.getActiveDescendant = function () {
        var nodes = [];
        this.getDescendantBF(function (node) {
            if (node.active) {
                nodes.push(node);
            }
        });
        return nodes;
    };
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
        get: function () {
            return this.parent ? this.parent.root : this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "depth", {
        get: function () {
            return this.parent ? this.parent.depth + 1 : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "firstChild", {
        get: function () {
            return this.children[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "lastChild", {
        get: function () {
            return this.children[this.children.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.mount = function (force) {
        if (force === void 0) { force = false; }
    };
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
