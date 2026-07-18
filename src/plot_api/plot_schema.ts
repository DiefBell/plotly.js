'use strict';

var Registry = require('../registry');
var Lib = require('../lib');

var baseAttributes = require('../plots/attributes');
var baseLayoutAttributes = require('../plots/layout_attributes');
var frameAttributes = require('../plots/frame_attributes');
var animationAttributes = require('../plots/animation_attributes');
var configAttributes = require('./plot_config').configAttributes;

var editTypes = require('./edit_types');

import {Layout} from '../types';

// attribute-schema objects (valType/dflt/editType/description/...) - the full
// recursive schema DSL isn't exhaustively typed, see the scope-boundary note
// in the plot_api TS conversion project design
type Schema = Record<string, any>;

var extendDeepAll = Lib.extendDeepAll;
var isPlainObject = Lib.isPlainObject;
var isArrayOrTypedArray = Lib.isArrayOrTypedArray;
var nestedProperty = Lib.nestedProperty;
var valObjectMeta = Lib.valObjectMeta;

var IS_SUBPLOT_OBJ = '_isSubplotObj';
var IS_LINKED_TO_ARRAY = '_isLinkedToArray';
var ARRAY_ATTR_REGEXPS = '_arrayAttrRegexps';
var DEPRECATED = '_deprecated';
var UNDERSCORE_ATTRS = [IS_SUBPLOT_OBJ, IS_LINKED_TO_ARRAY, ARRAY_ATTR_REGEXPS, DEPRECATED];

// components whose layout/subplot attrs are composed statically (rather than
// merged in here at schema-build time) - see the skip in getLayoutAttributes
var STATICALLY_COMPOSED_LAYOUT_COMPONENTS = {
    grid: true,
    fx: true,
    rangeslider: true,
    rangeselector: true,
    annotations3d: true,
    calendars: true
};

exports.IS_SUBPLOT_OBJ = IS_SUBPLOT_OBJ;
exports.IS_LINKED_TO_ARRAY = IS_LINKED_TO_ARRAY;
exports.DEPRECATED = DEPRECATED;
exports.UNDERSCORE_ATTRS = UNDERSCORE_ATTRS;

/** Outputs the full plotly.js plot schema
 *
 * @return {object}
 *  - defs
 *  - traces
 *  - layout
 *  - frames
 *  - animations
 *  - config
 */
exports.get = function(): Schema {
    var traces = {};

    Registry.allTypes.forEach(function(type) {
        traces[type] = getTraceAttributes(type);
    });

    return {
        defs: {
            valObjects: valObjectMeta,
            metaKeys: UNDERSCORE_ATTRS.concat(['description', 'role', 'editType', 'impliedEdits']),
            editType: {
                traces: editTypes.traces,
                layout: editTypes.layout
            },
            impliedEdits: {
                description: [
                    'Sometimes when an attribute is changed, other attributes',
                    'must be altered as well in order to achieve the intended',
                    'result. For example, when `range` is specified, it is',
                    'important to set `autorange` to `false` or the new `range`',
                    'value would be lost in the redraw. `impliedEdits` is the',
                    'mechanism to do this: `impliedEdits: {autorange: false}`.',
                    'Each key is a relative paths to the attribute string to',
                    'change, using *^* to ascend into the parent container,',
                    'for example `range[0]` has `impliedEdits: {*^autorange*: false}`.',
                    'A value of `undefined` means that the attribute will not be',
                    'changed, but its previous value should be recorded in case',
                    'we want to reverse this change later. For example, `autorange`',
                    'has `impliedEdits: {*range[0]*: undefined, *range[1]*:undefined}',
                    'because the range will likely be changed by redraw.'
                ].join(' ')
            }
        },

        traces: traces,
        layout: getLayoutAttributes(),

        frames: getFramesAttributes(),
        animation: formatAttributes(animationAttributes),

        config: formatAttributes(configAttributes)
    };
};

