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
var Rect_1 = __importDefault(require("./Rect"));
var ctx = document.createElement('canvas').getContext('2d');
var Text = (function (_super) {
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
        var p0 = new Vector2d_1.default(-textRectWidth / 2, -textRectHeight / 2).add(this.offset).rotate(this.rotate);
        var p1 = new Vector2d_1.default(-textRectWidth / 2, textRectHeight / 2).add(this.offset).rotate(this.rotate);
        var p2 = new Vector2d_1.default(textRectWidth / 2, textRectHeight / 2).add(this.offset).rotate(this.rotate);
        var p3 = new Vector2d_1.default(textRectWidth / 2, -textRectHeight / 2).add(this.offset).rotate(this.rotate);
        return Math2d_1.default.isPointInPolygon(Vector2d_1.default.copy(point).substract(this.position), [p0, p1, p2, p3]);
    };
    return Text;
}(Element_1.default));
exports.Text = Text;
exports.default = Text;
