"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphId = 1;
var Graph = (function () {
    function Graph(options) {
        this.active = false;
        this.isUpdate = true;
        this.graphId = graphId++;
        this.data = null;
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
        get: function () {
            return this.visible;
        },
        enumerable: true,
        configurable: true
    });
    Graph.prototype.isInRect = function (points) {
        return false;
    };
    Graph.prototype.isWrappedInRect = function (rect) { return false; };
    Graph.prototype.isWrappedInCircle = function () { return false; };
    Graph.prototype.render = function (ctx) { };
    Graph.prototype.update = function (ctx) { };
    Graph.prototype.destroy = function () { };
    Graph.prototype.beforeDestroy = function () { };
    Graph.prototype.exportJson = function () { };
    return Graph;
}());
exports.Graph = Graph;
exports.default = Graph;
