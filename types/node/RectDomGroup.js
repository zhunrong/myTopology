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
var RectDomNode_1 = __importDefault(require("./RectDomNode"));
var RectDomGroup = (function (_super) {
    __extends(RectDomGroup, _super);
    function RectDomGroup(options) {
        var _this = _super.call(this, options) || this;
        _this.isGroup = true;
        _this.canResize = true;
        if (typeof options.isExpanded === 'boolean') {
            _this.isExpanded = options.isExpanded;
        }
        return _this;
    }
    RectDomGroup.prototype.render = function () {
        this.$el.innerHTML = "<div style=\"height:100%;\n                                      display:flex;\n                                      align-items:center;\n                                      justify-content:center;\n                                      border:1px solid #066df2;\n                                      box-sizing:border-box;\">\n                            " + (this.isExpanded ? '' : '...') + "\n                          </div>";
    };
    RectDomGroup.prototype.drawThumbnail = function (ctx) {
        var _a = this.getPosition(), x = _a.x, y = _a.y;
        var width = this.getWidth();
        var height = this.getHeight();
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.strokeStyle = this.active ? this.style.activeColor : this.style.color;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
    };
    return RectDomGroup;
}(RectDomNode_1.default));
exports.RectDomGroup = RectDomGroup;
exports.default = RectDomGroup;
