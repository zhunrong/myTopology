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
var MatrixLayout = (function (_super) {
    __extends(MatrixLayout, _super);
    function MatrixLayout() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rows = 0;
        _this.rowGap = 10;
        _this.columns = 0;
        _this.columnGap = 10;
        _this.nodeRadius = 50;
        _this.duration = 0;
        _this.transports = [];
        return _this;
    }
    MatrixLayout.prototype.layout = function () {
        this.canvas.layout = this;
        var nodes = this.canvas.rootNode.children;
        var count = nodes.length;
        if (count === 0)
            return;
        this.transports = [];
        var rows = 0;
        var columns = 0;
        if (this.rows > 0) {
            rows = this.rows;
            columns = Math.ceil(count / rows);
        }
        else if (this.columns > 0) {
            columns = this.columns;
            rows = Math.ceil(count / columns);
        }
        else {
            rows = Math.ceil(Math.sqrt(count));
            columns = Math.ceil(count / rows);
        }
        var totalWidth = columns * this.nodeRadius * 2 + (columns - 1) * this.columnGap;
        var totalHeight = rows * this.nodeRadius * 2 + (rows - 1) * this.rowGap;
        var origin = new Vector2d_1.default((this.canvas.canvasWidth - totalWidth) / 2 + this.nodeRadius, (this.canvas.canvasHeight - totalHeight) / 2 + this.nodeRadius);
        for (var r = 1; r <= rows; r++) {
            for (var c = 1; c <= columns; c++) {
                var node = nodes[(r - 1) * columns + c - 1];
                if (!node)
                    break;
                var transport = new Layout_1.Transport();
                transport.node = node;
                transport.destination.copy(origin);
                transport.destination.x += (c - 1) * (this.nodeRadius * 2 + this.columnGap);
                transport.destination.y += (r - 1) * (this.nodeRadius * 2 + this.rowGap);
                transport.duration = this.duration;
                this.transports.push(transport);
            }
        }
        this.canvas.repaint = true;
    };
    return MatrixLayout;
}(Layout_1.default));
exports.MatrixLayout = MatrixLayout;
exports.default = MatrixLayout;
