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
var Node_1 = __importDefault(require("./Node"));
var Vector2d_1 = __importDefault(require("../utils/Vector2d"));
var Math2d_1 = __importDefault(require("../utils/Math2d"));
var RectNode = (function (_super) {
    __extends(RectNode, _super);
    function RectNode(options) {
        var _this = _super.call(this, options) || this;
        _this.shapeType = 'rect';
        _this.collapseWidth = 50;
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
    RectNode.prototype.getPosition = function () {
        if (this.isExpanded) {
            return this.position;
        }
        else {
            var _a = this.position, x = _a.x, y = _a.y;
            return new Vector2d_1.default(x + (this.width - this.collapseWidth) / 2, y + (this.height - this.collapseHeight) / 2);
        }
    };
    RectNode.prototype.getWidth = function () {
        return this.isExpanded ? this.width : this.collapseWidth;
    };
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
        var point = canvas.viewportToPixelCoordinate(new Vector2d_1.default(event.clientX, event.clientY));
        return Math2d_1.default.isPointInRect(point, this.getPosition(), this.getWidth(), this.getHeight());
    };
    Object.defineProperty(RectNode.prototype, "joinPoint", {
        get: function () {
            var _a = this.getPosition(), x = _a.x, y = _a.y;
            return new Vector2d_1.default(x + this.getWidth() / 2, y + this.getHeight() / 2);
        },
        enumerable: true,
        configurable: true
    });
    RectNode.prototype.getBoundingRect = function () {
        var width = this.getWidth();
        var height = this.getHeight();
        var _a = this.getPosition(), x = _a.x, y = _a.y;
        return [
            new Vector2d_1.default(x, y),
            new Vector2d_1.default(x + width, y),
            new Vector2d_1.default(x + width, y + height),
            new Vector2d_1.default(x, y + height)
        ];
    };
    RectNode.prototype.getBoundingJoinPoints = function () {
        var width = this.getWidth();
        var height = this.getHeight();
        var _a = this.getPosition(), x = _a.x, y = _a.y;
        return [
            new Vector2d_1.default(x + width / 2, y),
            new Vector2d_1.default(x + width, y + height / 2),
            new Vector2d_1.default(x + width / 2, y + height),
            new Vector2d_1.default(x, y + height / 2)
        ];
    };
    RectNode.prototype.getCenterPoint = function () {
        var width = this.getWidth();
        var height = this.getHeight();
        var _a = this.getPosition(), x = _a.x, y = _a.y;
        return new Vector2d_1.default(x + width / 2, y + height / 2);
    };
    RectNode.prototype.isInRect = function (points) {
        var vertexes = this.getBoundingRect();
        if (points[0].x > vertexes[2].x)
            return false;
        if (points[2].x < vertexes[0].x)
            return false;
        if (points[0].y > vertexes[2].y)
            return false;
        if (points[2].y < vertexes[0].y)
            return false;
        return true;
    };
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
