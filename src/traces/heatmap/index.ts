'use strict';

// Plain CommonJS module.exports (no real `export` syntax) is deliberate here:
// esbuild compiles named `export const` bindings to getter-only accessor
// properties on the CJS `exports` object (required for ESM live-binding
// semantics), which breaks `spyOn(gd._fullData[i]._module, 'someMethod')` in
// tests that hold a live reference to this module object - assigning to a
// getter-only property throws "not declared writable or has no setter".
// A plain mutable object keeps that working exactly like the pre-conversion
// .js file, while default imports (`import Heatmap from
// 'plotly.js/traces/heatmap'`) already resolve to this whole object via
// standard CJS/ESM synthetic-default interop.
module.exports = {
    attributes: require('./attributes'),
    supplyDefaults: require('./defaults'),
    calc: require('./calc'),
    plot: require('./plot'),
    colorbar: require('./colorbar'),
    style: require('./style'),
    hoverPoints: require('./hover'),

    moduleType: 'trace',
    name: 'heatmap',
    basePlotModule: require('../../plots/cartesian'),
    categories: ['cartesian', 'svg', '2dMap', 'showLegend'],
    meta: {
        description: [
            'The data that describes the heatmap value-to-color mapping',
            'is set in `z`.',
            'Data in `z` can either be a {2D array} of values (ragged or not)',
            'or a 1D array of values.',

            'In the case where `z` is a {2D array},',
            'say that `z` has N rows and M columns.',
            'Then, by default, the resulting heatmap will have N partitions along',
            'the y axis and M partitions along the x axis.',
            'In other words, the i-th row/ j-th column cell in `z`',
            'is mapped to the i-th partition of the y axis',
            '(starting from the bottom of the plot) and the j-th partition',
            'of the x-axis (starting from the left of the plot).',
            'This behavior can be flipped by using `transpose`.',
            'Moreover, `x` (`y`) can be provided with M or M+1 (N or N+1) elements.',
            'If M (N), then the coordinates correspond to the center of the',
            'heatmap cells and the cells have equal width.',
            'If M+1 (N+1), then the coordinates correspond to the edges of the',
            'heatmap cells.',

            'In the case where `z` is a 1D {array}, the x and y coordinates must be',
            'provided in `x` and `y` respectively to form data triplets.'
        ].join(' ')
    }
};
