import fs from 'fs';
import path from 'path';
import { build } from 'esbuild';
import { glob } from 'glob';

import constants from './util/constants.js';
import { npmCjsConfig, npmEsmConfig } from '../esbuild-config.js';

// Check the build/plotcss.js prerequisite the same way tasks/bundle.mjs does -
// src/core.ts requires it too.
if (!fs.existsSync(constants.pathToCSSBuild)) {
    throw new Error(['build/plotcss.js is missing', 'Please run `npm run preprocess` first'].join('\n'));
}
if (!fs.existsSync(constants.pathToStackglModules)) {
    throw new Error('stackgl_modules/ is missing - required by several gl3d trace modules');
}

function writePackageJson(dir, type) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ type }, null, 2) + '\n');
}

async function buildCjs() {
    // 1:1 transpiled mirror of src/ (converted .ts files type-stripped,
    // untouched .js files passed through near-unchanged) - every entry point
    // is enumerated explicitly rather than relying on esbuild's own
    // entryPoints glob expansion, matching this project's existing tasks/*
    // convention of using the `glob` package directly.
    const entryPoints = await glob('**/*.{ts,js}', {
        cwd: constants.pathToSrc,
        absolute: true
    });

    await build({
        ...npmCjsConfig,
        entryPoints
    });

    writePackageJson(constants.pathToDistNpmCjs, 'commonjs');
    mirrorEscapingRequireTargets();
}

// A handful of src/ files reach outside the src/ tree via relative requires
// (e.g. `require('../build/plotcss')`, `require('../../../stackgl_modules')`,
// `require('../../dist/topojson/<name>.json')` in src/assets/geo_assets.js).
// With bundle:false, esbuild passes such requires through verbatim rather
// than rewriting them, so each target needs to keep resolving correctly from
// the *output* tree too. dist/npm/cjs/ sits exactly 2 directory levels
// deeper than the original file's src/-relative directory did (dist/npm/cjs
// vs just src at the repo root), so - since the require string itself is
// unchanged - every escaping target needs to be mirrored 2 levels deeper
// than its original repo-root-relative location, alongside dist/npm/cjs/
// itself. This is a fixed, exhaustively-verified list (see the Phase 1 plan)
// - if a new file adds an escaping require, it needs an entry here too.
function mirrorEscapingRequireTargets() {
    // require('../build/plotcss') from src/core.ts -> dist/npm/build/plotcss.js
    const distBuildDir = path.join(constants.pathToDistNpm, 'build');
    fs.mkdirSync(distBuildDir, { recursive: true });
    const plotcssSrc = fs.readFileSync(constants.pathToCSSBuild, 'utf-8');
    // plotcss.js itself has one relative require, `require('../src/lib')`
    // (relative to build/, a sibling of src/ at the repo root) - rewrite it
    // to point at the compiled lib in this output tree instead
    // (dist/npm/cjs/lib, i.e. `../cjs/lib` from dist/npm/build/plotcss.js).
    const plotcssRewritten = plotcssSrc.replace("require('../src/lib')", "require('../cjs/lib')");
    if (plotcssRewritten === plotcssSrc) {
        throw new Error(
            'tasks/bundle_npm.mjs: expected to rewrite a `require(\'../src/lib\')` ' +
            'in build/plotcss.js but found none - has its content changed?'
        );
    }
    fs.writeFileSync(path.join(distBuildDir, 'plotcss.js'), plotcssRewritten);

    // require('../../../stackgl_modules') from src/plots/gl3d/scene.js and
    // src/traces/{cone,isosurface,mesh3d,scatter3d,streamtube,surface,volume}/
    // convert.js -> dist/npm/stackgl_modules/
    fs.cpSync(constants.pathToStackglModules, path.join(constants.pathToDistNpm, 'stackgl_modules'), {
        recursive: true,
        filter: (src) => path.basename(src) !== 'node_modules'
    });

    // require('../../dist/topojson/<name>.json') from src/assets/geo_assets.js
    // -> dist/npm/dist/topojson/
    if (!fs.existsSync(constants.pathToTopojsonDist)) {
        throw new Error(['dist/topojson/ is missing', 'Please run `npm run preprocess` first'].join('\n'));
    }
    fs.cpSync(constants.pathToTopojsonDist, path.join(constants.pathToDistNpm, 'dist', 'topojson'), {
        recursive: true
    });
}

async function buildEsm() {
    // Curated multi-entry ESM build: only entry points that transitively
    // touch converted (.ts) files need to resolve into this compiled output -
    // the ~48 not-yet-converted traces keep resolving straight to raw
    // lib/<name>.js -> src/traces/<name> via the package.json "exports" map,
    // with zero build step, until they're converted (see the playbook in the
    // Phase 1 plan for how new entries get added here as that happens).
    const entryPoints = {
        index: constants.pathToPlotlyIndexEsm,
        core: constants.pathToPlotlyCore,
        'traces/scatter': path.join(constants.pathToSrc, 'traces/scatter/index.ts')
    };

    await build({
        ...npmEsmConfig,
        entryPoints
    });

    writePackageJson(constants.pathToDistNpmEsm, 'module');
}

Promise.all([buildCjs(), buildEsm()]).catch(err => {
    console.error(err);
    process.exit(1);
});
