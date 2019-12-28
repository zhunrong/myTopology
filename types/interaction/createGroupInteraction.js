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
var RectDomGroup_1 = __importDefault(require("../node/RectDomGroup"));
var RectCanvasGroup_1 = __importDefault(require("../node/RectCanvasGroup"));
var ContextMenu_1 = __importDefault(require("../plugin/ContextMenu"));
var utils_1 = require("../utils/utils");
var CreateGroupInteraction = (function (_super) {
    __extends(CreateGroupInteraction, _super);
    function CreateGroupInteraction(onCreate) {
        var _this = _super.call(this) || this;
        _this.onContextMenu = function (canvas, e) {
            var contextMenu = canvas.plugins.find(function (plugin) { return plugin instanceof ContextMenu_1.default; });
            if (!contextMenu)
                return;
            var activeNodes = canvas.getActiveNodes();
            var event = e;
            if (activeNodes.length) {
                _this.parentNode = undefined;
                var index = activeNodes.findIndex(function (node) {
                    if (!node.parent)
                        return false;
                    if (_this.parentNode && _this.parentNode !== node.parent)
                        return true;
                    _this.parentNode = node.parent;
                    return false;
                });
                if (index === -1) {
                    contextMenu.show([
                        {
                            label: '添加到组',
                            command: 'addToGroup'
                        }
                    ], event.clientX, event.clientY);
                }
            }
        };
        _this.onInstall = function (canvas) {
            _this.canvas = canvas;
            canvas.eventEmitter.on('canvas:menu', _this.onAddToGroup);
        };
        _this.onUninstall = function (canvas) {
            canvas.eventEmitter.off('canvas:menu', _this.onAddToGroup);
        };
        _this.onAddToGroup = function (menu) {
            if (menu.command !== 'addToGroup')
                return;
            var activeNodes = _this.canvas.getActiveNodes();
            if (!activeNodes.length)
                return;
            var group = _this.onCreate();
            activeNodes.forEach(function (node) { return group.addChild(node); });
            var _a = getActiveNodesBoundingRect(activeNodes), xMin = _a.xMin, yMin = _a.yMin, xMax = _a.xMax, yMax = _a.yMax;
            if (utils_1.isRectNode(group)) {
                group.width = xMax - xMin + 40;
                group.height = yMax - yMin + 40;
            }
            if (utils_1.isCircleNode(group)) { }
            group.position.x = xMin - 20;
            group.position.y = yMin - 20;
            if (_this.parentNode) {
                _this.parentNode.addChild(group);
                _this.canvas.setNodeTop(group);
                _this.canvas.repaint = true;
            }
            else {
                _this.canvas.addNode(group);
            }
        };
        _this.onCreate = onCreate || (function () {
            if (_this.canvas.renderType === 'CANVAS') {
                return new RectCanvasGroup_1.default({
                    id: Math.random()
                });
            }
            else {
                return new RectDomGroup_1.default({
                    id: Math.random()
                });
            }
        });
        return _this;
    }
    CreateGroupInteraction.prototype.handleEvent = function (canvas, event) {
        switch (event.type) {
            case 'contextmenu':
                this.onContextMenu(canvas, event);
                break;
        }
    };
    return CreateGroupInteraction;
}(Interaction_1.default));
exports.CreateGroupInteraction = CreateGroupInteraction;
function getActiveNodesBoundingRect(activeNodes) {
    var xMin = Number.MAX_SAFE_INTEGER;
    var yMin = Number.MAX_SAFE_INTEGER;
    var xMax = Number.MIN_SAFE_INTEGER;
    var yMax = Number.MIN_SAFE_INTEGER;
    activeNodes.forEach(function (node) {
        node.boundingRect.forEach(function (point) {
            xMin = Math.min(xMin, point.x);
            yMin = Math.min(yMin, point.y);
            xMax = Math.max(xMax, point.x);
            yMax = Math.max(yMax, point.y);
        });
    });
    return { xMin: xMin, yMin: yMin, xMax: xMax, yMax: yMax };
}
exports.createGroupInteraction = new CreateGroupInteraction();
exports.default = CreateGroupInteraction;
