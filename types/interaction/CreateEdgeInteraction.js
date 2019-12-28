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
var Line_1 = __importDefault(require("../edge/Line"));
var CreateEdgeInteraction = (function (_super) {
    __extends(CreateEdgeInteraction, _super);
    function CreateEdgeInteraction(onCreate) {
        var _this = _super.call(this) || this;
        _this.onMouseUp = function (canvas) {
            if (_this.edge) {
                canvas.rootNode.getDescendantDF(function (node) {
                    if (node.isPointIn()) {
                        _this.targetNode = node;
                        return true;
                    }
                });
                if (_this.targetNode && _this.sourceNode &&
                    _this.targetNode !== _this.sourceNode &&
                    !_this.targetNode.hasDescendant(_this.sourceNode) &&
                    !_this.sourceNode.hasDescendant(_this.targetNode)) {
                    _this.edge.targetNode = _this.targetNode;
                    _this.targetNode.addEdge(_this.edge);
                    canvas.virtualNode.removeEdge(_this.edge);
                    _this.targetNode.isUpdate = true;
                    _this.edge = undefined;
                    _this.targetNode = undefined;
                    _this.sourceNode = undefined;
                }
                else {
                    canvas.removeEdge(_this.edge);
                    _this.edge = undefined;
                    _this.targetNode = undefined;
                    _this.sourceNode = undefined;
                }
            }
            else {
                canvas.rootNode.getDescendantDF(function (node) {
                    if (node.isPointIn()) {
                        _this.sourceNode = node;
                        return true;
                    }
                });
                if (_this.sourceNode) {
                    _this.edge = _this.onCreate(_this.sourceNode, canvas.virtualNode);
                    canvas.addEdge(_this.edge);
                }
            }
            canvas.repaint = true;
        };
        _this.onMouseMove = function (canvas) {
            canvas.virtualNode.position = canvas.viewportToPixelCoordinate(canvas.mousemovePosition);
            if (_this.sourceNode) {
                canvas.virtualNode.isUpdate = true;
            }
            canvas.repaint = true;
        };
        _this.onUninstall = function (canvas) {
            if (_this.edge) {
                canvas.removeEdge(_this.edge);
                _this.edge = undefined;
                _this.targetNode = undefined;
                _this.sourceNode = undefined;
            }
            canvas.repaint = true;
        };
        _this.onCreate = onCreate || (function (sourceNode, targetNode) { return new Line_1.default({
            text: '',
            sourceNode: sourceNode,
            targetNode: targetNode,
            arrow: true,
            dash: false,
            doubleArrow: false
        }); });
        return _this;
    }
    CreateEdgeInteraction.prototype.handleEvent = function (canvas, event) {
        switch (event.type) {
            case 'mouseup':
                this.onMouseUp(canvas);
                break;
            case 'mousemove':
                this.onMouseMove(canvas);
                break;
        }
    };
    return CreateEdgeInteraction;
}(Interaction_1.default));
exports.CreateEdgeInteraction = CreateEdgeInteraction;
exports.default = CreateEdgeInteraction;
