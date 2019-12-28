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
var Vector2d_1 = require("../utils/Vector2d");
var Edge_1 = require("../graph/Edge");
var Math2d_1 = __importDefault(require("../utils/Math2d"));
var Triangle_1 = __importDefault(require("../element/Triangle"));
var Text_1 = __importDefault(require("../element/Text"));
var Polyline_1 = __importDefault(require("../element/Polyline"));
var PathAnimate_1 = __importDefault(require("../animate/PathAnimate"));
var sourceJoinPointCopy = new Vector2d_1.Vector2d();
var targetNodeCenterCopy = new Vector2d_1.Vector2d();
var ARROW_SIZE = { width: 8, height: 10 };
var L = (function (_super) {
    __extends(L, _super);
    function L(options) {
        var _this = _super.call(this, options) || this;
        _this.middlePoints = [];
        _this.centerPoint = null;
        _this.sourceArrowElement = new Triangle_1.default(ARROW_SIZE);
        _this.targetArrowElement = new Triangle_1.default(ARROW_SIZE);
        _this.textElement = new Text_1.default('');
        _this.lineElement = new Polyline_1.default();
        _this.animate = new PathAnimate_1.default();
        _this.isInRect = function () {
            return true;
        };
        _this.dash = options.dash || false;
        _this.arrow = options.arrow || false;
        _this.doubleArrow = options.doubleArrow || false;
        _this.style.lineWidth = 2;
        _this.textElement.text = _this.text;
        _this.animate.element = options.animateElement || null;
        _this.animate.duration = options.animateDuration || 0;
        return _this;
    }
    L.prototype.isPointIn = function () {
        var sourceNode = this.getSourceNode();
        var targetNode = this.getTargetNode();
        if (!sourceNode.visible && !targetNode.visible)
            return false;
        var canvas = this.canvas;
        if (!canvas)
            return false;
        if (!canvas.nativeEvent)
            return false;
        if (!this.sourceJoinPoint || !this.targetJoinPoint)
            return false;
        var event = canvas.nativeEvent;
        var viewCoordinate = new Vector2d_1.Vector2d(event.clientX, event.clientY);
        var pixelCoordinate = canvas.viewportToPixelCoordinate(viewCoordinate);
        if (this.lineElement.isPointIn(pixelCoordinate))
            return true;
        if (this.doubleArrow) {
            if (this.targetArrowElement.isPointIn(pixelCoordinate))
                return true;
            if (this.sourceArrowElement.isPointIn(pixelCoordinate))
                return true;
        }
        else if (this.arrow) {
            if (this.targetArrowElement.isPointIn(pixelCoordinate))
                return true;
        }
        if (this.text && this.textElement.isPointIn(pixelCoordinate))
            return true;
        return false;
    };
    L.prototype.render = function (ctx) {
        var _this = this;
        ctx = ctx || (this.canvas && this.canvas.graphCanvasCtx);
        if (!ctx)
            return;
        var sourceNode = this.getSourceNode();
        var targetNode = this.getTargetNode();
        if (sourceNode.visible || targetNode.visible) {
            var sourceJoinPoints = sourceNode.boundingJoinPoints;
            var targetJoinPoints_1 = targetNode.boundingJoinPoints;
            var minDistance_1 = 0;
            this.sourceJoinPoint = undefined;
            this.targetJoinPoint = undefined;
            sourceJoinPoints.forEach(function (point1) {
                targetJoinPoints_1.forEach(function (point2) {
                    var distance = point1.distance(point2);
                    if (minDistance_1 > distance || !_this.sourceJoinPoint || !_this.targetJoinPoint) {
                        minDistance_1 = distance;
                        _this.sourceJoinPoint = point1;
                        _this.targetJoinPoint = point2;
                    }
                });
            });
            if (!this.sourceJoinPoint || !this.targetJoinPoint)
                return;
            var sourceJoinPoint = this.sourceJoinPoint;
            var targetJoinPoint = this.targetJoinPoint;
            sourceJoinPointCopy.copy(sourceJoinPoint);
            var outDirection = sourceJoinPointCopy.substract(sourceNode.centerPoint).normalize();
            targetNodeCenterCopy.copy(targetNode.centerPoint);
            var inDirection = targetNodeCenterCopy.substract(targetJoinPoint).normalize();
            if (outDirection.x === 1 || outDirection.x === -1) {
                if (inDirection.x === 1 || inDirection.x === -1) {
                    var middleX = (sourceJoinPoint.x + targetJoinPoint.x) / 2;
                    this.middlePoints = [new Vector2d_1.Vector2d(middleX, sourceJoinPoint.y), new Vector2d_1.Vector2d(middleX, targetJoinPoint.y)];
                }
                else {
                    this.middlePoints = [new Vector2d_1.Vector2d(targetJoinPoint.x, sourceJoinPoint.y)];
                }
            }
            else {
                if (inDirection.x === 1 || inDirection.x === -1) {
                    this.middlePoints = [new Vector2d_1.Vector2d(sourceJoinPoint.x, targetJoinPoint.y)];
                }
                else {
                    var middleY = (sourceJoinPoint.y + targetJoinPoint.y) / 2;
                    this.middlePoints = [new Vector2d_1.Vector2d(sourceJoinPoint.x, middleY), new Vector2d_1.Vector2d(targetJoinPoint.x, middleY)];
                }
            }
            ctx.save();
            ctx.strokeStyle = this.active ? this.style.activeColor : this.style.color;
            ctx.fillStyle = this.active ? this.style.activeColor : this.style.color;
            if (this.dash) {
                ctx.setLineDash([4, 4]);
            }
            this.lineElement.lineWidth = this.style.lineWidth;
            this.lineElement.points = __spreadArrays([sourceJoinPoint], this.middlePoints, [targetJoinPoint]);
            this.lineElement.render(ctx);
            if (this.text) {
                this.centerPoint = Math2d_1.default.getLinePoint(__spreadArrays([sourceJoinPoint], this.middlePoints, [targetJoinPoint]), 0.5);
                if (this.centerPoint) {
                    this.textElement.text = this.text;
                    this.textElement.font = '14px sans-serif';
                    this.textElement.backgroundColor = 'rgba(255,255,255,0.8)';
                    this.textElement.position.copy(this.centerPoint);
                    this.textElement.render(ctx);
                }
            }
            if (this.doubleArrow) {
                this.arrowStart = targetJoinPoint;
                this.targetArrowElement.position.copy(targetJoinPoint);
                this.targetArrowElement.rotate = inDirection.xAxisAngle();
                this.targetArrowElement.render(ctx);
                this.sourceArrowElement.position.copy(sourceJoinPoint);
                this.sourceArrowElement.rotate = outDirection.xAxisAngle() + Math.PI;
                this.sourceArrowElement.render(ctx);
            }
            else if (this.arrow) {
                this.arrowStart = targetJoinPoint;
                this.targetArrowElement.position.copy(targetJoinPoint);
                this.targetArrowElement.rotate = inDirection.xAxisAngle();
                this.targetArrowElement.render(ctx);
            }
            if (this.canvas) {
                this.animate.path = __spreadArrays([sourceJoinPoint], this.middlePoints, [targetJoinPoint]);
                this.animate.update(this.canvas.clock.getDelta());
                this.animate.render(ctx);
            }
            ctx.restore();
        }
    };
    L.prototype.drawThumbnail = function (ctx) {
        this.render(ctx);
    };
    return L;
}(Edge_1.Edge));
exports.L = L;
exports.default = L;
