'use strict';

// ESM-clean equivalent of lib/index.js (the browser-IIFE entry point, left
// untouched). This is the new npm "." entry: it statically imports core plus
// every trace module and registers them, using real `import`/`export`
// syntax so esbuild's ESM output has proper static exports - unlike
// lib/index.js's `var Plotly = require('./core'); Plotly.register([...]);
// module.exports = Plotly;` pattern, which is a dynamically-mutated object
// esbuild's CJS->ESM interop can't derive named exports from cleanly.
import * as core from './core';

import ScatterModule from './traces/scatter';

// The 47 trace/component modules below are not yet converted to TypeScript
// (Phase 1 only converts `scatter`). They're required with plain `require()`
// rather than `import`, deliberately: with `declaration: true`, TS attempts
// declaration emit for every file reached via ES `import` syntax, and these
// files weren't written to support that (private/anonymous inferred types
// leak into what would be their .d.ts). `require()` resolves to `any` and
// doesn't pull its target into TS's declaration-emit graph. Once a trace
// converts to .ts in a later phase, move its import up next to ScatterModule.
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
