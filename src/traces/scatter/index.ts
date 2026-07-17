'use strict';

var subtypes = require('./subtypes');

export const hasLines = subtypes.hasLines;
export const hasMarkers = subtypes.hasMarkers;
export const hasText = subtypes.hasText;
export const isBubble = subtypes.isBubble;

export const attributes = require('./attributes');
export const layoutAttributes = require('./layout_attributes');
export const supplyDefaults = require('./defaults');
export const crossTraceDefaults = require('./cross_trace_defaults');
export const supplyLayoutDefaults = require('./layout_defaults');
export const calc = require('./calc').calc;
export const crossTraceCalc = require('./cross_trace_calc');
export const arraysToCalcdata = require('./arrays_to_calcdata');
export const plot = require('./plot');
export const colorbar = require('./marker_colorbar');
export const formatLabels = require('./format_labels');
export const style = require('./style').style;
export const styleOnSelect = require('./style').styleOnSelect;
export const hoverPoints = require('./hover');
export const selectPoints = require('./select');
export const animatable = true;

export const moduleType = 'trace';
export const name = 'scatter';
export const basePlotModule = require('../../plots/cartesian');
export const categories = [
    'cartesian', 'svg', 'symbols', 'errorBarsOK', 'showLegend', 'scatter-like',
    'zoomScale'
];
export const meta = {
    description: [
        'The scatter trace type encompasses line charts, scatter charts, text charts, and bubble charts.',
        'The data visualized as scatter point or lines is set in `x` and `y`.',
        'Text (appearing either on the chart or on hover only) is via `text`.',
        'Bubble charts are achieved by setting `marker.size` and/or `marker.color`',
        'to numerical arrays.'
    ].join(' ')
};

// default export for deep-import ergonomics (e.g. a future
// `import ScatterTrace from 'plotly.js/traces/scatter'`) - the named exports
// above remain the primary contract: they're what makes
// `Registry.register(require('./traces/scatter'))` in src/core.ts keep
// working unchanged, since esbuild's CJS output copies each named export
// directly onto `exports`, matching this module's original plain-object shape.
export default {
    hasLines, hasMarkers, hasText, isBubble,
    attributes, layoutAttributes, supplyDefaults, crossTraceDefaults,
    supplyLayoutDefaults, calc, crossTraceCalc, arraysToCalcdata, plot,
    colorbar, formatLabels, style, styleOnSelect, hoverPoints, selectPoints,
    animatable, moduleType, name, basePlotModule, categories, meta
};
