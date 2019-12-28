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
var ForceTransport = (function (_super) {
    __extends(ForceTransport, _super);
    function ForceTransport() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.M = 1;
        _this.Q = 32;
        _this.force = new Vector2d_1.default();
        _this.accelerate = new Vector2d_1.default();
        return _this;
    }
    ForceTransport.prototype.update = function () {
        if (!this.node)
            return;
        this.accelerate.copy(this.force).scale(1 / this.M);
        this.speed.add(this.accelerate);
        this.node.translate(this.speed);
    };
    return ForceTransport;
}(Layout_1.Transport));
var MIN_DISTANCE_BETWEEN_NODE = 30;
var ForceLayout = (function (_super) {
    __extends(ForceLayout, _super);
    function ForceLayout() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.transports = [];
        _this.elasticity = 0.01;
        _this.attractive = 0.005;
        _this.repulsion = 20;
        _this.damping = 0.1;
        _this.edgeLength = 100;
        _this.complete = false;
        _this.animate = true;
        return _this;
    }
    ForceLayout.prototype.layout = function () {
        this.canvas.layout = this;
        var nodes = this.canvas.rootNode.children;
        var count = nodes.length;
        if (count === 0)
            return;
        this.complete = false;
        this.transports = nodes.map(function (node) {
            var transport = new ForceTransport();
            transport.node = node;
            return transport;
        });
        this.canvas.repaint = true;
    };
    ForceLayout.prototype.update = function () {
        if (this.complete)
            return false;
        this.calculateForce();
        var complete = true;
        this.transports.forEach(function (transport) {
            transport.update();
            if (complete) {
                complete = complete && transport.speed.magnitude < 0.1;
            }
        });
        this.complete = complete;
        this.canvas.optimizeNode();
        return this.animate ? true : this.update();
    };
    ForceLayout.prototype.calculateForce = function () {
        var _this = this;
        var canvasCenter = new Vector2d_1.default(this.canvas.canvasWidth / 2, this.canvas.canvasHeight / 2);
        this.transports.forEach(function (source) {
            var sourceNode = source.node;
            source.force.x = 0;
            source.force.y = 0;
            _this.transports.forEach(function (target) {
                if (source === target)
                    return;
                var targetNode = target.node;
                var targetToSource = sourceNode.centerPoint.substract(targetNode.centerPoint);
                var distance = targetToSource.magnitude;
                distance = distance < MIN_DISTANCE_BETWEEN_NODE ? MIN_DISTANCE_BETWEEN_NODE : distance;
                var forceSize = (source.Q * target.Q) / Math.pow(distance, 2) * _this.repulsion;
                var coulombForce = targetToSource.normalize().scale(forceSize);
                source.force.add(coulombForce);
            });
            sourceNode.edges.forEach(function (edge) {
                var targetNode = edge.sourceNode === sourceNode ? edge.targetNode : edge.sourceNode;
                if (targetNode.renderType === 'NONE')
                    return;
                var sourceToTarget = targetNode.centerPoint.substract(sourceNode.centerPoint);
                var L = sourceToTarget.magnitude;
                L = L > _this.edgeLength ? L - _this.edgeLength : _this.edgeLength;
                var forceSize = L * _this.elasticity;
                var pullForce = sourceToTarget.normalize().scale(forceSize);
                source.force.add(pullForce);
            });
            {
                var forceSize_1 = source.speed.magnitude * _this.damping;
                var dampingForce = source.speed.clone().normalize().scale(-forceSize_1);
                source.force.add(dampingForce);
            }
            var sourceToCenter = canvasCenter.clone().substract(sourceNode.centerPoint);
            var forceSize = sourceToCenter.magnitude * _this.attractive;
            var F = sourceToCenter.normalize().scale(forceSize);
            source.force.add(F);
        });
    };
    return ForceLayout;
}(Layout_1.default));
exports.ForceLayout = ForceLayout;
exports.default = ForceLayout;
