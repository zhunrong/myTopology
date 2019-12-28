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
var Triangle = (function (_super) {
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
        var p0 = new Vector2d_1.default(0, 0).add(this.offset).rotate(this.rotate);
        var p1 = new Vector2d_1.default(-this.height, +this.width / 2).add(this.offset).rotate(this.rotate);
        var p2 = new Vector2d_1.default(-this.height, -this.width / 2).add(this.offset).rotate(this.rotate);
        return Math2d_1.default.isPointInTriangle(Vector2d_1.default.copy(point).substract(this.position), p0, p1, p2);
    };
    return Triangle;
}(Element_1.default));
exports.Triangle = Triangle;
exports.default = Triangle;
