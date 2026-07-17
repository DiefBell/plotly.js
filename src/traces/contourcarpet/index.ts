'use strict';

// Plain CommonJS module.exports (no real `export` syntax) is deliberate here:
// esbuild compiles named `export const` bindings to getter-only accessor
// properties on the CJS `exports` object (required for ESM live-binding
// semantics), which breaks `spyOn(gd._fullData[i]._module, 'someMethod')` in
// tests that hold a live reference to this module object - assigning to a
// getter-only property throws "not declared writable or has no setter".
// A plain mutable object keeps that working exactly like the pre-conversion
// .js file, while default imports (`import ContourCarpet from
// 'plotly.js/traces/contourcarpet'`) already resolve to this whole object via
// standard CJS/ESM synthetic-default interop.
module.exports = {
    attributes: require('./attributes'),
    supplyDefaults: require('./defaults'),
    colorbar: require('../contour/colorbar'),
    calc: require('./calc'),
    plot: require('./plot'),
    style: require('../contour/style'),

    moduleType: 'trace',
    name: 'contourcarpet',
    basePlotModule: require('../../plots/cartesian'),
    categories: ['cartesian', 'svg', 'carpet', 'contour', 'symbols', 'showLegend', 'hasLines', 'carpetDependent', 'noHover', 'noSortingByValue'],
    meta: {
        hrName: 'contour_carpet',
        description: [
            'Plots contours on either the first carpet axis or the',
            'carpet axis with a matching `carpet` attribute. Data `z`',
            'is interpreted as matching that of the corresponding carpet',
            'axis.'
        ].join(' ')
    }
};
