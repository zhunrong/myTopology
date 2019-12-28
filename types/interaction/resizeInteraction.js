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
var Math2d_1 = __importDefault(require("../utils/Math2d"));
var selectInteraction_1 = require("./selectInteraction");
var dragInteraction_1 = require("./dragInteraction");
var anchorPositionOffset = new Vector2d_1.default(-3, -3);
var ResizeInteraction = (function (_super) {
    __extends(ResizeInteraction, _super);
    function ResizeInteraction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.flag = false;
        _this.activeAnchorIndex = -1;
        _this.onInstall = function (canvas) {
            canvas.topCanvasMount();
        };
        _this.onUninstall = function (canvas) {
            canvas.topCanvasCtx.clearRect(0, 0, canvas.viewWidth, canvas.viewHeight);
            canvas.topCanvasUnmount();
        };
        _this.onMouseUp = function (canvas) {
            _this.activeAnchorIndex = -1;
            dragInteraction_1.dragInteraction.onMouseUp(canvas);
        };
        _this.onMouseDown = function (canvas) {
            _this.activeAnchorIndex = _this.getActiveAnchorIndex(canvas);
            if (_this.activeAnchorIndex === -1) {
                selectInteraction_1.selectInteraction.onMouseDown(canvas);
                dragInteraction_1.dragInteraction.onMouseDown(canvas);
                var activeNode = canvas.getActiveNodes()[0];
                if (activeNode && activeNode.canResize && activeNode.isExpanded) {
                    _this.activeNode = activeNode;
                }
                else {
                    _this.activeNode = undefined;
                }
            }
        };
        _this.onMouseMove = function (canvas, e) {
            var activeNode = _this.activeNode;
            if (_this.activeAnchorIndex > -1 && activeNode) {
                var event_1 = e;
                var coordinate = canvas.viewportToPixelCoordinate(new Vector2d_1.default(event_1.clientX, event_1.clientY));
                activeNode.isUpdate = true;
                canvas.repaint = true;
                if (activeNode.shapeType === 'rect') {
                    resizeRectNode(activeNode, _this.activeAnchorIndex, coordinate);
                }
                else {
                    resizeCircleNode(activeNode, _this.activeAnchorIndex, coordinate);
                }
                activeNode.render();
            }
            else {
                var index = _this.getActiveAnchorIndex(canvas);
                var mouseCursor = 'default';
                if (index > -1) {
                    switch (index) {
                        case 0:
                            mouseCursor = 'nwse-resize';
                            break;
                        case 1:
                            mouseCursor = 'nesw-resize';
                            break;
                        case 2:
                            mouseCursor = 'nwse-resize';
                            break;
                        case 3:
                            mouseCursor = 'nesw-resize';
                            break;
                        case 4:
                            mouseCursor = 'ns-resize';
                            break;
                        case 5:
                            mouseCursor = 'ew-resize';
                            break;
                        case 6:
                            mouseCursor = 'ns-resize';
                            break;
                        case 7:
                            mouseCursor = 'ew-resize';
                            break;
                    }
                }
                else {
                    dragInteraction_1.dragInteraction.onMouseMove(canvas);
                }
                canvas.wrapper.style.cursor = mouseCursor;
            }
        };
        _this.onUpdate = function (canvas) {
            canvas.topCanvasCtx.clearRect(0, 0, canvas.viewWidth, canvas.viewHeight);
            if (_this.activeNode) {
                var points = __spreadArrays(_this.activeNode.boundingRect, _this.activeNode.boundingJoinPoints);
                canvas.topCanvasCtx.save();
                canvas.topCanvasCtx.fillStyle = '#2D8CF5';
                canvas.topCanvasCtx.beginPath();
                points.forEach(function (point) {
                    var canvasCoordinate = canvas.pixelToCanvasCoordinate(point);
                    canvas.topCanvasCtx.rect(canvasCoordinate.x - 3, canvasCoordinate.y - 3, 6, 6);
                    canvas.topCanvasCtx.fill();
                });
                canvas.topCanvasCtx.restore();
            }
        };
        return _this;
    }
    ResizeInteraction.prototype.getActiveAnchorIndex = function (canvas) {
        if (!this.activeNode)
            return -1;
        var points = __spreadArrays(this.activeNode.boundingRect, this.activeNode.boundingJoinPoints);
        var index = 0;
        var anchor = points.find(function (point, i) {
            var anchorRectPosition = canvas.pixelToViewportCoordinate(point).add(anchorPositionOffset);
            index = i;
            return Math2d_1.default.isPointInRect(canvas.mousemovePosition, anchorRectPosition, 6, 6);
        });
        if (!anchor)
            return -1;
        return index;
    };
    ResizeInteraction.prototype.handleEvent = function (canvas, event) {
        switch (event.type) {
            case 'mousedown':
                this.onMouseDown(canvas);
                break;
            case 'mousemove':
                this.onMouseMove(canvas, event);
                break;
            case 'mouseup':
                this.onMouseUp(canvas);
                break;
        }
    };
    return ResizeInteraction;
}(Interaction_1.default));
exports.ResizeInteraction = ResizeInteraction;
function resizeRectNode(activeNode, anchorIndex, coordinate) {
    var nodeBoundingRect = activeNode.boundingRect;
    var currentWidth = activeNode.getWidth();
    var currentHeight = activeNode.getHeight();
    switch (anchorIndex) {
        case 0:
            currentWidth = nodeBoundingRect[2].x - coordinate.x;
            currentHeight = nodeBoundingRect[2].y - coordinate.y;
            if (currentWidth >= activeNode.minWidth) {
                activeNode.position.x = coordinate.x;
                activeNode.width = currentWidth;
            }
            if (currentHeight >= activeNode.minHeight) {
                activeNode.position.y = coordinate.y;
                activeNode.height = currentHeight;
            }
            break;
        case 1:
            currentWidth = coordinate.x - nodeBoundingRect[3].x;
            currentHeight = nodeBoundingRect[3].y - coordinate.y;
            if (currentWidth >= activeNode.minWidth) {
                activeNode.width = currentWidth;
            }
            if (currentHeight >= activeNode.minHeight) {
                activeNode.position.y = coordinate.y;
                activeNode.height = currentHeight;
            }
            break;
        case 2:
            currentWidth = coordinate.x - nodeBoundingRect[0].x;
            currentHeight = coordinate.y - nodeBoundingRect[0].y;
            if (currentWidth >= activeNode.minWidth) {
                activeNode.width = currentWidth;
            }
            if (currentHeight >= activeNode.minHeight) {
                activeNode.height = currentHeight;
            }
            break;
        case 3:
            currentWidth = nodeBoundingRect[1].x - coordinate.x;
            currentHeight = coordinate.y - nodeBoundingRect[1].y;
            if (currentWidth >= activeNode.minWidth) {
                activeNode.position.x = coordinate.x;
                activeNode.width = currentWidth;
            }
            if (currentHeight >= activeNode.minHeight) {
                activeNode.height = currentHeight;
            }
            break;
        case 4:
            currentHeight = nodeBoundingRect[2].y - coordinate.y;
            if (currentHeight >= activeNode.minHeight) {
                activeNode.position.y = coordinate.y;
                activeNode.height = currentHeight;
            }
            break;
        case 5:
            currentWidth = coordinate.x - nodeBoundingRect[0].x;
            if (currentWidth >= activeNode.minWidth) {
                activeNode.width = currentWidth;
            }
            break;
        case 6:
            currentHeight = coordinate.y - nodeBoundingRect[0].y;
            if (currentHeight >= activeNode.minHeight) {
                activeNode.height = currentHeight;
            }
            break;
        case 7:
            currentWidth = nodeBoundingRect[2].x - coordinate.x;
            if (currentWidth >= activeNode.minWidth) {
                activeNode.position.x = coordinate.x;
                activeNode.width = currentWidth;
            }
            break;
    }
}
function resizeCircleNode(activeNode, anchorIndex, coordinate) {
    var currentRadius = activeNode.radius;
    var minRadius = activeNode.minRadius;
    var center = activeNode.centerPoint;
    switch (anchorIndex) {
        case 0:
        case 1:
        case 2:
        case 3:
            currentRadius = Vector2d_1.default.copy(coordinate).substract(center).magnitude / Math.sqrt(2);
            break;
        case 4:
        case 5:
        case 6:
        case 7:
            currentRadius = Vector2d_1.default.copy(coordinate).substract(center).magnitude;
            break;
    }
    if (currentRadius >= minRadius) {
        activeNode.radius = currentRadius;
        activeNode.position.y = center.y - currentRadius;
        activeNode.position.x = center.x - currentRadius;
    }
}
exports.resizeInteraction = new ResizeInteraction();
exports.default = ResizeInteraction;
