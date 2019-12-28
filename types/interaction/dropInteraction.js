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
var DropInteraction = (function (_super) {
    __extends(DropInteraction, _super);
    function DropInteraction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onDrop = function (canvas, e) {
            var event = e;
            canvas.eventEmitter.emit('canvas:drop', {
                coordinate: canvas.viewportToPixelCoordinate(new Vector2d_1.default(event.clientX, event.clientY)),
                dataTransfer: event.dataTransfer
            });
        };
        _this.onDragOver = function (canvas, e) {
            e.preventDefault();
        };
        return _this;
    }
    DropInteraction.prototype.handleEvent = function (canvas, event) {
        switch (event.type) {
            case 'drop':
                this.onDrop(canvas, event);
                break;
            case 'dragover':
                this.onDragOver(canvas, event);
                break;
        }
    };
    return DropInteraction;
}(Interaction_1.default));
exports.DropInteraction = DropInteraction;
exports.dropInteraction = new DropInteraction();
exports.default = DropInteraction;
