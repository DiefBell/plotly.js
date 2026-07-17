'use strict';

var deprecationWarning = [
    '*densitymapbox* trace is deprecated!',
    'Please consider switching to the *densitymap* trace type and `map` subplots.',
    'Learn more at: https://plotly.com/python/maplibre-migration/',
    'as well as https://plotly.com/javascript/maplibre-migration/'
].join(' ');

// Plain CommonJS module.exports (no real `export` syntax) is deliberate here:
// esbuild compiles named `export const` bindings to getter-only accessor
// properties on the CJS `exports` object (required for ESM live-binding
// semantics), which breaks `spyOn(gd._fullData[i]._module, 'someMethod')` in
// tests that hold a live reference to this module object - assigning to a
// getter-only property throws "not declared writable or has no setter".
// A plain mutable object keeps that working exactly like the pre-conversion
// .js file, while default imports (`import DensityMapbox from
// 'plotly.js/traces/densitymapbox'`) already resolve to this whole object via
// standard CJS/ESM synthetic-default interop.
module.exports = {
    attributes: require('./attributes'),
    supplyDefaults: require('./defaults'),
    colorbar: require('../heatmap/colorbar'),
    formatLabels: require('../scattermapbox/format_labels'),
    calc: require('./calc'),
    plot: require('./plot'),
    hoverPoints: require('./hover'),
    eventData: require('./event_data'),

    getBelow: function(trace, subplot) {
        var mapLayers = subplot.getMapLayers();

        // find first layer with `type: 'symbol'`,
        // that is not a plotly layer
        for(var i = 0; i < mapLayers.length; i++) {
            var layer = mapLayers[i];
            var layerId = layer.id;
            if(layer.type === 'symbol' &&
                typeof layerId === 'string' && layerId.indexOf('plotly-') === -1
            ) {
                return layerId;
            }
        }
    },

    moduleType: 'trace',
    name: 'densitymapbox',
    basePlotModule: require('../../plots/mapbox'),
    categories: ['mapbox', 'gl', 'showLegend'],
    meta: {
        hr_name: 'density_mapbox',
        description: [
            deprecationWarning,
            'Draws a bivariate kernel density estimation with a Gaussian kernel',
            'from `lon` and `lat` coordinates and optional `z` values using a colorscale.'
        ].join(' ')
    }
};
