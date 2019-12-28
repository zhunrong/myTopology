"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var RectNode_1 = __importDefault(require("../graph/RectNode"));
var CircleNode_1 = __importDefault(require("../graph/CircleNode"));
var RectDomGroup_1 = __importDefault(require("../node/RectDomGroup"));
function throttle(func) {
    var running = false;
    return function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        if (running)
            return;
        running = true;
        func.apply(void 0, params);
        requestAnimationFrame(function () {
            running = false;
        });
    };
}
exports.throttle = throttle;
function imgLoad(src) {
    return new Promise(function (resolve, reject) {
        var img = new Image();
        img.src = src;
        img.onload = function () {
            resolve(img);
        };
        img.onerror = function () {
            reject();
        };
    });
}
exports.imgLoad = imgLoad;
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            if (name === 'constructor')
                return;
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
exports.applyMixins = applyMixins;
function isRectNode(node) {
    return node instanceof RectNode_1.default;
}
exports.isRectNode = isRectNode;
function isCircleNode(node) {
    return node instanceof CircleNode_1.default;
}
exports.isCircleNode = isCircleNode;
function isRectDomGroup(node) {
    return node instanceof RectDomGroup_1.default;
}
exports.isRectDomGroup = isRectDomGroup;
