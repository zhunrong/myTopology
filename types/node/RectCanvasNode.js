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
var RectNode_1 = __importDefault(require("../graph/RectNode"));
var RectCanvasNode = (function (_super) {
    __extends(RectCanvasNode, _super);
    function RectCanvasNode(options) {
        var _this = _super.call(this, options) || this;
        _this.renderType = 'CANVAS';
        _this.cacheCanvas = document.createElement('canvas');
        return _this;
    }
    RectCanvasNode.prototype.render = function (ctx) {
        if (!this.canvas)
            return;
        var width = this.getWidth();
        var height = this.getHeight();
        ctx = ctx || this.cacheCanvas.getContext('2d');
        this.cacheCanvas.width = width + 4;
        this.cacheCanvas.height = height + 4;
        ctx.rect(2, 2, width, height);
        ctx.strokeStyle = '#29c1f8';
        ctx.fillStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.font = "14px serif";
        ctx.fillStyle = '#29c1f8';
        ctx.fillText(this.text, width / 2 + 2, height / 2 + 2);
        this.canvas.repaint = true;
    };
    RectCanvasNode.prototype.update = function (ctx) {
        if (!this.canvas)
            return;
        var graphCanvasCtx = this.canvas.graphCanvasCtx;
        var _a = this.getPosition(), x = _a.x, y = _a.y;
        graphCanvasCtx.save();
        if (this.active) {
            graphCanvasCtx.shadowBlur = 5;
            graphCanvasCtx.shadowColor = 'rgba(255,0,0,0.8)';
        }
        graphCanvasCtx.drawImage(this.cacheCanvas, x - 2, y - 2);
        graphCanvasCtx.restore();
    };
    return RectCanvasNode;
}(RectNode_1.default));
exports.RectCanvasNode = RectCanvasNode;
exports.default = RectCanvasNode;
