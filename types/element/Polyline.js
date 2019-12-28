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
var pointCopy = new Vector2d_1.default();
var Polyline = (function (_super) {
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
        return Math2d_1.default.isPointInPolyline(pointCopy.copy(point).substract(this.offset), this.points, 0.1);
    };
    return Polyline;
}(Element_1.default));
exports.Polyline = Polyline;
exports.default = Polyline;
