'use strict';

// Plain CommonJS module.exports (no real `export` syntax) is deliberate here:
// esbuild compiles named `export const` bindings to getter-only accessor
// properties on the CJS `exports` object (required for ESM live-binding
// semantics), which breaks `spyOn(gd._fullData[i]._module, 'someMethod')` in
// tests that hold a live reference to this module object - assigning to a
// getter-only property throws "not declared writable or has no setter".
// A plain mutable object keeps that working exactly like the pre-conversion
// .js file, while default imports (`import Mesh3d from
// 'plotly.js/traces/mesh3d'`) already resolve to this whole object via
// standard CJS/ESM synthetic-default interop.
module.exports = {
    attributes: require('./attributes'),
    supplyDefaults: require('./defaults'),
    calc: require('./calc'),
    colorbar: {
        min: 'cmin',
        max: 'cmax'
    },
    plot: require('./convert'),

    moduleType: 'trace',
    name: 'mesh3d',
    basePlotModule: require('../../plots/gl3d'),
    categories: ['gl3d', 'showLegend'],
    meta: {
        description: [
            'Draws sets of triangles with coordinates given by',
            'three 1-dimensional arrays in `x`, `y`, `z` and',
            '(1) a sets of `i`, `j`, `k` indices',
            '(2) Delaunay triangulation or',
            '(3) the Alpha-shape algorithm or',
            '(4) the Convex-hull algorithm'
        ].join(' ')
    }
};
