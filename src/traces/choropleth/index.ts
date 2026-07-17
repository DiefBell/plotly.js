'use strict';

// Plain CommonJS module.exports (no real `export` syntax) is deliberate here:
// esbuild compiles named `export const` bindings to getter-only accessor
// properties on the CJS `exports` object (required for ESM live-binding
// semantics), which breaks `spyOn(gd._fullData[i]._module, 'someMethod')` in
// tests that hold a live reference to this module object - assigning to a
// getter-only property throws "not declared writable or has no setter".
// A plain mutable object keeps that working exactly like the pre-conversion
// .js file, while default imports (`import Choropleth from
// 'plotly.js/traces/choropleth'`) already resolve to this whole object via
// standard CJS/ESM synthetic-default interop.
module.exports = {
    attributes: require('./attributes'),
    supplyDefaults: require('./defaults'),
    colorbar: require('../heatmap/colorbar'),
    calc: require('./calc'),
    calcGeoJSON: require('./plot').calcGeoJSON,
    plot: require('./plot').plot,
    style: require('./style').style,
    styleOnSelect: require('./style').styleOnSelect,
    hoverPoints: require('./hover'),
    eventData: require('./event_data'),
    selectPoints: require('./select'),

    moduleType: 'trace',
    name: 'choropleth',
    basePlotModule: require('../../plots/geo'),
    categories: ['geo', 'noOpacity', 'showLegend'],
    meta: {
        description: [
            'The data that describes the choropleth value-to-color mapping',
            'is set in `z`.',
            'The geographic locations corresponding to each value in `z`',
            'are set in `locations`.'
        ].join(' ')
    }
};
