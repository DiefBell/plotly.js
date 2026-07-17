'use strict';

var deprecationWarning = [
    '*choroplethmapbox* trace is deprecated!',
    'Please consider switching to the *choroplethmap* trace type and `map` subplots.',
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
// .js file, while default imports (`import ChoroplethMapbox from
// 'plotly.js/traces/choroplethmapbox'`) already resolve to this whole object
// via standard CJS/ESM synthetic-default interop.
module.exports = {
    attributes: require('./attributes'),
    supplyDefaults: require('./defaults'),
    colorbar: require('../heatmap/colorbar'),
    calc: require('../choropleth/calc'),
    plot: require('./plot'),
    hoverPoints: require('../choropleth/hover'),
    eventData: require('../choropleth/event_data'),
    selectPoints: require('../choropleth/select'),

    styleOnSelect: function(_, cd) {
        if(cd) {
            var trace = cd[0].trace;
            trace._glTrace.updateOnSelect(cd);
        }
    },

    getBelow: function(trace, subplot) {
        var mapLayers = subplot.getMapLayers();

        // find layer just above top-most "water" layer
        // that is not a plotly layer
        for(var i = mapLayers.length - 2; i >= 0; i--) {
            var layerId = mapLayers[i].id;

            if(typeof layerId === 'string' &&
                layerId.indexOf('water') === 0
            ) {
                for(var j = i + 1; j < mapLayers.length; j++) {
                    layerId = mapLayers[j].id;

                    if(typeof layerId === 'string' &&
                        layerId.indexOf('plotly-') === -1
                    ) {
                        return layerId;
                    }
                }
            }
        }
    },

    moduleType: 'trace',
    name: 'choroplethmapbox',
    basePlotModule: require('../../plots/mapbox'),
    categories: ['mapbox', 'gl', 'noOpacity', 'showLegend'],
    meta: {
        hr_name: 'choropleth_mapbox',
        description: [
            deprecationWarning,
            'GeoJSON features to be filled are set in `geojson`',
            'The data that describes the choropleth value-to-color mapping',
            'is set in `locations` and `z`.'
        ].join(' ')
    }
};
