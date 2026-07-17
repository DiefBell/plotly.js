'use strict';

var counterRegex = require('../../lib/regex').counter;
var domainAttrs = require('../../plots/domain').attributes;
var cartesianIdRegex = require('../../plots/cartesian/constants').idRegex;

module.exports = {
    rows: {
        valType: 'integer',
        min: 1,
        editType: 'plot',
        description: [
            'The number of rows in the grid. If you provide a 2D `subplots`',
            'array or a `yaxes` array, its length is used as the default.',
            'But it\'s also possible to have a different length, if you',
            'want to leave a row at the end for non-cartesian subplots.'
        ].join(' ')
    },
    roworder: {
        valType: 'enumerated',
        values: ['top to bottom', 'bottom to top'],
        dflt: 'top to bottom',
        editType: 'plot',
        description: [
            'Is the first row the top or the bottom? Note that columns',
            'are always enumerated from left to right.'
        ].join(' ')
    },
    columns: {
        valType: 'integer',
        min: 1,
        editType: 'plot',
        description: [
            'The number of columns in the grid. If you provide a 2D `subplots`',
            'array, the length of its longest row is used as the default.',
            'If you give an `xaxes` array, its length is used as the default.',
            'But it\'s also possible to have a different length, if you',
            'want to leave a row at the end for non-cartesian subplots.'
        ].join(' ')
    },
    subplots: {
        valType: 'info_array',
        freeLength: true,
        dimensions: 2,
        items: {valType: 'enumerated', values: [counterRegex('xy').toString(), ''], editType: 'plot'},
        editType: 'plot',
        description: [
            'Used for freeform grids, where some axes may be shared across subplots',
            'but others are not. Each entry should be a cartesian subplot id, like',
            '*xy* or *x3y2*, or ** to leave that cell empty. You may reuse x axes',
            'within the same column, and y axes within the same row.',
            'Non-cartesian subplots and traces that support `domain` can place themselves',
            'in this grid separately using the `gridcell` attribute.'
        ].join(' ')
    },
    xaxes: {
        valType: 'info_array',
        freeLength: true,
        items: {valType: 'enumerated', values: [cartesianIdRegex.x.toString(), ''], editType: 'plot'},
        editType: 'plot',
        description: [
            'Used with `yaxes` when the x and y axes are shared across columns and rows.',
            'Each entry should be an x axis id like *x*, *x2*, etc., or ** to',
            'not put an x axis in that column. Entries other than ** must be unique.',
            'Ignored if `subplots` is present. If missing but `yaxes` is present,',
            'will generate consecutive IDs.'
        ].join(' ')
    },
    yaxes: {
        valType: 'info_array',
        freeLength: true,
        items: {valType: 'enumerated', values: [cartesianIdRegex.y.toString(), ''], editType: 'plot'},
        editType: 'plot',
        description: [
            'Used with `yaxes` when the x and y axes are shared across columns and rows.',
            'Each entry should be an y axis id like *y*, *y2*, etc., or ** to',
            'not put a y axis in that row. Entries other than ** must be unique.',
            'Ignored if `subplots` is present. If missing but `xaxes` is present,',
            'will generate consecutive IDs.'
        ].join(' ')
    },
    pattern: {
        valType: 'enumerated',
        values: ['independent', 'coupled'],
        dflt: 'coupled',
        editType: 'plot',
        description: [
            'If no `subplots`, `xaxes`, or `yaxes` are given but we do have `rows` and `columns`,',
            'we can generate defaults using consecutive axis IDs, in two ways:',
            '*coupled* gives one x axis per column and one y axis per row.',
            '*independent* uses a new xy pair for each cell, left-to-right across each row',
            'then iterating rows according to `roworder`.'
        ].join(' ')
    },
    xgap: {
        valType: 'number',
        min: 0,
        max: 1,
        editType: 'plot',
        description: [
            'Horizontal space between grid cells, expressed as a fraction',
            'of the total width available to one cell. Defaults to 0.1',
            'for coupled-axes grids and 0.2 for independent grids.'
        ].join(' ')
    },
    ygap: {
        valType: 'number',
        min: 0,
        max: 1,
        editType: 'plot',
        description: [
            'Vertical space between grid cells, expressed as a fraction',
            'of the total height available to one cell. Defaults to 0.1',
            'for coupled-axes grids and 0.3 for independent grids.'
        ].join(' ')
    },
    domain: domainAttrs({name: 'grid', editType: 'plot', noGridCell: true}, {
        description: [
            'The first and last cells end exactly at the domain',
            'edges, with no grout around the edges.'
        ].join(' ')
    }),
    xside: {
        valType: 'enumerated',
        values: ['bottom', 'bottom plot', 'top plot', 'top'],
        dflt: 'bottom plot',
        editType: 'plot',
        description: [
            'Sets where the x axis labels and titles go. *bottom* means',
            'the very bottom of the grid. *bottom plot* is the lowest plot',
            'that each x axis is used in. *top* and *top plot* are similar.'
        ].join(' ')
    },
    yside: {
        valType: 'enumerated',
        values: ['left', 'left plot', 'right plot', 'right'],
        dflt: 'left plot',
        editType: 'plot',
        description: [
            'Sets where the y axis labels and titles go. *left* means',
            'the very left edge of the grid. *left plot* is the leftmost plot',
            'that each y axis is used in. *right* and *right plot* are similar.'
        ].join(' ')
    },
    editType: 'plot'
};
