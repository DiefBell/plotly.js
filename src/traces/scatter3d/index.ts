'use strict';

// Plain CommonJS module.exports (no real `export` syntax) is deliberate here:
// esbuild compiles named `export const` bindings to getter-only accessor
// properties on the CJS `exports` object (required for ESM live-binding
// semantics), which breaks `spyOn(gd._fullData[i]._module, 'someMethod')` in
// tests that hold a live reference to this module object - assigning to a
// getter-only property throws "not declared writable or has no setter".
// A plain mutable object keeps that working exactly like the pre-conversion
// .js file, while default imports (`import Scatter3d from
// 'plotly.js/traces/scatter3d'`) already resolve to this whole object via
// standard CJS/ESM synthetic-default interop.
module.exports = {
    plot: require('./convert'),
    attributes: require('./attributes'),
    markerSymbols: require('../../constants/gl3d_markers'),
    supplyDefaults: require('./defaults'),
    colorbar: [
        {
            container: 'marker',
            min: 'cmin',
            max: 'cmax'
        }, {
            container: 'line',
            min: 'cmin',
            max: 'cmax'
        }
    ],
    calc: require('./calc'),

    moduleType: 'trace',
    name: 'scatter3d',
    basePlotModule: require('../../plots/gl3d'),
    categories: ['gl3d', 'symbols', 'showLegend', 'scatter-like'],
    meta: {
        hrName: 'scatter_3d',
        description: [
            'The data visualized as scatter point or lines in 3D dimension',
            'is set in `x`, `y`, `z`.',
            'Text (appearing either on the chart or on hover only) is via `text`.',
            'Bubble charts are achieved by setting `marker.size` and/or `marker.color`',
            'Projections are achieved via `projection`.',
            'Surface fills are achieved via `surfaceaxis`.'
        ].join(' ')
    }
};