/**
 * Crawl the attribute tree, recursively calling a callback function
 *
 * @param {object} attrs
 *  The node of the attribute tree (e.g. the root) from which recursion originates
 * @param {Function} callback
 *  A callback function with the signature:
 *          @callback callback
 *          @param {object} attr an attribute
 *          @param {String} attrName name string
 *          @param {object[]} attrs all the attributes
 *          @param {Number} level the recursion level, 0 at the root
 *          @param {String} fullAttrString full attribute name (ie 'marker.line')
 * @param {Number} [specifiedLevel]
 *  The level in the tree, in order to let the callback function detect descend or backtrack,
 *  typically unsupplied (implied 0), just used by the self-recursive call.
 *  The necessity arises because the tree traversal is not controlled by callback return values.
 *  The decision to not use callback return values for controlling tree pruning arose from
 *  the goal of keeping the crawler backwards compatible. Observe that one of the pruning conditions
 *  precedes the callback call.
 * @param {string} [attrString]
 *  the path to the current attribute, as an attribute string (ie 'marker.line')
 *  typically unsupplied, but you may supply it if you want to disambiguate which attrs tree you
 *  are starting from
 *
 * @return {object} transformOut
 *  copy of transformIn that contains attribute defaults
 */
exports.crawl = function(
    attrs: Schema,
    callback: (attr: any, attrName: string, attrs: Schema, level: number, fullAttrString: string) => void,
    specifiedLevel?: number,
    attrString?: string
) {
    var level = specifiedLevel || 0;
    attrString = attrString || '';

    Object.keys(attrs).forEach(function(attrName) {
        var attr = attrs[attrName];

        if(UNDERSCORE_ATTRS.indexOf(attrName) !== -1) return;

        var fullAttrString = (attrString ? attrString + '.' : '') + attrName;
        callback(attr, attrName, attrs, level, fullAttrString);

        if(exports.isValObject(attr)) return;

        if(isPlainObject(attr) && attrName !== 'impliedEdits') {
            exports.crawl(attr, callback, level + 1, fullAttrString);
        }
    });
};

/** Is object a value object (or a container object)?
 *
 * @param {object} obj
 * @return {boolean}
 *  returns true for a valid value object and
 *  false for tree nodes in the attribute hierarchy
 */
exports.isValObject = function(obj: any): boolean {
    return obj && obj.valType !== undefined;
};

/**
 * Find all data array attributes in a given trace object - including
 * `arrayOk` attributes.
 *
 * @param {object} trace
 *  full trace object that contains a reference to `_module.attributes`
 *
 * @return {array} arrayAttributes
 *  list of array attributes for the given trace
 */
exports.findArrayAttributes = function(trace: Record<string, any>): string[] {
    var arrayAttributes: string[] = [];
    var stack: string[] = [];
    var isArrayStack: any[] = [];
    var baseContainer: Record<string, any>, baseAttrName: string;

    function callback(attr: any, attrName: string, attrs: Schema, level: number) {
        stack = stack.slice(0, level).concat([attrName]);
        isArrayStack = isArrayStack.slice(0, level).concat([attr && attr._isLinkedToArray]);

        var splittableAttr = (
            attr &&
            (attr.valType === 'data_array' || attr.arrayOk === true) &&
            !(stack[level - 1] === 'colorbar' && (attrName === 'ticktext' || attrName === 'tickvals'))
        );

        // Manually exclude 'colorbar.tickvals' and 'colorbar.ticktext' for now
        // which are declared as `valType: 'data_array'` but scale independently of
        // the coordinate arrays.
        //
        // Down the road, we might want to add a schema field (e.g `uncorrelatedArray: true`)
        // to distinguish attributes of the likes.

        if(!splittableAttr) return;

        crawlIntoTrace(baseContainer, 0, '');
    }

    function crawlIntoTrace(container: Record<string, any>, i: number, astrPartial: string) {
        var item = container[stack[i]];
        var newAstrPartial = astrPartial + stack[i];
        if(i === stack.length - 1) {
            if(isArrayOrTypedArray(item)) {
                arrayAttributes.push(baseAttrName + newAstrPartial);
            }
        } else {
            if(isArrayStack[i]) {
                if(Array.isArray(item)) {
                    for(var j = 0; j < item.length; j++) {
                        if(isPlainObject(item[j])) {
                            crawlIntoTrace(item[j], i + 1, newAstrPartial + '[' + j + '].');
                        }
                    }
                }
            } else if(isPlainObject(item)) {
                crawlIntoTrace(item, i + 1, newAstrPartial + '.');
            }
        }
    }

    baseContainer = trace;
    baseAttrName = '';
    exports.crawl(baseAttributes, callback);
    if(trace._module && trace._module.attributes) {
        exports.crawl(trace._module.attributes, callback);
    }

    return arrayAttributes;
};

