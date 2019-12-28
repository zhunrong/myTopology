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
var Element_1 = __importDefault(require("./Element"));
var Vector2d_1 = __importDefault(require("../utils/Vector2d"));
var Math2d_1 = __importDefault(require("../utils/Math2d"));
var Rect = (function (_super) {
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
        var p0 = new Vector2d_1.default(-this.width / 2, -this.height / 2).add(this.offset).rotate(this.rotate);
        var p1 = new Vector2d_1.default(-this.width / 2, this.height / 2).add(this.offset).rotate(this.rotate);
        var p2 = new Vector2d_1.default(this.width / 2, this.height / 2).add(this.offset).rotate(this.rotate);
        var p3 = new Vector2d_1.default(this.width / 2, -this.height / 2).add(this.offset).rotate(this.rotate);
        return Math2d_1.default.isPointInPolygon(Vector2d_1.default.copy(point).substract(this.position), [p0, p1, p2, p3]);
    };
    return Rect;
}(Element_1.default));
exports.Rect = Rect;
exports.default = Rect;
