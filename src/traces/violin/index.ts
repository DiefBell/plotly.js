'use strict';

// Plain CommonJS module.exports (no real `export` syntax) is deliberate here:
// esbuild compiles named `export const` bindings to getter-only accessor
// properties on the CJS `exports` object (required for ESM live-binding
// semantics), which breaks `spyOn(gd._fullData[i]._module, 'someMethod')` in
// tests that hold a live reference to this module object - assigning to a
// getter-only property throws "not declared writable or has no setter".
// A plain mutable object keeps that working exactly like the pre-conversion
// .js file, while default imports (`import Violin from
// 'plotly.js/traces/violin'`) already resolve to this whole object via
// standard CJS/ESM synthetic-default interop.
module.exports = {
    attributes: require('./attributes'),
    layoutAttributes: require('./layout_attributes'),
    supplyDefaults: require('./defaults'),
    crossTraceDefaults: require('../box/defaults').crossTraceDefaults,
    supplyLayoutDefaults: require('./layout_defaults'),
    calc: require('./calc'),
    crossTraceCalc: require('./cross_trace_calc'),
    plot: require('./plot'),
    style: require('./style'),
    styleOnSelect: require('../scatter/style').styleOnSelect,
    hoverPoints: require('./hover'),
    selectPoints: require('../box/select'),

    moduleType: 'trace',
    name: 'violin',
    basePlotModule: require('../../plots/cartesian'),
    categories: ['cartesian', 'svg', 'symbols', 'oriented', 'box-violin', 'showLegend', 'violinLayout', 'zoomScale'],
    meta: {
        description: [
            'In vertical (horizontal) violin plots,',
            'statistics are computed using `y` (`x`) values.',
            'By supplying an `x` (`y`) array, one violin per distinct x (y) value',
            'is drawn',
            'If no `x` (`y`) {array} is provided, a single violin is drawn.',
            'That violin position is then positioned with',
            'with `name` or with `x0` (`y0`) if provided.'
        ].join(' ')
    }
};
