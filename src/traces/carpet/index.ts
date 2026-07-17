'use strict';

// Plain CommonJS module.exports (no real `export` syntax) is deliberate here:
// esbuild compiles named `export const` bindings to getter-only accessor
// properties on the CJS `exports` object (required for ESM live-binding
// semantics), which breaks `spyOn(gd._fullData[i]._module, 'someMethod')` in
// tests that hold a live reference to this module object - assigning to a
// getter-only property throws "not declared writable or has no setter".
// A plain mutable object keeps that working exactly like the pre-conversion
// .js file, while default imports (`import Carpet from
// 'plotly.js/traces/carpet'`) already resolve to this whole object via
// standard CJS/ESM synthetic-default interop.
module.exports = {
    attributes: require('./attributes'),
    supplyDefaults: require('./defaults'),
    plot: require('./plot'),
    calc: require('./calc'),
    animatable: true,
    isContainer: true, // so carpet traces get `calc` before other traces

    moduleType: 'trace',
    name: 'carpet',
    basePlotModule: require('../../plots/cartesian'),
    categories: ['cartesian', 'svg', 'carpet', 'carpetAxis', 'notLegendIsolatable', 'noMultiCategory', 'noHover', 'noSortingByValue'],
    meta: {
        description: [
            'The data describing carpet axis layout is set in `y` and (optionally)',
            'also `x`. If only `y` is present, `x` the plot is interpreted as a',
            'cheater plot and is filled in using the `y` values.',

            '`x` and `y` may either be 2D arrays matching with each dimension matching',
            'that of `a` and `b`, or they may be 1D arrays with total length equal to',
            'that of `a` and `b`.'
        ].join(' ')
    }
};
