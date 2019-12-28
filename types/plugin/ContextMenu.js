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
var Plugin_1 = __importDefault(require("./Plugin"));
var Vector2d_1 = __importDefault(require("../utils/Vector2d"));
var ContextMenu_less_1 = __importDefault(require("./ContextMenu.less"));
var ContextMenu = (function (_super) {
    __extends(ContextMenu, _super);
    function ContextMenu() {
        var _this = _super.call(this) || this;
        _this.position = new Vector2d_1.default();
        _this.mounted = false;
        _this.container = document.createElement('div');
        _this.onContextMenu = null;
        _this.menu = [];
        _this.hide = function () {
            if (_this.container.parentElement) {
                _this.container.parentElement.removeChild(_this.container);
            }
        };
        _this.handleContextMenu = function (e) {
            if (!_this.canvas || !_this.onContextMenu)
                return;
            _this.position.x = e.clientX;
            _this.position.y = e.clientY;
            var activeNodes = _this.canvas.getActiveNodes();
            var activeEdges = _this.canvas.getActiveEdges();
            var target = activeNodes.find(function (node) { return node.isPointIn(); }) || activeEdges.find(function (edge) { return edge.isPointIn(); }) || null;
            var menu = _this.onContextMenu(_this, target, activeNodes, activeEdges);
            _this.show(menu);
        };
        _this.handleClick = function (e) {
            if (!_this.canvas)
                return;
            e.stopPropagation();
            var target = e.target;
            if (!target)
                return;
            if (target === _this.container)
                return;
            var command = target.dataset.command;
            var menu = _this.menu.find(function (item) { return item.command === command; });
            _this.canvas.eventEmitter.emit('canvas:menu', menu);
            _this.hide();
        };
        _this.container.className = ContextMenu_less_1.default.menu;
        return _this;
    }
    ContextMenu.prototype.handleEvent = function (event) {
        if (event.type === 'contextmenu') {
            this.handleContextMenu(event);
        }
    };
    ContextMenu.prototype.install = function (canvas) {
        this.canvas = canvas;
        this.container.addEventListener('click', this.handleClick);
        document.addEventListener('click', this.hide);
    };
    ContextMenu.prototype.destroy = function () {
        if (!this.canvas)
            return;
        this.container.removeEventListener('click', this.handleClick);
        document.removeEventListener('click', this.hide);
        this.canvas = null;
    };
    ContextMenu.prototype.show = function (menu, left, top) {
        if (menu === void 0) { menu = []; }
        this.hide();
        if (!menu.length)
            return;
        this.menu = menu;
        var _a = this.position, x = _a.x, y = _a.y;
        x = left !== undefined ? left : x;
        y = top !== undefined ? top : y;
        var html = this.menu.map(function (item) {
            return "<div class=\"item\" data-command=\"" + item.command + "\">" + item.label + "</div>";
        });
        this.container.innerHTML = html.join('');
        Object.assign(this.container.style, {
            left: x + "px",
            top: y + "px"
        });
        document.body.appendChild(this.container);
    };
    return ContextMenu;
}(Plugin_1.default));
exports.ContextMenu = ContextMenu;
exports.default = ContextMenu;
