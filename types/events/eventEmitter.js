"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = (function () {
    function EventEmitter() {
        this.events = {};
    }
    EventEmitter.prototype.on = function (eventName, listener) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(listener);
    };
    EventEmitter.prototype.off = function (eventName, listener) {
        if (!this.events[eventName])
            return;
        var index = this.events[eventName].findIndex(function (item) { return item === listener; });
        this.events[eventName].splice(index, 1);
    };
    EventEmitter.prototype.emit = function (eventName, params) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(function (listener) {
                listener(params);
            });
        }
    };
    EventEmitter.prototype.clear = function () {
        var _this = this;
        Object.keys(this.events).forEach(function (key) {
            delete _this.events[key];
        });
    };
    return EventEmitter;
}());
exports.EventEmitter = EventEmitter;
exports.default = EventEmitter;
