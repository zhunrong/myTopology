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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Interaction_1 = __importDefault(require("./Interaction"));
var Vector2d_1 = __importDefault(require("../utils/Vector2d"));
var DragInteraction = (function (_super) {
    __extends(DragInteraction, _super);
    function DragInteraction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.minDragDistance = 3;
        _this.moveNodes = [];
        _this.mousedown = false;
        _this.lastCoordinate = new Vector2d_1.default();
        _this.onMouseDown = function (canvas) {
            var activeNodes = canvas.getActiveNodes();
            if (activeNodes.length) {
                _this.moveNodes = __spreadArrays(activeNodes);
            }
            else {
                _this.moveNodes = __spreadArrays(canvas.rootNode.children);
            }
            _this.mousedown = true;
            _this.lastCoordinate.copy(canvas.mousedownPosition);
        };
        _this.onMouseMove = function (canvas) {
            if (!_this.mousedown)
                return;
            if (Vector2d_1.default.copy(canvas.mousemovePosition).substract(canvas.mousedownPosition).magnitude < _this.minDragDistance)
                return;
            var offset = Vector2d_1.default.copy(canvas.mousemovePosition).substract(_this.lastCoordinate);
            _this.lastCoordinate.copy(canvas.mousemovePosition);
            var pixelOffset = offset.scale(1 / canvas.canvasScale);
            _this.moveNodes.forEach(function (node) {
                node.translate(pixelOffset);
            });
            canvas.repaint = true;
        };
        _this.onMouseUp = function (canvas) {
            if (_this.moveNodes.length === 1) {
                var activeNode_1 = _this.moveNodes[0];
                var wrap_1 = false;
                canvas.rootNode.getDescendantDF(function (node) {
                    if (!node.visible)
                        return;
                    if (node === activeNode_1)
                        return;
                    if (!node.isGroup)
                        return;
                    if (activeNode_1.hasDescendant(node))
                        return;
                    if (activeNode_1.isWrappedInRect(node.boundingRect)) {
                        node.addChild(activeNode_1);
                        return wrap_1 = true;
                    }
                });
                if (!wrap_1) {
                    canvas.rootNode.addChild(activeNode_1);
                }
            }
            _this.moveNodes = [];
            _this.mousedown = false;
        };
        return _this;
    }
    DragInteraction.prototype.handleEvent = function (canvas, event) {
        switch (event.type) {
            case 'mousedown':
                this.onMouseDown(canvas);
                break;
            case 'mousemove':
                this.onMouseMove(canvas);
                break;
            case 'mouseup':
                this.onMouseUp(canvas);
                break;
        }
    };
    return DragInteraction;
}(Interaction_1.default));
exports.DragInteraction = DragInteraction;
exports.dragInteraction = new DragInteraction();
exports.default = DragInteraction;
