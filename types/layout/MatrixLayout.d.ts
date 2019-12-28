import Layout, { Transport } from './Layout';
export declare class MatrixLayout extends Layout {
    rows: number;
    rowGap: number;
    columns: number;
    columnGap: number;
    nodeRadius: number;
    duration: number;
    transports: Transport[];
    layout(): void;
}
export default MatrixLayout;
