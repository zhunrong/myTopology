"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Vector2d = (function () {
    function Vector2d(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Vector2d.copy = function (target) {
        return target.clone();
    };
    Object.defineProperty(Vector2d.prototype, "magnitude", {
        get: function () {
            return this.getMagnitude();
        },
        enumerable: true,
        configurable: true
    });
    Vector2d.prototype.getMagnitude = function () {
        if (this.x === 0 && this.y === 0) {
            return 0.000000001;
        }
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Vector2d.prototype.add = function (target) {
        this.x += target.x;
        this.y += target.y;
        return this;
    };
    Vector2d.prototype.substract = function (target) {
        this.x -= target.x;
        this.y -= target.y;
        return this;
    };
    Vector2d.prototype.dotProduct = function (target) {
        return this.x * target.x + this.y * target.y;
    };
    Vector2d.prototype.crossProduct = function (target) {
        return this.x * target.y - this.y * target.x;
    };
    Vector2d.prototype.scale = function (scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    };
    Vector2d.prototype.edge = function (target) {
        return this.clone().substract(target);
    };
    Vector2d.prototype.perpendicular = function () {
        return new Vector2d(this.y, -this.x);
    };
    Vector2d.prototype.normalize = function () {
        var magnitude = this.getMagnitude();
        return new Vector2d(this.x / magnitude, this.y / magnitude);
    };
    Vector2d.prototype.normal = function () {
        return this.perpendicular().normalize();
    };
    Vector2d.prototype.cosAngle = function (target) {
        return this.dotProduct(target) / (this.magnitude * target.magnitude);
    };
    Vector2d.prototype.angle = function (target) {
        return Math.acos(this.cosAngle(target));
    };
    Vector2d.prototype.xAxisAngle = function () {
        var angle = this.angle(Vector2d.xAxis);
        return this.y > 0 ? angle : -angle;
    };
    Vector2d.prototype.rotate = function (deg) {
        var _a = this, x = _a.x, y = _a.y;
        this.x = x * Math.cos(deg) - y * Math.sin(deg);
        this.y = x * Math.sin(deg) + y * Math.cos(deg);
        return this;
    };
    Vector2d.prototype.project = function (target) {
        var magnitude = this.dotProduct(target) / target.magnitude;
        return target.normalize().scale(magnitude);
    };
    Vector2d.prototype.equal = function (target) {
        return this.x === target.x && this.y === target.y;
    };
    Vector2d.prototype.distance = function (target) {
        return this.edge(target).magnitude;
    };
    Vector2d.prototype.copy = function (target) {
        this.x = target.x;
        this.y = target.y;
        return this;
    };
    Vector2d.prototype.clone = function () {
        return new Vector2d(this.x, this.y);
    };
    Vector2d.xAxis = new Vector2d(1, 0);
    Vector2d.yAxis = new Vector2d(0, 1);
    return Vector2d;
}());
exports.Vector2d = Vector2d;
exports.default = Vector2d;
