const { environmentPlugin } = require('esbuild-plugin-environment');
const { glsl } = require('esbuild-plugin-glsl');
const InlineCSSPlugin = require('esbuild-plugin-inline-css');
const path = require('path');
const constants = require('./tasks/util/constants.js');

// Default config used when building library
const esbuildConfig = {
    entryPoints: ['./lib/index.js'],
    format: 'iife',
    globalName: 'Plotly',
    bundle: true,
    minify: false,
    sourcemap: false,
    plugins: [InlineCSSPlugin(), glsl({ minify: true }), environmentPlugin({ NODE_DEBUG: false })],
    alias: {
        stream: 'stream-browserify'
    },
    define: {
        global: 'window',
        'define.amd': 'false'
    },
    target: 'es2016',
    logLevel: 'info'
};

// Config used when building bundle to serve test dashboard
const devtoolsConfig = {
    entryPoints: [path.join(constants.pathToRoot, 'devtools', 'test_dashboard', 'devtools.js')],
    outfile: path.join(constants.pathToRoot, 'build', 'test_dashboard-bundle.js'),
    format: 'cjs',
    globalName: 'Tabs',
    bundle: true,
    minify: false,
    sourcemap: false,
    plugins: [glsl({ minify: true })],
    define: { global: 'window' },
    target: 'es2016',
    logLevel: 'info'
};

// Config used when building plotly.js for local development
const localDevConfig = {
    ...esbuildConfig,
    outfile: './build/plotly.js'
};

// Config used when building bundle to serve regl
const localDevReglCodegenConfig = {
    ...devtoolsConfig,
    entryPoints: [path.join(constants.pathToRoot, 'devtools/regl_codegen', 'devtools.js')],
    outfile: './build/regl_codegen-bundle.js'
};

// Config used for the npm package's CJS output (dist/npm/cjs/): an
// unbundled, 1:1 transpiled mirror of src/, so every internal relative
// require() resolves naturally via Node's own resolver, same as raw source
// does today. This is the low-risk half of the dual-format build - it
// doesn't attempt real tree-shaking (require() is opaque to bundlers), it
// just lets consumers deep-require exactly the (converted) module they want.
const npmCjsConfig = {
    bundle: false,
    format: 'cjs',
    platform: 'node',
    outdir: constants.pathToDistNpmCjs,
    outbase: constants.pathToSrc,
    plugins: [InlineCSSPlugin(), glsl({ minify: true })],
    target: 'es2016',
    logLevel: 'info'
};

// Config used for the npm package's ESM output (dist/npm/esm/): bundled +
// code-split multi-entry-point output, so consumers doing
// `import BarChart from 'plotly.js/traces/bar'` in their own bundler only
// pull in that trace's code (once it's converted - see entryPoints in
// tasks/bundle_npm.mjs).
//
// NOTE on `external`: the original plan was to leave runtime dependencies
// external here so consumers' own bundlers dedupe them. That only works
// when a dependency is reached via a real ES `import` statement, which
// esbuild can rewrite into an external ESM import directly. But almost the
// entire codebase (everything except the handful of files converted to .ts
// so far) still reaches its dependencies via plain `require()` calls, which
// esbuild can't rewrite the same way - externalizing those makes it fall
// back to a runtime `require()` shim in the emitted ESM code, which throws
// at import time since Node's ESM loader has no global `require`. So for
// now this bundles everything, same as the browser esbuildConfig above -
// revisit `external` once more of the codebase uses real `import` for its
// third-party deps.
const npmEsmConfig = {
    bundle: true,
    splitting: true,
    format: 'esm',
    outdir: constants.pathToDistNpmEsm,
    plugins: [InlineCSSPlugin(), glsl({ minify: true }), environmentPlugin({ NODE_DEBUG: false })],
    alias: {
        stream: 'stream-browserify'
    },
    define: {
        global: 'window',
        'define.amd': 'false'
    },
    target: 'es2016',
    logLevel: 'info'
};

module.exports = {
    devtoolsConfig,
    esbuildConfig,
    localDevConfig,
    localDevReglCodegenConfig,
    npmCjsConfig,
    npmEsmConfig
};
