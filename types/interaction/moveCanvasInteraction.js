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
var MoveCanvasInteraction = (function (_super) {
    __extends(MoveCanvasInteraction, _super);
    function MoveCanvasInteraction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.minDragDistance = 3;
        _this.mouseDown = false;
        _this.move = false;
        _this.lastCoordinate = new Vector2d_1.default();
        _this.onMouseDown = function (canvas) {
            _this.mouseDown = true;
            _this.lastCoordinate.copy(canvas.mousedownPosition);
        };
        _this.onMouseMove = function (canvas) {
            if (!_this.mouseDown)
                return;
            if (Vector2d_1.default.copy(canvas.mousemovePosition).substract(canvas.mousedownPosition).magnitude < _this.minDragDistance)
                return;
            var offset = Vector2d_1.default.copy(canvas.mousemovePosition).substract(_this.lastCoordinate);
            _this.lastCoordinate.copy(canvas.mousemovePosition);
            _this.move = true;
            var pixelOffset = offset.scale(1 / canvas.canvasScale);
            canvas.rootNode.translate(pixelOffset);
            canvas.repaint = true;
        };
        _this.onMouseUp = function (canvas) {
            _this.mouseDown = false;
            if (_this.move) {
                canvas.eventEmitter.emit('interaction:canvasMoveEnd');
                _this.move = false;
            }
        };
        return _this;
    }
    MoveCanvasInteraction.prototype.handleEvent = function (canvas, event) {
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
    return MoveCanvasInteraction;
}(Interaction_1.default));
exports.MoveCanvasInteraction = MoveCanvasInteraction;
exports.moveCanvasInteraction = new MoveCanvasInteraction();
exports.default = MoveCanvasInteraction;
