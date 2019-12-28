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
var Graph_1 = __importDefault(require("./Graph"));
var Edge = (function (_super) {
    __extends(Edge, _super);
    function Edge(options) {
        var _this = _super.call(this, options) || this;
        _this.renderType = 'CANVAS';
        _this.targetNode = options.targetNode;
        _this.sourceNode = options.sourceNode;
        return _this;
    }
    Edge.prototype.getTargetNode = function () {
        var parent = this.targetNode.parent;
        var isAllExpanded = true;
        while (parent) {
            if (!parent.isExpanded) {
                isAllExpanded = false;
            }
            parent = parent.parent;
        }
        if (isAllExpanded) {
            return this.targetNode;
        }
        else {
            var node = this.targetNode;
            while (!node.visible && node.parent && node.parent.renderType !== 'NONE') {
                node = node.parent;
            }
            return node;
        }
    };
    Edge.prototype.getSourceNode = function () {
        var parent = this.sourceNode.parent;
        var isAllExpanded = true;
        while (parent) {
            if (!parent.isExpanded) {
                isAllExpanded = false;
            }
            parent = parent.parent;
        }
        if (isAllExpanded) {
            return this.sourceNode;
        }
        else {
            var node = this.sourceNode;
            while (!node.visible && node.parent && node.parent.renderType !== 'NONE') {
                node = node.parent;
            }
            return node;
        }
    };
    return Edge;
}(Graph_1.default));
exports.Edge = Edge;
exports.default = Edge;
