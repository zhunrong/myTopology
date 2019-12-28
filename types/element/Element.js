"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Vector2d_1 = __importDefault(require("../utils/Vector2d"));
var Element = (function () {
    function Element() {
        this.position = new Vector2d_1.default();
        this.offset = new Vector2d_1.default();
        this.rotate = 0;
    }
    return Element;
}());
exports.Element = Element;
exports.default = Element;
