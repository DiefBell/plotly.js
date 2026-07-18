'use strict';

export interface ConfigEdits {
    annotationPosition?: boolean;
    annotationTail?: boolean;
    annotationText?: boolean;
    axisTitleText?: boolean;
    colorbarPosition?: boolean;
    colorbarTitleText?: boolean;
    legendPosition?: boolean;
    legendText?: boolean;
    shapePosition?: boolean;
    titleText?: boolean;
}

export interface Config {
    staticPlot?: boolean;
    typesetMath?: boolean;
    plotlyServerURL?: string;
    editable?: boolean;
    edits?: Partial<ConfigEdits>;
    editSelection?: boolean;
    autosizable?: boolean;
    responsive?: boolean;
    fillFrame?: boolean;
    frameMargins?: number;
    scrollZoom?: boolean | string;
    doubleClick?: false | 'reset' | 'autosize' | 'reset+autosize';
    doubleClickDelay?: number;
    showAxisDragHandles?: boolean;
    showAxisRangeEntryBoxes?: boolean;
    showTips?: boolean;
    displayNotifier?: boolean;
    showLink?: boolean;
    linkText?: string;
    sendData?: boolean;
    showSources?: any;
    displayModeBar?: 'hover' | boolean;
    showSendToCloud?: boolean;
    showEditInChartStudio?: boolean;
    modeBarButtonsToRemove?: string[];
    modeBarButtonsToAdd?: any[];
    modeBarButtons?: any[] | any[][] | false;
    toImageButtonOptions?: Record<string, any>;
    displaylogo?: boolean;
    watermark?: boolean;
    plotGlPixelRatio?: number;
    setBackground?: 'transparent' | 'opaque' | ((gd: any, bgColor: string) => void);
    topojsonURL?: string;
    mapboxAccessToken?: string | null;
    logging?: 0 | 1 | 2;
    notifyOnLogging?: 0 | 1 | 2;
    queueLength?: number;
    locale?: string;
    locales?: Record<string, any>;
    // internal/private fields set by plot_api at runtime, plus any
    // config keys not yet enumerated above
    [key: string]: any;
}
