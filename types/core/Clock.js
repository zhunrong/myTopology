"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Clock = (function () {
    function Clock() {
        this.current = 0;
        this.delta = 0;
    }
    Clock.prototype.update = function () {
        var current = (typeof performance === 'undefined' ? Date : performance).now();
        this.delta = this.current ? current - this.current : 0;
        this.current = current;
    };
    Clock.prototype.getDelta = function () {
        return this.delta;
    };
    return Clock;
}());
exports.Clock = Clock;
exports.default = Clock;
