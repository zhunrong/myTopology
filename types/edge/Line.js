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
var Vector2d_1 = __importDefault(require("../utils/Vector2d"));
var Edge_1 = require("../graph/Edge");
var Math2d_1 = __importDefault(require("../utils/Math2d"));
var Triangle_1 = __importDefault(require("../element/Triangle"));
var Text_1 = __importDefault(require("../element/Text"));
var Polyline_1 = __importDefault(require("../element/Polyline"));
var PathAnimate_1 = __importDefault(require("../animate/PathAnimate"));
var utils_1 = require("../utils/utils");
var ARROW_SIZE = { width: 8, height: 10 };
var Line = (function (_super) {
    __extends(Line, _super);
    function Line(options) {
        var _this = _super.call(this, options) || this;
        _this.lineElement = new Polyline_1.default();
        _this.sourceArrowElement = new Triangle_1.default(ARROW_SIZE);
        _this.targetArrowElement = new Triangle_1.default(ARROW_SIZE);
        _this.textElement = new Text_1.default('');
        _this.animate = new PathAnimate_1.default();
        _this.dash = options.dash || false;
        _this.arrow = options.arrow || false;
        _this.doubleArrow = options.doubleArrow || false;
        _this.textElement.text = _this.text;
        _this.textElement.offset.y = -10;
        _this.style.lineWidth = 2;
        _this.animate.element = options.animateElement || null;
        _this.animate.duration = options.animateDuration || 0;
        return _this;
    }
    Line.prototype.isInRect = function () {
        return true;
    };
    Line.prototype.isPointIn = function () {
        var targetNode = this.getTargetNode();
        var sourceNode = this.getSourceNode();
        if (!targetNode.visible && !sourceNode.visible)
            return false;
        var canvas = this.canvas;
        if (!canvas)
            return false;
        if (!canvas.nativeEvent)
            return false;
        if (!this.begin || !this.end)
            return false;
        var event = canvas.nativeEvent;
        var viewCoordinate = new Vector2d_1.default(event.clientX, event.clientY);
        var pixelCoordinate = canvas.viewportToPixelCoordinate(viewCoordinate);
        if (this.lineElement.isPointIn(pixelCoordinate))
            return true;
        if (this.doubleArrow) {
            if (this.sourceArrowElement.isPointIn(pixelCoordinate))
                return true;
            if (this.targetArrowElement.isPointIn(pixelCoordinate))
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
    Line.prototype.render = function (ctx) {
        var targetNode = this.getTargetNode();
        var sourceNode = this.getSourceNode();
        ctx = ctx || (this.canvas && this.canvas.graphCanvasCtx);
        if (!ctx)
            return;
        if (sourceNode.visible || targetNode.visible) {
            var sourceCenter = sourceNode.centerPoint;
            var targetCenter = targetNode.centerPoint;
            var beginToEnd = [sourceCenter, targetCenter];
            if (utils_1.isCircleNode(sourceNode)) {
                this.begin = intersectWithCircle(sourceCenter, sourceNode.radius, targetCenter);
            }
            else {
                this.begin = intersectWithRect(beginToEnd, sourceNode.boundingRect);
            }
            if (!this.begin)
                return;
            if (utils_1.isCircleNode(targetNode)) {
                this.end = intersectWithCircle(targetCenter, targetNode.radius, sourceCenter);
            }
            else {
                this.end = intersectWithRect(beginToEnd, targetNode.boundingRect);
            }
            if (!this.end)
                return;
            var sourceToTarget = Vector2d_1.default.copy(this.end).substract(this.begin);
            ctx.save();
            ctx.strokeStyle = this.active ? this.style.activeColor : this.style.color;
            ctx.fillStyle = this.active ? this.style.activeColor : this.style.color;
            if (this.dash) {
                ctx.setLineDash([4, 4]);
            }
            this.lineElement.lineWidth = this.style.lineWidth;
            this.lineElement.points = [this.begin, this.end];
            this.lineElement.render(ctx);
            var rotate = sourceToTarget.xAxisAngle();
            if (this.text) {
                this.textElement.text = this.text;
                var lineCenter = Vector2d_1.default.copy(this.begin).add(Vector2d_1.default.copy(sourceToTarget).scale(1 / 2));
                this.textElement.position.copy(lineCenter);
                this.textElement.rotate = (-Math.PI / 2 <= rotate && rotate < Math.PI / 2) ? rotate : rotate - Math.PI;
                this.textElement.render(ctx);
            }
            if (this.doubleArrow) {
                this.sourceArrowElement.position.copy(this.begin);
                this.sourceArrowElement.rotate = rotate + Math.PI;
                this.sourceArrowElement.render(ctx);
                this.targetArrowElement.position.copy(this.end);
                this.targetArrowElement.rotate = rotate;
                this.targetArrowElement.render(ctx);
            }
            else if (this.arrow) {
                this.targetArrowElement.position.copy(this.end);
                this.targetArrowElement.rotate = rotate;
                this.targetArrowElement.render(ctx);
            }
            if (this.canvas) {
                this.animate.path = [this.begin, this.end];
                this.animate.update(this.canvas.clock.getDelta());
                this.animate.render(ctx);
            }
            ctx.restore();
        }
    };
    Line.prototype.drawThumbnail = function (ctx) {
        this.render(ctx);
    };
    return Line;
}(Edge_1.Edge));
exports.Line = Line;
function intersectWithRect(line, rect) {
    var length = rect.length;
    for (var i = 0; i < length; i++) {
        var A = rect[i];
        var B = i === length - 1 ? rect[0] : rect[i + 1];
        if (Math2d_1.default.isIntersect(line, [A, B])) {
            return Math2d_1.default.getLineIntersect([A, B], line);
        }
    }
    return undefined;
}
function intersectWithCircle(o, radius, point) {
    var line = Vector2d_1.default.copy(point).substract(o);
    if (line.magnitude < radius)
        return undefined;
    var angle = line.xAxisAngle();
    return Vector2d_1.default.copy(o).add(new Vector2d_1.default(radius * Math.cos(angle), radius * Math.sin(angle)));
}
exports.default = Line;
