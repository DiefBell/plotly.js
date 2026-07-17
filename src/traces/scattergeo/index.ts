'use strict';

// Plain CommonJS module.exports (no real `export` syntax) is deliberate here:
// esbuild compiles named `export const` bindings to getter-only accessor
// properties on the CJS `exports` object (required for ESM live-binding
// semantics), which breaks `spyOn(gd._fullData[i]._module, 'someMethod')` in
// tests that hold a live reference to this module object - assigning to a
// getter-only property throws "not declared writable or has no setter".
// A plain mutable object keeps that working exactly like the pre-conversion
// .js file, while default imports (`import ScatterGeo from
// 'plotly.js/traces/scattergeo'`) already resolve to this whole object via
// standard CJS/ESM synthetic-default interop.
module.exports = {
    attributes: require('./attributes'),
    supplyDefaults: require('./defaults'),
    colorbar: require('../scatter/marker_colorbar'),
    formatLabels: require('./format_labels'),
    calc: require('./calc'),
    calcGeoJSON: require('./plot').calcGeoJSON,
    plot: require('./plot').plot,
    style: require('./style'),
    styleOnSelect: require('../scatter/style').styleOnSelect,
    hoverPoints: require('./hover'),
    eventData: require('./event_data'),
    selectPoints: require('./select'),

    moduleType: 'trace',
    name: 'scattergeo',
    basePlotModule: require('../../plots/geo'),
    categories: ['geo', 'symbols', 'showLegend', 'scatter-like'],
    meta: {
        hrName: 'scatter_geo',
        description: [
            'The data visualized as scatter point or lines on a geographic map',
            'is provided either by longitude/latitude pairs in `lon` and `lat`',
            'respectively or by geographic location IDs or names in `locations`.'
        ].join(' ')
    }
};