/*
 * Find the valObject for one attribute in an existing trace
 *
 * @param {object} trace
 *  full trace object that contains a reference to `_module.attributes`
 * @param {object} parts
 *  an array of parts, like ['transforms', 1, 'value']
 *  typically from nestedProperty(...).parts
 *
 * @return {object|false}
 *  the valObject for this attribute, or the last found parent
 *  in some cases the innermost valObject will not exist, for example
 *  `valType: 'any'` attributes where we might set a part of the attribute.
 *  In that case, stop at the deepest valObject we *do* find.
 */
exports.getTraceValObject = function(trace: Record<string, any>, parts: (string | number)[]): Schema | false {
    var head = parts[0];
    var i = 1; // index to start recursing from
    var moduleAttrs, valObject;

    // first look in the module for this trace
    // components have already merged their trace attributes in here
    var _module = trace._module;
    if(!_module) _module = (Registry.modules[trace.type || baseAttributes.type.dflt] || {})._module;
    if(!_module) return false;

    moduleAttrs = _module.attributes;
    valObject = moduleAttrs && moduleAttrs[head];

    // then look in the subplot attributes
    if(!valObject) {
        var subplotModule = _module.basePlotModule;
        if(subplotModule && subplotModule.attributes) {
            valObject = subplotModule.attributes[head];
        }
    }

    // finally look in the global attributes
    if(!valObject) valObject = baseAttributes[head];

    return recurseIntoValObject(valObject, parts, i);
};

/*
 * Find the valObject for one layout attribute
 *
 * @param {array} parts
 *  an array of parts, like ['annotations', 1, 'x']
 *  typically from nestedProperty(...).parts
 *
 * @return {object|false}
 *  the valObject for this attribute, or the last found parent
 *  in some cases the innermost valObject will not exist, for example
 *  `valType: 'any'` attributes where we might set a part of the attribute.
 *  In that case, stop at the deepest valObject we *do* find.
 */
exports.getLayoutValObject = function(fullLayout: Layout & Record<string, any>, parts: (string | number)[]): Schema | false {
    var valObject = layoutHeadAttr(fullLayout, parts[0] as string);

    return recurseIntoValObject(valObject, parts, 1);
};

function layoutHeadAttr(fullLayout: Layout & Record<string, any>, head: string): Schema | false {
    var i, key, _module, attributes;

    // look for attributes of the subplot types used on the plot
    var basePlotModules = fullLayout._basePlotModules;
    if(basePlotModules) {
        var out;
        for(i = 0; i < basePlotModules.length; i++) {
            _module = basePlotModules[i];
            if(_module.attrRegex && _module.attrRegex.test(head)) {
                // if a module defines overrides, these take precedence
                // this is to allow different editTypes from svg cartesian
                if(_module.layoutAttrOverrides) return _module.layoutAttrOverrides;

                // otherwise take the first attributes we find
                if(!out && _module.layoutAttributes) out = _module.layoutAttributes;
            }

            // a module can also override the behavior of base (and component) module layout attrs
            var baseOverrides = _module.baseLayoutAttrOverrides;
            if(baseOverrides && head in baseOverrides) return baseOverrides[head];
        }
        if(out) return out;
    }

    // look for layout attributes contributed by traces on the plot
    var modules = fullLayout._modules;
    if(modules) {
        for(i = 0; i < modules.length; i++) {
            attributes = modules[i].layoutAttributes;
            if(attributes && head in attributes) {
                return attributes[head];
            }
        }
    }

    /*
     * Next look in components.
     * Components that define a schema have already merged this into
     * base and subplot attribute defs, so ignore these.
     * Others (older style) all put all their attributes
     * inside a container matching the module `name`
     * eg `attributes` (array) or `legend` (object)
     */
    for(key in Registry.componentsRegistry) {
        _module = Registry.componentsRegistry[key];
        if(_module.name === 'colorscale' && head.indexOf('coloraxis') === 0) {
            return _module.layoutAttributes[head];
        } else if(!_module.schema && (head === _module.name)) {
            return _module.layoutAttributes;
        }
    }

    if(head in baseLayoutAttributes) return baseLayoutAttributes[head];

    return false;
}

