'use strict';

// Plain CommonJS module.exports (no real `export` syntax) is deliberate here:
// esbuild compiles named `export const` bindings to getter-only accessor
// properties on the CJS `exports` object (required for ESM live-binding
// semantics), which breaks `spyOn(gd._fullData[i]._module, 'someMethod')` in
// tests that hold a live reference to this module object - assigning to a
// getter-only property throws "not declared writable or has no setter".
// A plain mutable object keeps that working exactly like the pre-conversion
// .js file, while default imports (`import Treemap from
// 'plotly.js/traces/treemap'`) already resolve to this whole object via
// standard CJS/ESM synthetic-default interop.
module.exports = {
    moduleType: 'trace',
    name: 'treemap',
    basePlotModule: require('./base_plot'),
    categories: [],
    animatable: true,

    attributes: require('./attributes'),
    layoutAttributes: require('./layout_attributes'),
    supplyDefaults: require('./defaults'),
    supplyLayoutDefaults: require('./layout_defaults'),

    calc: require('./calc').calc,
    crossTraceCalc: require('./calc').crossTraceCalc,

    plot: require('./plot'),
    style: require('./style').style,

    colorbar: require('../scatter/marker_colorbar'),

    meta: {
        description: [
            'Visualize hierarchal data from leaves (and/or outer branches) towards root',
            'with rectangles. The treemap sectors are determined by the entries in',
            '*labels* or *ids* and in *parents*.'
        ].join(' ')
    }
};
