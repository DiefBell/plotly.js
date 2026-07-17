'use strict';

// Plain CommonJS module.exports (no real `export` syntax) is deliberate here:
// esbuild compiles named `export const` bindings to getter-only accessor
// properties on the CJS `exports` object (required for ESM live-binding
// semantics), which breaks `spyOn(gd._fullData[i]._module, 'someMethod')` in
// tests that hold a live reference to this module object - assigning to a
// getter-only property throws "not declared writable or has no setter".
// A plain mutable object keeps that working exactly like the pre-conversion
// .js file, while default imports (`import Contour from
// 'plotly.js/traces/contour'`) already resolve to this whole object via
// standard CJS/ESM synthetic-default interop.
module.exports = {
    attributes: require('./attributes'),
    supplyDefaults: require('./defaults'),
    calc: require('./calc'),
    plot: require('./plot').plot,
    style: require('./style'),
    colorbar: require('./colorbar'),
    hoverPoints: require('./hover'),

    moduleType: 'trace',
    name: 'contour',
    basePlotModule: require('../../plots/cartesian'),
    categories: ['cartesian', 'svg', '2dMap', 'contour', 'showLegend'],
    meta: {
        description: [
            'The data from which contour lines are computed is set in `z`.',
            'Data in `z` must be a {2D array} of numbers.',

            'Say that `z` has N rows and M columns, then by default,',
            'these N rows correspond to N y coordinates',
            '(set in `y` or auto-generated) and the M columns',
            'correspond to M x coordinates (set in `x` or auto-generated).',
            'By setting `transpose` to *true*, the above behavior is flipped.'
        ].join(' ')
    }
};
