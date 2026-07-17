'use strict';

// Plain CommonJS module.exports (no real `export` syntax) is deliberate here:
// esbuild compiles named `export const` bindings to getter-only accessor
// properties on the CJS `exports` object (required for ESM live-binding
// semantics), which breaks `spyOn(Bar, 'someMethod')` in tests that
// `require()` this module directly - assigning to a getter-only property
// throws "not declared writable or has no setter". A plain mutable object
// keeps that working exactly like the pre-conversion .js file, and default
// imports (`import BarChart from 'plotly.js/traces/bar'`, or `import BarModule
// from './traces/bar'` in src/index.ts) already resolve to this whole object
// via standard CJS/ESM synthetic-default interop - no named export machinery
// needed for that.
module.exports = {
    attributes: require('./attributes'),
    layoutAttributes: require('./layout_attributes'),
    supplyDefaults: require('./defaults').supplyDefaults,
    crossTraceDefaults: require('./defaults').crossTraceDefaults,
    supplyLayoutDefaults: require('./layout_defaults'),
    calc: require('./calc'),
    crossTraceCalc: require('./cross_trace_calc').crossTraceCalc,
    colorbar: require('../scatter/marker_colorbar'),
    arraysToCalcdata: require('./arrays_to_calcdata'),
    plot: require('./plot').plot,
    style: require('./style').style,
    styleOnSelect: require('./style').styleOnSelect,
    hoverPoints: require('./hover').hoverPoints,
    eventData: require('./event_data'),
    selectPoints: require('./select'),

    moduleType: 'trace',
    name: 'bar',
    basePlotModule: require('../../plots/cartesian'),
    categories: ['bar-like', 'cartesian', 'svg', 'bar', 'oriented', 'errorBarsOK', 'showLegend', 'zoomScale'],
    animatable: true,
    meta: {
        description: [
            'The data visualized by the span of the bars is set in `y`',
            'if `orientation` is set to *v* (the default)',
            'and the labels are set in `x`.',
            'By setting `orientation` to *h*, the roles are interchanged.'
        ].join(' ')
    }
};
