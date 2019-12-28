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
Object.defineProperty(exports, "__esModule", { value: true });
var RectCanvasNode_1 = require("./RectCanvasNode");
var RectCanvasGroup = (function (_super) {
    __extends(RectCanvasGroup, _super);
    function RectCanvasGroup(options) {
        var _this = _super.call(this, options) || this;
        _this.isGroup = true;
        _this.canResize = true;
        if (typeof options.isExpanded === 'boolean') {
            _this.isExpanded = options.isExpanded;
        }
        return _this;
    }
    RectCanvasGroup.prototype.render = function (ctx) { };
    RectCanvasGroup.prototype.update = function (ctx) {
        ctx = ctx || (this.canvas && this.canvas.graphCanvasCtx);
        if (!ctx)
            return;
        var width = this.getWidth();
        var height = this.getHeight();
        var _a = this.getPosition(), x = _a.x, y = _a.y;
        var center = this.centerPoint;
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        if (!this.isExpanded) {
            ctx.moveTo(center.x, center.y - 10);
            ctx.lineTo(center.x, center.y + 10);
            ctx.moveTo(center.x - 10, center.y);
            ctx.lineTo(center.x + 10, center.y);
        }
        ctx.save();
        if (this.active) {
            ctx.shadowBlur = 5;
            ctx.shadowColor = this.active ? this.style.activeColor : this.style.color;
        }
        ctx.strokeStyle = this.active ? this.style.activeColor : this.style.color;
        ctx.stroke();
        ctx.restore();
    };
    RectCanvasGroup.prototype.drawThumbnail = function (ctx) {
        var _a = this.getPosition(), x = _a.x, y = _a.y;
        var width = this.getWidth();
        var height = this.getHeight();
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.strokeStyle = this.active ? this.style.activeColor : this.style.color;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
    };
    RectCanvasGroup.shape = 'rect';
    return RectCanvasGroup;
}(RectCanvasNode_1.RectCanvasNode));
exports.RectCanvasGroup = RectCanvasGroup;
exports.default = RectCanvasGroup;
