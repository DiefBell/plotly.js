'use strict';

// Plain CommonJS module.exports (no real `export` syntax) is deliberate here:
// esbuild compiles named `export const` bindings to getter-only accessor
// properties on the CJS `exports` object (required for ESM live-binding
// semantics), which breaks `spyOn(gd._fullData[i]._module, 'someMethod')` in
// tests that hold a live reference to this module object - assigning to a
// getter-only property throws "not declared writable or has no setter".
// A plain mutable object keeps that working exactly like the pre-conversion
// .js file, while default imports (`import ScatterMap from
// 'plotly.js/traces/scattermap'`) already resolve to this whole object via
// standard CJS/ESM synthetic-default interop.
module.exports = {
    attributes: require('./attributes'),
    supplyDefaults: require('./defaults'),
    colorbar: require('../scatter/marker_colorbar'),
    formatLabels: require('./format_labels'),
    calc: require('../scattergeo/calc'),
    plot: require('./plot'),
    hoverPoints: require('./hover').hoverPoints,
    eventData: require('./event_data'),
    selectPoints: require('./select'),

    styleOnSelect: function(_, cd) {
        if(cd) {
            var trace = cd[0].trace;
            trace._glTrace.update(cd);
        }
    },

    moduleType: 'trace',
    name: 'scattermap',
    basePlotModule: require('../../plots/map'),
    categories: ['map', 'gl', 'symbols', 'showLegend', 'scatter-like'],
    meta: {
        hrName: 'scatter_map',
        description: [
            'The data visualized as scatter point, lines or marker symbols',
            'on a MapLibre GL geographic map',
            'is provided by longitude/latitude pairs in `lon` and `lat`.'
        ].join(' ')
    }
};
