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
var SelectInteraction = (function (_super) {
    __extends(SelectInteraction, _super);
    function SelectInteraction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onMouseDown = function (canvas) {
            var activeNode;
            var activeEdge;
            var sign = Math.random();
            canvas.rootNode.getDescendantDF(function (node) {
                if (activeNode || activeEdge || !node.visible) {
                    node.active = false;
                }
                else {
                    node.active = node.isPointIn();
                    if (node.active) {
                        activeNode = node;
                        canvas.setNodeTop(node);
                    }
                }
                node.isUpdate = true;
                node.edges.forEach(function (edge) {
                    if (edge.renderSign === sign)
                        return;
                    edge.renderSign = sign;
                    edge.active = false;
                    if (activeEdge || activeNode)
                        return;
                    if (!edge.sourceNode.visible && !edge.targetNode.visible)
                        return;
                    edge.active = edge.isPointIn();
                    if (edge.active) {
                        activeEdge = edge;
                    }
                });
            });
            canvas.repaint = true;
        };
        return _this;
    }
    SelectInteraction.prototype.handleEvent = function (canvas, event) {
        switch (event.type) {
            case 'mousedown':
                this.onMouseDown(canvas);
                break;
        }
    };
    return SelectInteraction;
}(Interaction_1.default));
exports.SelectInteraction = SelectInteraction;
exports.selectInteraction = new SelectInteraction();
exports.default = SelectInteraction;
