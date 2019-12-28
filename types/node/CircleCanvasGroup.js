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
var CircleCanvasNode_1 = __importDefault(require("./CircleCanvasNode"));
var CircleCanvasGroup = (function (_super) {
    __extends(CircleCanvasGroup, _super);
    function CircleCanvasGroup(options) {
        var _this = _super.call(this, options) || this;
        _this.isGroup = true;
        _this.canResize = true;
        if (typeof options.isExpanded === 'boolean') {
            _this.isExpanded = options.isExpanded;
        }
        return _this;
    }
    CircleCanvasGroup.prototype.render = function (ctx) { };
    CircleCanvasGroup.prototype.update = function (ctx) {
        ctx = ctx || (this.canvas && this.canvas.graphCanvasCtx);
        if (!ctx)
            return;
        var _a = this.getPosition(), x = _a.x, y = _a.y;
        ctx.beginPath();
        ctx.arc(x + this.radius, y + this.radius, this.radius, 0, 2 * Math.PI);
        ctx.save();
        if (this.active) {
            ctx.shadowBlur = 5;
            ctx.shadowColor = this.active ? this.style.activeColor : this.style.color;
        }
        ctx.strokeStyle = this.active ? this.style.activeColor : this.style.color;
        ctx.stroke();
        ctx.restore();
    };
    CircleCanvasGroup.prototype.drawThumbnail = function (ctx) {
        var _a = this.centerPoint, x = _a.x, y = _a.y;
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = this.active ? this.style.activeColor : this.style.color;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
    };
    CircleCanvasGroup.shape = 'circle';
    return CircleCanvasGroup;
}(CircleCanvasNode_1.default));
exports.CircleCanvasGroup = CircleCanvasGroup;
exports.default = CircleCanvasGroup;
