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
var RectNode_1 = __importDefault(require("../graph/RectNode"));
var rectDomNode_less_1 = __importDefault(require("./rectDomNode.less"));
var RectDomNode = (function (_super) {
    __extends(RectDomNode, _super);
    function RectDomNode(options) {
        var _this = _super.call(this, options) || this;
        _this.renderType = 'DOM';
        _this.$el = document.createElement('div');
        _this.$el.className = rectDomNode_less_1.default.node;
        return _this;
    }
    RectDomNode.prototype.mount = function (force) {
        if (force === void 0) { force = false; }
        if (this.mounted && !force)
            return;
        if (this.canvas) {
            this.mounted = true;
            this.canvas.wrapper.appendChild(this.$el);
        }
    };
    RectDomNode.prototype.unmount = function () {
        if (!this.mounted || !this.canvas)
            return;
        this.mounted = false;
        if (this.$el.parentElement) {
            this.$el.parentElement.removeChild(this.$el);
        }
    };
    RectDomNode.prototype.render = function (ctx) {
        this.$el.innerHTML = "<div style=\"height:100%;\n                                      display:flex;\n                                      align-items:center;\n                                      justify-content:center;\n                                      border:1px solid #29c1f8;\n                                      box-sizing: border-box;\n                                      font-size:12px;\n                                      user-select: none;\n                                      color:#29c1f8;\">" + this.text + "</div>";
    };
    RectDomNode.prototype.update = function (ctx) {
        if (!this.canvas)
            return;
        var _a = this.getPosition(), x = _a.x, y = _a.y;
        var width = this.getWidth();
        var height = this.getHeight();
        Object.assign(this.$el.style, {
            transform: "scale(" + this.canvas.canvasScale + ") translate3d(" + x + "px," + y + "px,0)",
            width: width + "px",
            height: height + "px",
            boxShadow: this.active ? "0 0 5px 0 " + this.style.activeColor : 'none'
        });
    };
    return RectDomNode;
}(RectNode_1.default));
exports.RectDomNode = RectDomNode;
exports.default = RectDomNode;
