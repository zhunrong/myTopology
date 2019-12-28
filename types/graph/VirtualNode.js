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
var VirtualNode = (function (_super) {
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
                new Vector2d_1.default(x - this.radius, y - this.radius),
                new Vector2d_1.default(x + this.radius, y - this.radius),
                new Vector2d_1.default(x + this.radius, y + this.radius),
                new Vector2d_1.default(x - this.radius, y + this.radius),
            ];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualNode.prototype, "boundingJoinPoints", {
        get: function () {
            var _a = this.position, x = _a.x, y = _a.y;
            return [
                new Vector2d_1.default(x, y - this.radius),
                new Vector2d_1.default(x + this.radius, y),
                new Vector2d_1.default(x, y + this.radius),
                new Vector2d_1.default(x - this.radius, y)
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
}(Node_1.default));
exports.VirtualNode = VirtualNode;
exports.default = VirtualNode;
