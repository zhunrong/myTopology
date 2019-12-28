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
var CircleNode_1 = __importDefault(require("../graph/CircleNode"));
var CircleCanvasNode = (function (_super) {
    __extends(CircleCanvasNode, _super);
    function CircleCanvasNode(options) {
        var _this = _super.call(this, options) || this;
        _this.renderType = 'CANVAS';
        _this.cacheCanvas = document.createElement('canvas');
        return _this;
    }
    CircleCanvasNode.prototype.render = function () {
        var _a = this, radius = _a.radius, canvas = _a.canvas, active = _a.active;
        if (!canvas)
            return;
        var diameter = 2 * radius;
        this.cacheCanvas.width = diameter + 2;
        this.cacheCanvas.height = diameter + 2;
        var ctx = this.cacheCanvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(radius + 1, radius + 1, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#29c1f8';
        ctx.fillStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fill();
        if (this.text) {
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.font = "14px serif";
            ctx.fillStyle = '#29c1f8';
            ctx.fillText(this.text, radius + 1, radius + 1);
        }
        canvas.repaint = true;
    };
    CircleCanvasNode.prototype.update = function () {
        if (!this.canvas)
            return;
        var graphCanvasCtx = this.canvas.graphCanvasCtx;
        var _a = this.getPosition(), x = _a.x, y = _a.y;
        graphCanvasCtx.save();
        if (this.active) {
            graphCanvasCtx.shadowBlur = 5;
            graphCanvasCtx.shadowColor = 'rgba(255,0,0,0.8)';
        }
        graphCanvasCtx.drawImage(this.cacheCanvas, x - 1, y - 1);
        graphCanvasCtx.restore();
    };
    return CircleCanvasNode;
}(CircleNode_1.default));
exports.CircleCanvasNode = CircleCanvasNode;
exports.default = CircleCanvasNode;
