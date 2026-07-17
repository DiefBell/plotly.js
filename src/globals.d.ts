export {};

declare global {
    interface Window {
        PlotlyGeoAssets?: any;
        PlotlyLocales?: any[];
        supportsCSS?: boolean;
    }

    const MathJax: any;
}