function recurseIntoValObject(valObject: Schema | false, parts: (string | number)[], i: number): Schema | false {
    if(!valObject) return false;

    if(valObject._isLinkedToArray) {
        // skip array index, abort if we try to dive into an array without an index
        if(isIndex(parts[i])) i++;
        else if(i < parts.length) return false;
    }

    // now recurse as far as we can. Occasionally we have an attribute
    // setting an internal part below what's in the schema; just return
    // the innermost schema item we find.
    for(; i < parts.length; i++) {
        var newValObject: Schema = valObject[parts[i]];
        if(isPlainObject(newValObject)) valObject = newValObject;
        else break;

        if(i === parts.length - 1) break;

        if(valObject._isLinkedToArray) {
            i++;
            if(!isIndex(parts[i])) return false;
        } else if(valObject.valType === 'info_array') {
            i++;
            var index = parts[i] as number;
            if(!isIndex(index)) return false;

            var items = valObject.items;
            if(Array.isArray(items)) {
                if(index >= items.length) return false;
                if(valObject.dimensions === 2) {
                    i++;
                    if(parts.length === i) return valObject;
                    var index2 = parts[i];
                    if(!isIndex(index2)) return false;
                    valObject = items[index][index2];
                } else valObject = items[index];
            } else {
                valObject = items;
            }
        }
    }

    return valObject;
}

// note: this is different from Lib.isIndex, this one doesn't accept numeric
// strings, only actual numbers.
function isIndex(val: any): boolean {
    return val === Math.round(val) && val >= 0;
}

function getTraceAttributes(type: string): Schema {
    var _module, basePlotModule;

    _module = Registry.modules[type]._module,
    basePlotModule = _module.basePlotModule;

    var attributes: Schema = {};

    // make 'type' the first attribute in the object
    attributes.type = null;

    var copyBaseAttributes = extendDeepAll({}, baseAttributes);
    var copyModuleAttributes = extendDeepAll({}, _module.attributes);

    // prune global-level trace attributes that are already defined in a trace
    exports.crawl(copyModuleAttributes, function(attr, attrName, attrs, level, fullAttrString) {
        nestedProperty(copyBaseAttributes, fullAttrString).set(undefined);
        // Prune undefined attributes
        if(attr === undefined) nestedProperty(copyModuleAttributes, fullAttrString).set(undefined);
    });

    // base attributes (same for all trace types)
    extendDeepAll(attributes, copyBaseAttributes);

    // prune-out base attributes based on trace module categories
    if(Registry.traceIs(type, 'noOpacity')) {
        delete attributes.opacity;
    }
    if(!Registry.traceIs(type, 'showLegend')) {
        delete attributes.showlegend;
        delete attributes.legendgroup;
    }
    if(Registry.traceIs(type, 'noHover')) {
        delete attributes.hoverinfo;
        delete attributes.hoverlabel;
    }
    if(!_module.selectPoints) {
        delete attributes.selectedpoints;
    }

    // module attributes
    extendDeepAll(attributes, copyModuleAttributes);

    // subplot attributes
    if(basePlotModule.attributes) {
        extendDeepAll(attributes, basePlotModule.attributes);
    }

    // 'type' gets overwritten by baseAttributes; reset it here
    attributes.type = type;

    var out: Schema = {
        meta: _module.meta || {},
        categories: _module.categories || {},
        animatable: Boolean(_module.animatable),
        type: type,
        attributes: formatAttributes(attributes),
    };

    // trace-specific layout attributes
    if(_module.layoutAttributes) {
        var layoutAttributes: Schema = {};

        extendDeepAll(layoutAttributes, _module.layoutAttributes);
        out.layoutAttributes = formatAttributes(layoutAttributes);
    }

    // drop anim:true in non-animatable modules
    if(!_module.animatable) {
        exports.crawl(out, function(attr) {
            if(exports.isValObject(attr) && 'anim' in attr) {
                delete attr.anim;
            }
        });
    }

    return out;
}

