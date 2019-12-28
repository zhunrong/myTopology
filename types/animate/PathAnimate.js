"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Math2d_1 = __importDefault(require("../utils/Math2d"));
var PathAnimate = (function () {
    function PathAnimate() {
        this.path = [];
        this.element = null;
        this.duration = 1000;
        this.progress = 0;
        this._lastPoint = null;
    }
    PathAnimate.prototype.update = function (timeDelta) {
        if (!this.element)
            return;
        if (this.duration <= 0)
            return;
        this.progress += timeDelta / this.duration;
        this.progress %= 1;
        var currentPoint = Math2d_1.default.getLinePoint(this.path, this.progress);
        if (!currentPoint)
            return;
        if (this._lastPoint) {
            var rotate = currentPoint.clone().substract(this._lastPoint).xAxisAngle();
            this.element.rotate = rotate;
            this.element.position.copy(currentPoint);
        }
        this._lastPoint = currentPoint;
    };
    PathAnimate.prototype.render = function (ctx) {
        if (!this.element)
            return;
        if (this.duration <= 0)
            return;
        this.element.render(ctx);
    };
    return PathAnimate;
}());
exports.PathAnimate = PathAnimate;
exports.default = PathAnimate;
