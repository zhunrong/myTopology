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
var CollapseAndExpandInteraction = (function (_super) {
    __extends(CollapseAndExpandInteraction, _super);
    function CollapseAndExpandInteraction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lastTimestamp = 0;
        _this.onMouseDown = function (canvas) {
            var now = Date.now();
            if (now - _this.lastTimestamp < 300) {
                var activeNode = canvas.getActiveNodes()[0];
                if (activeNode && activeNode.isGroup) {
                    activeNode.isExpanded = !activeNode.isExpanded;
                    activeNode.isUpdate = true;
                    activeNode.render();
                    canvas.repaint = true;
                }
            }
            _this.lastTimestamp = now;
        };
        return _this;
    }
    CollapseAndExpandInteraction.prototype.handleEvent = function (canvas, event) {
        switch (event.type) {
            case 'mousedown':
                this.onMouseDown(canvas);
                break;
        }
    };
    return CollapseAndExpandInteraction;
}(Interaction_1.default));
exports.CollapseAndExpandInteraction = CollapseAndExpandInteraction;
exports.collapseAndExpandInteraction = new CollapseAndExpandInteraction();
exports.default = CollapseAndExpandInteraction;
