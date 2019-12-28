"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function noop(canvas, e) { }
var Interaction = (function () {
    function Interaction() {
        this.onInstall = noop;
        this.onUninstall = noop;
        this.onUpdate = noop;
    }
    Interaction.prototype.handleEvent = function (canvas, event) { };
    return Interaction;
}());
exports.Interaction = Interaction;
exports.default = Interaction;
