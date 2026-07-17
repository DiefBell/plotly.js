'use strict';

// Plain CommonJS module.exports (no real `export` syntax) is deliberate here:
// esbuild compiles named `export const` bindings to getter-only accessor
// properties on the CJS `exports` object (required for ESM live-binding
// semantics), which breaks `spyOn(gd._fullData[i]._module, 'someMethod')` in
// tests that hold a live reference to this module object - assigning to a
// getter-only property throws "not declared writable or has no setter".
// A plain mutable object keeps that working exactly like the pre-conversion
// .js file, while default imports (`import Candlestick from
// 'plotly.js/traces/candlestick'`) already resolve to this whole object via
// standard CJS/ESM synthetic-default interop.
module.exports = {
    moduleType: 'trace',
    name: 'candlestick',
    basePlotModule: require('../../plots/cartesian'),
    categories: ['cartesian', 'svg', 'showLegend', 'candlestick', 'boxLayout'],
    meta: {
        description: [
            'The candlestick is a style of financial chart describing',
            'open, high, low and close for a given `x` coordinate (most likely time).',

            'The boxes represent the spread between the `open` and `close` values and',
            'the lines represent the spread between the `low` and `high` values',

            'Sample points where the close value is higher (lower) then the open',
            'value are called increasing (decreasing).',

            'By default, increasing candles are drawn in green whereas',
            'decreasing are drawn in red.'
        ].join(' ')
    },

    attributes: require('./attributes'),
    layoutAttributes: require('../box/layout_attributes'),
    supplyLayoutDefaults: require('../box/layout_defaults').supplyLayoutDefaults,
    crossTraceCalc: require('../box/cross_trace_calc').crossTraceCalc,
    supplyDefaults: require('./defaults'),
    calc: require('./calc'),
    plot: require('../box/plot').plot,
    layerName: 'boxlayer',
    style: require('../box/style').style,
    hoverPoints: require('../ohlc/hover').hoverPoints,
    selectPoints: require('../ohlc/select')
};
