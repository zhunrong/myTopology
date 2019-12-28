"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Vector2d_1 = __importDefault(require("../utils/Vector2d"));
var Transport = (function () {
    function Transport() {
        this.destination = new Vector2d_1.default();
        this.distance = new Vector2d_1.default();
        this.speed = new Vector2d_1.default();
        this.node = null;
        this.duration = 0;
        this.pass = 0;
        this.complete = false;
    }
    Transport.prototype.update = function (timeDelta) {
        if (!this.node || this.complete)
            return;
        this.pass += timeDelta;
        var timeRemain = this.duration > this.pass ? this.duration - this.pass : 0;
        this.distance.copy(this.destination).substract(this.node.centerPoint);
        if (timeDelta < timeRemain) {
            if (this.distance.magnitude > 1) {
                this.speed.copy(this.distance).scale(1 / timeRemain * timeDelta);
                this.node.translate(this.speed);
            }
            else {
                this.complete = true;
            }
        }
        else {
            this.node.translate(this.distance);
            this.complete = true;
        }
    };
    return Transport;
}());
exports.Transport = Transport;
var Layout = (function () {
    function Layout(canvas) {
        this.transports = [];
        this.canvas = canvas;
    }
    Layout.prototype.update = function () {
        var activeTrans = this.transports.filter(function (item) { return !item.complete; });
        this.canvas.optimizeNode();
        if (!activeTrans.length)
            return false;
        var timeDelta = this.canvas.clock.getDelta();
        activeTrans.forEach(function (transport) { return transport.update(timeDelta); });
        return true;
    };
    return Layout;
}());
exports.Layout = Layout;
exports.default = Layout;