function getLayoutAttributes(): Schema {
    var layoutAttributes: Schema = {};
    var key, _module;

    // global layout attributes
    extendDeepAll(layoutAttributes, baseLayoutAttributes);

    // add base plot module layout attributes
    for(key in Registry.subplotsRegistry) {
        _module = Registry.subplotsRegistry[key];

        if(!_module.layoutAttributes) continue;

        if(Array.isArray(_module.attr)) {
            for(var i = 0; i < _module.attr.length; i++) {
                handleBasePlotModule(layoutAttributes, _module, _module.attr[i]);
            }
        } else {
            var astr = _module.attr === 'subplot' ? _module.name : _module.attr;
            handleBasePlotModule(layoutAttributes, _module, astr);
        }
    }

    /*
     * xaxis and yaxis are built from the same source object
     * (src/plots/cartesian/layout_attributes.js), which statically composes in
     * rangeslider/rangeselector/calendar attrs that only apply to xaxis, plus
     * shift/autoshift attrs that only apply to yaxis - so it's not possible to
     * only add them to one from the start. Delete them from the other here.
     * If we ever have such asymmetry anywhere else, extend this block too.
     */
    if(layoutAttributes.yaxis) {
        delete layoutAttributes.yaxis.rangeslider;
        delete layoutAttributes.yaxis.rangeselector;
    }
    if(layoutAttributes.xaxis) {
        delete layoutAttributes.xaxis.shift;
        delete layoutAttributes.xaxis.autoshift;
    }

    // add registered components layout attributes
    for(key in Registry.componentsRegistry) {
        _module = Registry.componentsRegistry[key];

        if(STATICALLY_COMPOSED_LAYOUT_COMPONENTS[_module.name]) {
            // these components' layout/subplot attrs are statically composed
            // directly into baseLayoutAttributes / the relevant subplot module's
            // layoutAttributes (see src/plots/layout_attributes.js,
            // src/plots/cartesian/layout_attributes.js,
            // src/plots/gl3d/layout/attributes.js), so they're already present
            // in `layoutAttributes` above - nothing further to merge in here.
            continue;
        } else if(_module.name === 'colorscale') {
            extendDeepAll(layoutAttributes, _module.layoutAttributes);
        } else if(_module.layoutAttributes) {
            // older style without schema need to be explicitly merged in now
            insertAttrs(layoutAttributes, _module.layoutAttributes, _module.name);
        }
    }

    return {
        layoutAttributes: formatAttributes(layoutAttributes)
    };
}

function getFramesAttributes(): Schema {
    var attrs: Schema = {
        frames: extendDeepAll({}, frameAttributes)
    };

    formatAttributes(attrs);

    return attrs.frames;
}

function formatAttributes(attrs: Schema): Schema {
    mergeValTypeAndRole(attrs);
    formatArrayContainers(attrs);
    stringify(attrs);

    return attrs;
}

function mergeValTypeAndRole(attrs: Schema) {
    function makeSrcAttr(attrName: string): Schema {
        return {
            valType: 'string',
            description: 'Sets the source reference on Chart Studio Cloud for `' + attrName + '`.',
            editType: 'none'
        };
    }

    function callback(attr: any, attrName: string, attrs: Schema) {
        if(exports.isValObject(attr)) {
            if(attr.arrayOk === true || attr.valType === 'data_array') {
                // all 'arrayOk' and 'data_array' attrs have a corresponding 'src' attr
                attrs[attrName + 'src'] = makeSrcAttr(attrName);
            }
        } else if(isPlainObject(attr)) {
            // all attrs container objects get role 'object'
            attr.role = 'object';
        }
    }

    exports.crawl(attrs, callback);
}

function formatArrayContainers(attrs: Schema) {
    function callback(attr: any, attrName: string, attrs: Schema) {
        if(!attr) return;

        var itemName = attr[IS_LINKED_TO_ARRAY];

        if(!itemName) return;

        delete attr[IS_LINKED_TO_ARRAY];

        attrs[attrName] = { items: {} };
        attrs[attrName].items[itemName] = attr;
        attrs[attrName].role = 'object';
    }

    exports.crawl(attrs, callback);
}

// this can take around 10ms and should only be run from PlotSchema.get(),
// to ensure JSON.stringify(PlotSchema.get()) gives the intended result.
function stringify(attrs: Schema) {
    function walk(attr: any) {
        for(var k in attr) {
            if(isPlainObject(attr[k])) {
                walk(attr[k]);
            } else if(Array.isArray(attr[k])) {
                for(var i = 0; i < attr[k].length; i++) {
                    walk(attr[k][i]);
                }
            } else {
                // as JSON.stringify(/test/) // => {}
                if(attr[k] instanceof RegExp) {
                    attr[k] = attr[k].toString();
                }
            }
        }
    }

    walk(attrs);
}


function handleBasePlotModule(layoutAttributes: Schema, _module: any, astr: string) {
    var np = nestedProperty(layoutAttributes, astr);
    var attrs = extendDeepAll({}, _module.layoutAttributes);

    attrs[IS_SUBPLOT_OBJ] = true;
    np.set(attrs);
}

function insertAttrs(baseAttrs: Schema, newAttrs: Schema, astr: string) {
    var np = nestedProperty(baseAttrs, astr);

    np.set(extendDeepAll(np.get() || {}, newAttrs));
}
