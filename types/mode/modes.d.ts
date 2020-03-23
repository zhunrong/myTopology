import Interaction from '../interaction/Interaction';
export declare const MODE_DEFAULT = "mode.default";
export declare const MODE_VIEW = "mode.view";
export declare const MODE_CREATE_EDGE = "mode.create.edge";
export declare const MODE_CREATE_L = "mode.create.L";
export declare const MODE_AREA_PICK = "mode.area.pick";
export declare const MODE_BORDER = "mode.border";
interface IMode {
    [name: string]: Interaction[];
}
export declare class ModeManager {
    modes: IMode;
    constructor();
    registerMode(modeName: string, interactions: Interaction[]): void;
    unregisterMode(modeName: string): void;
    use(modeName: string): Interaction[];
    hasMode(modeName: string): boolean;
}
export default ModeManager;
