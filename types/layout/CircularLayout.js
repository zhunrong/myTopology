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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Layout_1 = __importStar(require("./Layout"));
var Vector2d_1 = __importDefault(require("../utils/Vector2d"));
var PI2 = Math.PI * 2;
var CircularLayout = (function (_super) {
    __extends(CircularLayout, _super);
    function CircularLayout() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.clockwise = true;
        _this.radius = 0;
        _this.startAngle = 0;
        _this.endAngle = Math.PI * 2;
        _this.duration = 0;
        _this.gap = 10;
        _this.nodeRadius = 50;
        return _this;
    }
    CircularLayout.prototype.layout = function () {
        this.canvas.layout = this;
        var nodes = this.canvas.rootNode.children;
        var count = nodes.length;
        if (count === 0)
            return;
        this.transports = [];
        var totalAngle = Math.abs(this.endAngle - this.startAngle);
        var rounds = 0;
        var nums = 0;
        var innerRadius = this.radius;
        if (totalAngle > 0) {
            rounds = Math.ceil(totalAngle / PI2);
            nums = Math.ceil(count / (totalAngle / PI2));
            innerRadius = (this.nodeRadius + this.gap / 2) / Math.sin(rounds === 1 ? totalAngle / count / 2 : PI2 / nums / 2);
        }
        else if (innerRadius > 0) {
            var avgAngle = Math.asin((this.nodeRadius + this.gap / 2) / innerRadius) * 2;
            nums = Math.floor(PI2 / avgAngle);
            rounds = Math.ceil(count / nums);
            totalAngle = PI2 / nums * count;
        }
        else {
            totalAngle = PI2;
            rounds = 1;
            nums = count;
            innerRadius = (this.nodeRadius + this.gap / 2) / Math.sin(totalAngle / count / 2);
        }
        var origin = new Vector2d_1.default(this.canvas.canvasWidth / 2, this.canvas.canvasHeight / 2);
        for (var r = 1; r <= rounds; r++) {
            for (var n = 1; n <= nums; n++) {
                var node = nodes[(r - 1) * nums + n - 1];
                if (!node)
                    break;
                var transport = new Layout_1.Transport();
                this.transports.push(transport);
                transport.node = node;
                transport.duration = this.duration;
                transport.destination.copy(Vector2d_1.default.xAxis);
                var radius = innerRadius + (r - 1) * (this.nodeRadius * 2 + this.gap);
                if (r === rounds) {
                    var lastAngle = totalAngle % PI2 || PI2;
                    var lastNum = count % nums || nums;
                    var angleInterval = lastAngle === PI2 ? lastAngle / lastNum : lastAngle / ((lastNum - 1) || 2);
                    var angle = angleInterval * (n % lastNum);
                    var rotate = this.startAngle + (this.clockwise ? angle : -angle);
                    transport.destination.scale(radius).rotate(rotate).add(origin);
                }
                else {
                    var angleInterval = PI2 / nums;
                    var angle = angleInterval * (n - 1);
                    var rotate = this.startAngle + (this.clockwise ? angle : -angle);
                    transport.destination.scale(radius).rotate(rotate).add(origin);
                }
            }
        }
        this.canvas.repaint = true;
    };
    return CircularLayout;
}(Layout_1.default));
exports.CircularLayout = CircularLayout;
exports.default = CircularLayout;
