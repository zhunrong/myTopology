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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Plugin_1 = __importDefault(require("./Plugin"));
var Vector2d_1 = __importDefault(require("../utils/Vector2d"));
var utils_1 = require("../utils/utils");
var lastPoint = new Vector2d_1.default();
var currentPoint = new Vector2d_1.default();
var offset = new Vector2d_1.default();
var MiniMap = (function (_super) {
    __extends(MiniMap, _super);
    function MiniMap(width, height) {
        if (width === void 0) { width = 200; }
        if (height === void 0) { height = 200; }
        var _this = _super.call(this) || this;
        _this.canvasElement = document.createElement('canvas');
        _this.handleMouseMove = utils_1.throttle(function (e) {
            if (e.buttons !== 1 || !_this.canvas || lastPoint.magnitude === 0) {
                lastPoint.x = e.offsetX;
                lastPoint.y = e.offsetY;
                return;
            }
            currentPoint.x = e.offsetX;
            currentPoint.y = e.offsetY;
            var boundingRect = _this.canvas.getContentBoundingRect();
            var width = boundingRect[2].x - boundingRect[0].x;
            var height = boundingRect[2].y - boundingRect[0].y;
            var scale = Math.max(width / _this.width, height / _this.height);
            offset.copy(currentPoint).substract(lastPoint).scale(-scale);
            _this.canvas.rootNode.translate(offset);
            _this.canvas.repaint = true;
            lastPoint.copy(currentPoint);
        });
        _this.canvasElement.width = width;
        _this.canvasElement.height = height;
        _this.canvasElement.draggable = false;
        return _this;
    }
    Object.defineProperty(MiniMap.prototype, "width", {
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
        var scale = Math.min(this.width / width, this.height / height);
        var ctx = this.canvasElement.getContext('2d');
        var offsetX = (this.width / scale - width) / 2 - boundingRect[0].x;
        var offsetY = (this.height / scale - height) / 2 - boundingRect[0].y;
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.save();
        ctx.scale(scale, scale);
        ctx.translate(offsetX, offsetY);
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
        ctx.translate(-offsetX, -offsetY);
        ctx.beginPath();
        ctx.rect(0, 0, this.width / scale, this.height / scale);
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
    MiniMap.prototype.mount = function (container) {
        container.appendChild(this.canvasElement);
    };
    MiniMap.prototype.unmount = function () {
        if (this.canvasElement.parentElement) {
            this.canvasElement.parentElement.removeChild(this.canvasElement);
        }
    };
    return MiniMap;
}(Plugin_1.default));
exports.MiniMap = MiniMap;
exports.default = MiniMap;
