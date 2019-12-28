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
var CircleNode = (function (_super) {
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
        var point = canvas.viewportToPixelCoordinate(new Vector2d_1.default(event.clientX, event.clientY));
        return Math2d_1.default.isPointInCircle(point, centerPoint, radius);
    };
    CircleNode.prototype.getBoundingRect = function () {
        var _a = this, radius = _a.radius, _b = _a.position, x = _b.x, y = _b.y;
        var diameter = 2 * radius;
        return [
            new Vector2d_1.default(x, y),
            new Vector2d_1.default(x + diameter, y),
            new Vector2d_1.default(x + diameter, y + diameter),
            new Vector2d_1.default(x, y + diameter)
        ];
    };
    CircleNode.prototype.getBoundingJoinPoints = function () {
        var _a = this, radius = _a.radius, _b = _a.position, x = _b.x, y = _b.y;
        var diameter = 2 * radius;
        return [
            new Vector2d_1.default(x + radius, y),
            new Vector2d_1.default(x + diameter, y + radius),
            new Vector2d_1.default(x + radius, y + diameter),
            new Vector2d_1.default(x, y + radius)
        ];
    };
    CircleNode.prototype.getCenterPoint = function () {
        var _a = this, _b = _a.position, x = _b.x, y = _b.y, radius = _a.radius;
        return new Vector2d_1.default(x + radius, y + radius);
    };
    CircleNode.prototype.isInRect = function (points) {
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
}(Node_1.default));
exports.CircleNode = CircleNode;
exports.default = CircleNode;
