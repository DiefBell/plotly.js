'use strict';

// ESM-clean equivalent of lib/index.js (the browser-IIFE entry point, left
// untouched). This is the new npm "." entry: it statically imports core
// (which does use real named `export`s) and registers every trace module.
import * as core from './core';

// Trace index.ts files intentionally use plain `module.exports = {...}`
// (no real ES `export` syntax), even once converted to TypeScript: esbuild
// compiles named `export const` bindings to getter-only accessor properties
// on the CJS `exports` object, which breaks `spyOn(Trace, 'someMethod')` in
// tests that `require()` a trace module directly. A plain mutable object
// avoids that while still resolving correctly via default-import interop
// for real npm consumers (e.g. `import BarChart from 'plotly.js/traces/bar'`
// or `import BarModule from './traces/bar'` here) - so every trace, converted
// or not, is required the same way. `require()` also keeps each trace's own
// exports out of TS's declaration-emit graph (with `declaration: true`, an
// `import` would pull the target's inferred types into what TS attempts to
// declare-emit, which not every converted trace file is written to support
// cleanly yet).
var ScatterModule = require('./traces/scatter');
var BarModule = require('./traces/bar');
var BoxModule = require('./traces/box');
var HeatmapModule = require('./traces/heatmap');
var HistogramModule = require('./traces/histogram');
var Histogram2dModule = require('./traces/histogram2d');
var Histogram2dContourModule = require('./traces/histogram2dcontour');
var ContourModule = require('./traces/contour');
var ScatterTernaryModule = require('./traces/scatterternary');
var ViolinModule = require('./traces/violin');
var FunnelModule = require('./traces/funnel');
var WaterfallModule = require('./traces/waterfall');
var ImageModule = require('./traces/image');
var PieModule = require('./traces/pie');
var SunburstModule = require('./traces/sunburst');
var TreemapModule = require('./traces/treemap');
var IcicleModule = require('./traces/icicle');
var FunnelareaModule = require('./traces/funnelarea');
var Scatter3dModule = require('./traces/scatter3d');
var SurfaceModule = require('./traces/surface');
var IsosurfaceModule = require('./traces/isosurface');
var VolumeModule = require('./traces/volume');
var Mesh3dModule = require('./traces/mesh3d');
var ConeModule = require('./traces/cone');
var StreamtubeModule = require('./traces/streamtube');
var ScattergeoModule = require('./traces/scattergeo');
var ChoroplethModule = require('./traces/choropleth');
var ScatterglModule = require('./traces/scattergl');
var SplomModule = require('./traces/splom');
var ParcoordsModule = require('./traces/parcoords');
var ParcatsModule = require('./traces/parcats');
var ScattermapboxModule = require('./traces/scattermapbox');
var ChoroplethmapboxModule = require('./traces/choroplethmapbox');
var DensitymapboxModule = require('./traces/densitymapbox');
var ScattermapModule = require('./traces/scattermap');
var ChoroplethmapModule = require('./traces/choroplethmap');
var DensitymapModule = require('./traces/densitymap');
var SankeyModule = require('./traces/sankey');
var IndicatorModule = require('./traces/indicator');
var TableModule = require('./traces/table');
var CarpetModule = require('./traces/carpet');
var ScattercarpetModule = require('./traces/scattercarpet');
var ContourcarpetModule = require('./traces/contourcarpet');
var OhlcModule = require('./traces/ohlc');
var CandlestickModule = require('./traces/candlestick');
var ScatterpolarModule = require('./traces/scatterpolar');
var ScatterpolarglModule = require('./traces/scatterpolargl');
var BarpolarModule = require('./traces/barpolar');
var ScattersmithModule = require('./traces/scattersmith');

var CalendarsModule = require('./components/calendars');

core.register([
    // traces
    ScatterModule,
    BarModule,
    BoxModule,
    HeatmapModule,
    HistogramModule,
    Histogram2dModule,
    Histogram2dContourModule,
    ContourModule,
    ScatterTernaryModule,
    ViolinModule,
    FunnelModule,
    WaterfallModule,
    ImageModule,
    PieModule,
    SunburstModule,
    TreemapModule,
    IcicleModule,
    FunnelareaModule,
    Scatter3dModule,
    SurfaceModule,
    IsosurfaceModule,
    VolumeModule,
    Mesh3dModule,
    ConeModule,
    StreamtubeModule,
    ScattergeoModule,
    ChoroplethModule,
    ScatterglModule,
    SplomModule,
    ParcoordsModule,
    ParcatsModule,
    ScattermapboxModule,
    ChoroplethmapboxModule,
    DensitymapboxModule,
    ScattermapModule,
    ChoroplethmapModule,
    DensitymapModule,
    SankeyModule,
    IndicatorModule,
    TableModule,
    CarpetModule,
    ScattercarpetModule,
    ContourcarpetModule,
    OhlcModule,
    CandlestickModule,
    ScatterpolarModule,
    ScatterpolarglModule,
    BarpolarModule,
    ScattersmithModule,

    // components
    CalendarsModule
]);

export * from './core';
export default core;
