/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { CustomTool } from "./components/hbp-connectivity-matrix-row/hbp-connectivity-matrix-row";
export namespace Components {
    interface ExportConnectivityDiagram {
        "connectedAreas": any;
        "datasetInfo": any;
        "downloadCSV": (floatConnectionNumbers: any) => Promise<void>;
        "downloadPng": () => Promise<void>;
        "el": any;
        "getCSVData": (floatConnectionNumbers: any) => Promise<unknown>;
        "hideView": string;
        "regionInfo": any;
        "theme": string;
    }
    interface ExportFullConnectivity {
        "connections": any;
        "datasetInfo": any;
        "downloadFullConnectivityCsv": () => Promise<void>;
        "el": any;
        "getFullConnectivityCSVData": () => Promise<unknown>;
    }
    interface FullConnectivityGrid {
        "dataIsLoading": boolean;
        "datasetDescription": string;
        "datasetName": string;
        "datasetUrl": string;
        "downloadCSV": () => Promise<void>;
        "gridheight": string;
        "gridwidth": string;
        "loadurl": string;
        "matrix": string;
        "onlyExport": string;
        "pixelsize": number;
        "textwidth": number;
        "theme": string;
        "tooltipHeight": number;
        "tooltipWidth": number;
    }
    interface HbpConnectivityMatrixRow {
        "_tools_custom": CustomTool[];
        "connections": string;
        "customDatasetSelector": string;
        "customHeight": string;
        "customWidth": string;
        "dataIsLoading": boolean;
        "datasetUrl": string;
        "downloadCSV": () => Promise<void>;
        "hideExportView": string;
        "loadurl": string;
        "region": string;
        "showDatasetName": string;
        "showDescription": string;
        "showExport": string;
        "showSource": string;
        "showTitle": string;
        "showToolbar": string;
        "theme": string;
        "tools_custom": CustomTool[] | string;
        "tools_showallresults": string;
        "tools_showlog": string;
    }
}
declare global {
    interface HTMLExportConnectivityDiagramElement extends Components.ExportConnectivityDiagram, HTMLStencilElement {
    }
    var HTMLExportConnectivityDiagramElement: {
        prototype: HTMLExportConnectivityDiagramElement;
        new (): HTMLExportConnectivityDiagramElement;
    };
    interface HTMLExportFullConnectivityElement extends Components.ExportFullConnectivity, HTMLStencilElement {
    }
    var HTMLExportFullConnectivityElement: {
        prototype: HTMLExportFullConnectivityElement;
        new (): HTMLExportFullConnectivityElement;
    };
    interface HTMLFullConnectivityGridElement extends Components.FullConnectivityGrid, HTMLStencilElement {
    }
    var HTMLFullConnectivityGridElement: {
        prototype: HTMLFullConnectivityGridElement;
        new (): HTMLFullConnectivityGridElement;
    };
    interface HTMLHbpConnectivityMatrixRowElement extends Components.HbpConnectivityMatrixRow, HTMLStencilElement {
    }
    var HTMLHbpConnectivityMatrixRowElement: {
        prototype: HTMLHbpConnectivityMatrixRowElement;
        new (): HTMLHbpConnectivityMatrixRowElement;
    };
    interface HTMLElementTagNameMap {
        "export-connectivity-diagram": HTMLExportConnectivityDiagramElement;
        "export-full-connectivity": HTMLExportFullConnectivityElement;
        "full-connectivity-grid": HTMLFullConnectivityGridElement;
        "hbp-connectivity-matrix-row": HTMLHbpConnectivityMatrixRowElement;
    }
}
declare namespace LocalJSX {
    interface ExportConnectivityDiagram {
        "connectedAreas"?: any;
        "datasetInfo"?: any;
        "el"?: any;
        "hideView"?: string;
        "regionInfo"?: any;
        "theme"?: string;
    }
    interface ExportFullConnectivity {
        "connections"?: any;
        "datasetInfo"?: any;
        "el"?: any;
    }
    interface FullConnectivityGrid {
        "dataIsLoading"?: boolean;
        "datasetDescription"?: string;
        "datasetName"?: string;
        "datasetUrl"?: string;
        "gridheight"?: string;
        "gridwidth"?: string;
        "loadurl"?: string;
        "matrix"?: string;
        "onConnectivityDataReceived"?: (event: CustomEvent<any>) => void;
        "onlyExport"?: string;
        "pixelsize"?: number;
        "textwidth"?: number;
        "theme"?: string;
        "tooltipHeight"?: number;
        "tooltipWidth"?: number;
    }
    interface HbpConnectivityMatrixRow {
        "_tools_custom"?: CustomTool[];
        "connections"?: string;
        "customDatasetSelector"?: string;
        "customHeight"?: string;
        "customWidth"?: string;
        "dataIsLoading"?: boolean;
        "datasetUrl"?: string;
        "hideExportView"?: string;
        "loadurl"?: string;
        "onCollapsedMenuChanged"?: (event: CustomEvent<any>) => void;
        "onConnectedRegionClicked"?: (event: CustomEvent<any>) => void;
        "onConnectivityDataReceived"?: (event: CustomEvent<any>) => void;
        "onCustomToolEvent"?: (event: CustomEvent<any>) => void;
        "onDatasetDataReceived"?: (event: CustomEvent<any>) => void;
        "onLoadingStateChanged"?: (event: CustomEvent<any>) => void;
        "region"?: string;
        "showDatasetName"?: string;
        "showDescription"?: string;
        "showExport"?: string;
        "showSource"?: string;
        "showTitle"?: string;
        "showToolbar"?: string;
        "theme"?: string;
        "tools_custom"?: CustomTool[] | string;
        "tools_showallresults"?: string;
        "tools_showlog"?: string;
    }
    interface IntrinsicElements {
        "export-connectivity-diagram": ExportConnectivityDiagram;
        "export-full-connectivity": ExportFullConnectivity;
        "full-connectivity-grid": FullConnectivityGrid;
        "hbp-connectivity-matrix-row": HbpConnectivityMatrixRow;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "export-connectivity-diagram": LocalJSX.ExportConnectivityDiagram & JSXBase.HTMLAttributes<HTMLExportConnectivityDiagramElement>;
            "export-full-connectivity": LocalJSX.ExportFullConnectivity & JSXBase.HTMLAttributes<HTMLExportFullConnectivityElement>;
            "full-connectivity-grid": LocalJSX.FullConnectivityGrid & JSXBase.HTMLAttributes<HTMLFullConnectivityGridElement>;
            "hbp-connectivity-matrix-row": LocalJSX.HbpConnectivityMatrixRow & JSXBase.HTMLAttributes<HTMLHbpConnectivityMatrixRowElement>;
        }
    }
}
