'use strict';

export const version = require('./version').version;

// inject promise polyfill
require('native-promise-only');

// inject plot css
require('../build/plotcss');

// include registry module and expose register method
var Registry = require('./registry');
var register = Registry.register;
export { register };

// expose plot api methods
var plotApi = require('./plot_api');

// Explicit static exports for the public plot_api surface (rather than the
// old dynamic `for (name of Object.keys(plotApi))` loop) so ESM tooling /
// bundlers can see this module's exports ahead of time. The names below are
// the same public (non `_`-prefixed) names src/plot_api/index.js hand-writes.
export const _doPlot = plotApi._doPlot;
export const newPlot = plotApi.newPlot;
export const restyle = plotApi.restyle;
export const relayout = plotApi.relayout;
export const redraw = plotApi.redraw;
export const update = plotApi.update;
export const _guiRestyle = plotApi._guiRestyle;
export const _guiRelayout = plotApi._guiRelayout;
export const _guiUpdate = plotApi._guiUpdate;
export const _storeDirectGUIEdit = plotApi._storeDirectGUIEdit;
export const react = plotApi.react;
export const extendTraces = plotApi.extendTraces;
export const prependTraces = plotApi.prependTraces;
export const addTraces = plotApi.addTraces;
export const deleteTraces = plotApi.deleteTraces;
export const moveTraces = plotApi.moveTraces;
export const purge = plotApi.purge;
export const addFrames = plotApi.addFrames;
export const deleteFrames = plotApi.deleteFrames;
export const animate = plotApi.animate;
export const setPlotConfig = plotApi.setPlotConfig;
export const deleteActiveShape = plotApi.deleteActiveShape;
export const toImage = plotApi.toImage;
export const validate = plotApi.validate;
export const downloadImage = plotApi.downloadImage;
export const makeTemplate = plotApi.makeTemplate;
export const validateTemplate = plotApi.validateTemplate;

// register every plot_api method (including private `_`-prefixed ones, for
// internal use) so Registry.call(name, ...) can dispatch to them - this part
// stays dynamic since it only affects runtime dispatch, not this module's
// static ESM export shape.
var apiMethodNames = Object.keys(plotApi);
for(var i = 0; i < apiMethodNames.length; i++) {
    var apiMethodName = apiMethodNames[i];
    register({
        moduleType: 'apiMethod',
        name: apiMethodName,
        fn: plotApi[apiMethodName]
    });
}

// scatter is the only trace included by default
register(require('./traces/scatter'));

// register all registrable components modules
register([
    require('./components/annotations'),
    require('./components/annotations3d'),
    require('./components/selections'),
    require('./components/shapes'),
    require('./components/images'),
    require('./components/updatemenus'),
    require('./components/sliders'),
    require('./components/rangeslider'),
    require('./components/rangeselector'),
    require('./components/grid'),
    require('./components/errorbars'),
    require('./components/colorscale'),
    require('./components/colorbar'),
    require('./components/legend'), // legend needs to come after shape | legend defaults depends on shapes
    require('./components/fx'), // fx needs to come after legend | unified hover defaults depends on legends
    require('./components/modebar')
]);

// locales en and en-US are required for default behavior
register([
    require('./locale-en'),
    require('./locale-en-us')
]);

// locales that are present in the window should be loaded
if(window.PlotlyLocales && Array.isArray(window.PlotlyLocales)) {
    register(window.PlotlyLocales);
    delete window.PlotlyLocales;
}

// plot icons
export const Icons = require('./fonts/ploticon');

// unofficial 'beta' plot methods, use at your own risk
var FxModule = require('./components/fx');
var PlotsModule = require('./plots/plots');

export const Plots = {
    resize: PlotsModule.resize,
    graphJson: PlotsModule.graphJson,
    sendDataToCloud: PlotsModule.sendDataToCloud
};
export const Fx = {
    hover: FxModule.hover,
    unhover: FxModule.unhover,
    loneHover: FxModule.loneHover,
    loneUnhover: FxModule.loneUnhover
};
export const Snapshot = require('./snapshot');
export const PlotSchema = require('./plot_api/plot_schema');
