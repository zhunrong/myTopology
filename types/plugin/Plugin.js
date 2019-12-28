"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Plugin = (function () {
    function Plugin() {
        this.canvas = null;
        this.enable = true;
    }
    Plugin.prototype.update = function () { };
    Plugin.prototype.handleEvent = function (event) { };
    return Plugin;
}());
exports.Plugin = Plugin;
exports.default = Plugin;
