'use strict';

// Plain CommonJS module.exports (no real `export` syntax) is deliberate here:
// esbuild compiles named `export const` bindings to getter-only accessor
// properties on the CJS `exports` object (required for ESM live-binding
// semantics), which breaks `spyOn(gd._fullData[i]._module, 'someMethod')` in
// tests that hold a live reference to this module object - assigning to a
// getter-only property throws "not declared writable or has no setter".
// A plain mutable object keeps that working exactly like the pre-conversion
// .js file, while default imports (`import Ohlc from
// 'plotly.js/traces/ohlc'`) already resolve to this whole object via
// standard CJS/ESM synthetic-default interop.
module.exports = {
    moduleType: 'trace',
    name: 'ohlc',
    basePlotModule: require('../../plots/cartesian'),
    categories: ['cartesian', 'svg', 'showLegend'],
    meta: {
        description: [
            'The ohlc (short for Open-High-Low-Close) is a style of financial chart describing',
            'open, high, low and close for a given `x` coordinate (most likely time).',

            'The tip of the lines represent the `low` and `high` values and',
            'the horizontal segments represent the `open` and `close` values.',

            'Sample points where the close value is higher (lower) then the open',
            'value are called increasing (decreasing).',

            'By default, increasing items are drawn in green whereas',
            'decreasing are drawn in red.'
        ].join(' ')
    },

    attributes: require('./attributes'),
    supplyDefaults: require('./defaults'),
    calc: require('./calc').calc,
    plot: require('./plot'),
    style: require('./style'),
    hoverPoints: require('./hover').hoverPoints,
    selectPoints: require('./select')
};
