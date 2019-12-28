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
var Interaction_1 = __importDefault(require("./Interaction"));
var Vector2d_1 = __importDefault(require("../utils/Vector2d"));
var AreaPickInteraction = (function (_super) {
    __extends(AreaPickInteraction, _super);
    function AreaPickInteraction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.minDragDistance = 5;
        _this.mouseDown = false;
        _this.activeNodes = [];
        _this.dragMove = false;
        _this.lastCoordinate = new Vector2d_1.default();
        _this.onInstall = function (canvas) {
            canvas.topCanvasMount();
        };
        _this.onUninstall = function (canvas) {
            canvas.topCanvasCtx.clearRect(0, 0, canvas.viewWidth, canvas.viewHeight);
            canvas.topCanvasUnmount();
        };
        _this.onMouseDown = function (canvas, e) {
            _this.dragMove = false;
            _this.lastCoordinate.copy(canvas.mousedownPosition);
            var activeNodes = canvas.getActiveNodes();
            if (activeNodes.length && activeNodes.find(function (node) { return node.visible && node.isPointIn(); })) {
                _this.dragMove = true;
                _this.activeNodes = activeNodes;
            }
            else {
                _this.activeNodes = [];
                canvas.rootNode.getDescendantDF(function (node) {
                    node.isUpdate = true;
                    if (!_this.activeNodes.length && node.visible && node.isPointIn()) {
                        _this.activeNodes.push(node);
                        _this.dragMove = true;
                        node.active = true;
                    }
                    else {
                        node.active = false;
                    }
                });
                canvas.repaint = true;
            }
            _this.mouseDown = true;
            canvas.topCanvasCtx.fillStyle = 'rgba(41, 193, 248, 0.3)';
            canvas.topCanvasCtx.strokeStyle = 'rgb(41, 193, 248)';
        };
        _this.onMouseMove = function (canvas, e) {
            if (!_this.mouseDown)
                return;
            if (_this.dragMove) {
                var offset = Vector2d_1.default.copy(canvas.mousemovePosition).substract(_this.lastCoordinate);
                _this.lastCoordinate.copy(canvas.mousemovePosition);
                var pixelOffset_1 = offset.scale(1 / canvas.canvasScale);
                _this.activeNodes.forEach(function (node) {
                    node.translate(pixelOffset_1);
                });
                canvas.repaint = true;
            }
            else {
                var mousedownPosition = canvas.mousedownPosition, mousemovePosition = canvas.mousemovePosition, topCanvasCtx = canvas.topCanvasCtx, viewWidth = canvas.viewWidth, viewHeight = canvas.viewHeight;
                var offset = Vector2d_1.default.copy(mousemovePosition).substract(mousedownPosition);
                if (offset.magnitude < _this.minDragDistance)
                    return;
                var p0 = canvas.viewportToCanvasCoordinate(mousedownPosition);
                var p2 = canvas.viewportToCanvasCoordinate(mousemovePosition);
                var p1 = new Vector2d_1.default(p0.x, p2.y);
                var p3 = new Vector2d_1.default(p2.x, p0.y);
                topCanvasCtx.clearRect(0, 0, viewWidth, viewHeight);
                topCanvasCtx.beginPath();
                topCanvasCtx.moveTo(p0.x, p0.y);
                topCanvasCtx.lineTo(p1.x, p1.y);
                topCanvasCtx.lineTo(p2.x, p2.y);
                topCanvasCtx.lineTo(p3.x, p3.y);
                topCanvasCtx.closePath();
                topCanvasCtx.fill();
                topCanvasCtx.stroke();
                var v0 = void 0;
                var v1 = void 0;
                var v2 = void 0;
                var v3 = void 0;
                if (mousedownPosition.x > mousemovePosition.x) {
                    if (mousedownPosition.y > mousemovePosition.y) {
                        v0 = canvas.viewportToPixelCoordinate(mousemovePosition);
                        v2 = canvas.viewportToPixelCoordinate(mousedownPosition);
                        v1 = new Vector2d_1.default(v2.x, v0.y);
                        v3 = new Vector2d_1.default(v0.x, v2.y);
                    }
                    else {
                        v1 = canvas.viewportToPixelCoordinate(mousedownPosition);
                        v3 = canvas.viewportToPixelCoordinate(mousemovePosition);
                        v0 = new Vector2d_1.default(v3.x, v1.y);
                        v2 = new Vector2d_1.default(v1.x, v3.y);
                    }
                }
                else {
                    if (mousedownPosition.y > mousemovePosition.y) {
                        v1 = canvas.viewportToPixelCoordinate(mousemovePosition);
                        v3 = canvas.viewportToPixelCoordinate(mousedownPosition);
                        v0 = new Vector2d_1.default(v3.x, v1.y);
                        v2 = new Vector2d_1.default(v1.x, v3.y);
                    }
                    else {
                        v0 = canvas.viewportToPixelCoordinate(mousedownPosition);
                        v2 = canvas.viewportToPixelCoordinate(mousemovePosition);
                        v1 = new Vector2d_1.default(v2.x, v0.y);
                        v3 = new Vector2d_1.default(v0.x, v2.y);
                    }
                }
                var rect_1 = [v0, v1, v2, v3];
                canvas.rootNode.getDescendantBF(function (node) {
                    var status = node.active;
                    if (node.hasActiveAncestor()) {
                        node.active = false;
                    }
                    else if (node.isWrappedInRect(rect_1)) {
                        node.active = true;
                    }
                    else {
                        node.active = false;
                    }
                    if (status !== node.active) {
                        node.isUpdate = true;
                    }
                });
                canvas.repaint = true;
            }
        };
        _this.onMouseUp = function (canvas, e) {
            if (!_this.mouseDown)
                return;
            _this.dragMove = false;
            var topCanvasCtx = canvas.topCanvasCtx, viewWidth = canvas.viewWidth, viewHeight = canvas.viewHeight;
            _this.mouseDown = false;
            topCanvasCtx.clearRect(0, 0, viewWidth, viewHeight);
        };
        return _this;
    }
    AreaPickInteraction.prototype.handleEvent = function (canvas, event) {
        switch (event.type) {
            case 'mousedown':
                this.onMouseDown(canvas, event);
                break;
            case 'mousemove':
                this.onMouseMove(canvas, event);
                break;
            case 'mouseup':
                this.onMouseUp(canvas, event);
                break;
        }
    };
    return AreaPickInteraction;
}(Interaction_1.default));
exports.AreaPickInteraction = AreaPickInteraction;
exports.areaPickInteraction = new AreaPickInteraction();
exports.default = AreaPickInteraction;
