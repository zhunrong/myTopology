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
var Interaction_1 = __importDefault(require("./Interaction"));
var Vector2d_1 = __importDefault(require("../utils/Vector2d"));
var WheelZoomInteraction = (function (_super) {
    __extends(WheelZoomInteraction, _super);
    function WheelZoomInteraction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onWheel = function (canvas, e) {
            var _a = e, deltaY = _a.deltaY, clientX = _a.clientX, clientY = _a.clientY;
            e.preventDefault();
            if (deltaY > 0) {
                canvas.zoomOut(new Vector2d_1.default(clientX, clientY));
            }
            else {
                canvas.zoomIn(new Vector2d_1.default(clientX, clientY));
            }
        };
        return _this;
    }
    WheelZoomInteraction.prototype.handleEvent = function (canvas, event) {
        switch (event.type) {
            case 'wheel':
                this.onWheel(canvas, event);
                break;
        }
    };
    return WheelZoomInteraction;
}(Interaction_1.default));
exports.WheelZoomInteraction = WheelZoomInteraction;
exports.wheelZoomInteraction = new WheelZoomInteraction();
exports.default = WheelZoomInteraction;
