'use strict';

// Plain CommonJS module.exports (no real `export` syntax) is deliberate here:
// esbuild compiles named `export const` bindings to getter-only accessor
// properties on the CJS `exports` object (required for ESM live-binding
// semantics), which breaks `spyOn(gd._fullData[i]._module, 'someMethod')` in
// tests that hold a live reference to this module object - assigning to a
// getter-only property throws "not declared writable or has no setter".
// A plain mutable object keeps that working exactly like the pre-conversion
// .js file, while default imports (`import Cone from
// 'plotly.js/traces/cone'`) already resolve to this whole object via
// standard CJS/ESM synthetic-default interop.
module.exports = {
    moduleType: 'trace',
    name: 'cone',
    basePlotModule: require('../../plots/gl3d'),
    categories: ['gl3d', 'showLegend'],

    attributes: require('./attributes'),
    supplyDefaults: require('./defaults'),
    colorbar: {
        min: 'cmin',
        max: 'cmax'
    },
    calc: require('./calc'),
    plot: require('./convert'),
    eventData: function(out, pt) {
        out.norm = pt.traceCoordinate[6];
        return out;
    },

    meta: {
        description: [
            'Use cone traces to visualize vector fields.',
            '',
            'Specify a vector field using 6 1D arrays,',
            '3 position arrays `x`, `y` and `z`',
            'and 3 vector component arrays `u`, `v`, `w`.',
            'The cones are drawn exactly at the positions given',
            'by `x`, `y` and `z`.'
        ].join(' ')
    }
};
