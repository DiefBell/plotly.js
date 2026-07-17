'use strict';

// Plain CommonJS module.exports (no real `export` syntax) is deliberate here:
// esbuild compiles named `export const` bindings to getter-only accessor
// properties on the CJS `exports` object (required for ESM live-binding
// semantics), which breaks `spyOn(gd._fullData[i]._module, 'someMethod')` in
// tests that hold a live reference to this module object - assigning to a
// getter-only property throws "not declared writable or has no setter".
// A plain mutable object keeps that working exactly like the pre-conversion
// .js file, while default imports (`import PieChart from
// 'plotly.js/traces/pie'`) already resolve to this whole object via standard
// CJS/ESM synthetic-default interop - no named export machinery needed.
module.exports = {
    attributes: require('./attributes'),
    supplyDefaults: require('./defaults').supplyDefaults,
    supplyLayoutDefaults: require('./layout_defaults'),
    layoutAttributes: require('./layout_attributes'),

    calc: require('./calc').calc,
    crossTraceCalc: require('./calc').crossTraceCalc,

    plot: require('./plot').plot,
    style: require('./style'),
    styleOne: require('./style_one'),

    moduleType: 'trace',
    name: 'pie',
    basePlotModule: require('./base_plot'),
    categories: ['pie-like', 'pie', 'showLegend'],
    meta: {
        description: [
            'A data visualized by the sectors of the pie is set in `values`.',
            'The sector labels are set in `labels`.',
            'The sector colors are set in `marker.colors`'
        ].join(' ')
    }
};
