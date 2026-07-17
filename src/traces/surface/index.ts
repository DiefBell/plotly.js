'use strict';

// Plain CommonJS module.exports (no real `export` syntax) is deliberate here:
// esbuild compiles named `export const` bindings to getter-only accessor
// properties on the CJS `exports` object (required for ESM live-binding
// semantics), which breaks `spyOn(gd._fullData[i]._module, 'someMethod')` in
// tests that hold a live reference to this module object - assigning to a
// getter-only property throws "not declared writable or has no setter".
// A plain mutable object keeps that working exactly like the pre-conversion
// .js file, while default imports (`import Surface from
// 'plotly.js/traces/surface'`) already resolve to this whole object via
// standard CJS/ESM synthetic-default interop.
module.exports = {
    attributes: require('./attributes'),
    supplyDefaults: require('./defaults').supplyDefaults,
    colorbar: {
        min: 'cmin',
        max: 'cmax'
    },
    calc: require('./calc'),
    plot: require('./convert'),

    moduleType: 'trace',
    name: 'surface',
    basePlotModule: require('../../plots/gl3d'),
    categories: ['gl3d', '2dMap', 'showLegend'],
    meta: {
        description: [
            'The data the describes the coordinates of the surface is set in `z`.',
            'Data in `z` should be a {2D array}.',

            'Coordinates in `x` and `y` can either be 1D {arrays}',
            'or {2D arrays} (e.g. to graph parametric surfaces).',

            'If not provided in `x` and `y`, the x and y coordinates are assumed',
            'to be linear starting at 0 with a unit step.',

            'The color scale corresponds to the `z` values by default.',
            'For custom color scales, use `surfacecolor` which should be a {2D array},',
            'where its bounds can be controlled using `cmin` and `cmax`.'
        ].join(' ')
    }
};
