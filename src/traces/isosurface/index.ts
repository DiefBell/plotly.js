'use strict';

// Plain CommonJS module.exports (no real `export` syntax) is deliberate here:
// esbuild compiles named `export const` bindings to getter-only accessor
// properties on the CJS `exports` object (required for ESM live-binding
// semantics), which breaks `spyOn(gd._fullData[i]._module, 'someMethod')` in
// tests that hold a live reference to this module object - assigning to a
// getter-only property throws "not declared writable or has no setter".
// A plain mutable object keeps that working exactly like the pre-conversion
// .js file, while default imports (`import Isosurface from
// 'plotly.js/traces/isosurface'`) already resolve to this whole object via
// standard CJS/ESM synthetic-default interop.
module.exports = {
    attributes: require('./attributes'),
    supplyDefaults: require('./defaults').supplyDefaults,
    calc: require('./calc'),
    colorbar: {
        min: 'cmin',
        max: 'cmax'
    },
    plot: require('./convert').createIsosurfaceTrace,

    moduleType: 'trace',
    name: 'isosurface',
    basePlotModule: require('../../plots/gl3d'),
    categories: ['gl3d', 'showLegend'],
    meta: {
        description: [
            'Draws isosurfaces between iso-min and iso-max values with coordinates given by',
            'four 1-dimensional arrays containing the `value`, `x`, `y` and `z` of every vertex',
            'of a uniform or non-uniform 3-D grid. Horizontal or vertical slices, caps as well as',
            'spaceframe between iso-min and iso-max values could also be drawn using this trace.'
        ].join(' ')
    }
};
