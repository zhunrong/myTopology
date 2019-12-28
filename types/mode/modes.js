"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dragInteraction_1 = __importDefault(require("../interaction/dragInteraction"));
var dropInteraction_1 = __importDefault(require("../interaction/dropInteraction"));
var moveCanvasInteraction_1 = __importDefault(require("../interaction/moveCanvasInteraction"));
var wheelZoomInteraction_1 = __importDefault(require("../interaction/wheelZoomInteraction"));
var selectInteraction_1 = __importDefault(require("../interaction/selectInteraction"));
var areaPickInteraction_1 = __importDefault(require("../interaction/areaPickInteraction"));
var createGroupInteraction_1 = __importDefault(require("../interaction/createGroupInteraction"));
var resizeInteraction_1 = __importDefault(require("../interaction/resizeInteraction"));
var collapseAndExpandInteraction_1 = __importDefault(require("../interaction/collapseAndExpandInteraction"));
var CreateEdgeInteraction_1 = __importDefault(require("../interaction/CreateEdgeInteraction"));
var L_1 = __importDefault(require("../edge/L"));
exports.MODE_DEFAULT = 'mode.default';
exports.MODE_VIEW = 'mode.view';
exports.MODE_CREATE_EDGE = 'mode.create.edge';
exports.MODE_CREATE_L = 'mode.create.L';
exports.MODE_AREA_PICK = 'mode.area.pick';
exports.MODE_BORDER = 'mode.border';
var ModeManager = (function () {
    function ModeManager() {
        this.modes = {};
    }
    ModeManager.prototype.registerMode = function (modeName, interactions) {
        this.modes[modeName] = interactions;
    };
    ModeManager.prototype.unregisterMode = function (modeName) {
        delete this.modes[modeName];
    };
    ModeManager.prototype.use = function (modeName) {
        return this.modes[modeName] || [];
    };
    ModeManager.prototype.hasMode = function (modeName) {
        return this.modes.hasOwnProperty(modeName);
    };
    return ModeManager;
}());
var modeManager = new ModeManager();
modeManager.registerMode(exports.MODE_DEFAULT, [
    new selectInteraction_1.default(),
    new dragInteraction_1.default(),
    new dropInteraction_1.default(),
    new wheelZoomInteraction_1.default(),
    new collapseAndExpandInteraction_1.default()
]);
modeManager.registerMode(exports.MODE_VIEW, [
    new moveCanvasInteraction_1.default(),
    new wheelZoomInteraction_1.default()
]);
modeManager.registerMode(exports.MODE_CREATE_EDGE, [
    new selectInteraction_1.default(),
    new wheelZoomInteraction_1.default(),
    new CreateEdgeInteraction_1.default(),
    new moveCanvasInteraction_1.default()
]);
modeManager.registerMode(exports.MODE_CREATE_L, [
    new selectInteraction_1.default(),
    new wheelZoomInteraction_1.default(),
    new CreateEdgeInteraction_1.default(function (sourceNode, targetNode) {
        return new L_1.default({
            sourceNode: sourceNode,
            targetNode: targetNode,
            arrow: true
        });
    }),
    new moveCanvasInteraction_1.default()
]);
modeManager.registerMode(exports.MODE_AREA_PICK, [
    new wheelZoomInteraction_1.default(),
    new areaPickInteraction_1.default(),
    new createGroupInteraction_1.default()
]);
modeManager.registerMode(exports.MODE_BORDER, [
    new resizeInteraction_1.default(),
    new wheelZoomInteraction_1.default()
]);
exports.default = modeManager;
