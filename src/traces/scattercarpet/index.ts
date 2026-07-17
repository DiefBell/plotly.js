'use strict';

// Plain CommonJS module.exports (no real `export` syntax) is deliberate here:
// esbuild compiles named `export const` bindings to getter-only accessor
// properties on the CJS `exports` object (required for ESM live-binding
// semantics), which breaks `spyOn(gd._fullData[i]._module, 'someMethod')` in
// tests that hold a live reference to this module object - assigning to a
// getter-only property throws "not declared writable or has no setter".
// A plain mutable object keeps that working exactly like the pre-conversion
// .js file, while default imports (`import ScatterCarpet from
// 'plotly.js/traces/scattercarpet'`) already resolve to this whole object via
// standard CJS/ESM synthetic-default interop.
module.exports = {
    attributes: require('./attributes'),
    supplyDefaults: require('./defaults'),
    colorbar: require('../scatter/marker_colorbar'),
    formatLabels: require('./format_labels'),
    calc: require('./calc'),
    plot: require('./plot'),
    style: require('../scatter/style').style,
    styleOnSelect: require('../scatter/style').styleOnSelect,
    hoverPoints: require('./hover'),
    selectPoints: require('../scatter/select'),
    eventData: require('./event_data'),

    moduleType: 'trace',
    name: 'scattercarpet',
    basePlotModule: require('../../plots/cartesian'),
    categories: ['svg', 'carpet', 'symbols', 'showLegend', 'carpetDependent', 'zoomScale'],
    meta: {
        hrName: 'scatter_carpet',
        description: [
            'Plots a scatter trace on either the first carpet axis or the',
            'carpet axis with a matching `carpet` attribute.'
        ].join(' ')
    }
};
