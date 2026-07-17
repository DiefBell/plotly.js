'use strict';

var Lib = require('../../lib');
var Template = require('../../plot_api/plot_template');

var gridAttrs = require('./attributes');

function getAxes(layout, grid, axLetter) {
    var gridVal = grid[axLetter + 'axes'];
    var splomVal = Object.keys((layout._splomAxes || {})[axLetter] || {});

    if(Array.isArray(gridVal)) return gridVal;
    if(splomVal.length) return splomVal;
}

// the shape of the grid - this needs to be done BEFORE supplyDataDefaults
// so that non-subplot traces can place themselves in the grid
function sizeDefaults(layoutIn, layoutOut) {
    var gridIn = layoutIn.grid || {};
    var xAxes = getAxes(layoutOut, gridIn, 'x');
    var yAxes = getAxes(layoutOut, gridIn, 'y');

    if(!layoutIn.grid && !xAxes && !yAxes) return;

    var hasSubplotGrid = Array.isArray(gridIn.subplots) && Array.isArray(gridIn.subplots[0]);
    var hasXaxes = Array.isArray(xAxes);
    var hasYaxes = Array.isArray(yAxes);
    var isSplomGenerated = (
        hasXaxes && xAxes !== gridIn.xaxes &&
        hasYaxes && yAxes !== gridIn.yaxes
    );

    var dfltRows, dfltColumns;

    if(hasSubplotGrid) {
        dfltRows = gridIn.subplots.length;
        dfltColumns = gridIn.subplots[0].length;
    } else {
        if(hasYaxes) dfltRows = yAxes.length;
        if(hasXaxes) dfltColumns = xAxes.length;
    }

    var gridOut = Template.newContainer(layoutOut, 'grid');

    function coerce(attr, dflt) {
        return Lib.coerce(gridIn, gridOut, gridAttrs, attr, dflt);
    }

    var rows = coerce('rows', dfltRows);
    var columns = coerce('columns', dfltColumns);

    if(!(rows * columns > 1)) {
        delete layoutOut.grid;
        return;
    }

    if(!hasSubplotGrid && !hasXaxes && !hasYaxes) {
        var useDefaultSubplots = coerce('pattern') === 'independent';
        if(useDefaultSubplots) hasSubplotGrid = true;
    }
    gridOut._hasSubplotGrid = hasSubplotGrid;

    var rowOrder = coerce('roworder');
    var reversed = rowOrder === 'top to bottom';

    var dfltGapX = hasSubplotGrid ? 0.2 : 0.1;
    var dfltGapY = hasSubplotGrid ? 0.3 : 0.1;

    var dfltSideX, dfltSideY;
    if(isSplomGenerated && layoutOut._splomGridDflt) {
        dfltSideX = layoutOut._splomGridDflt.xside;
        dfltSideY = layoutOut._splomGridDflt.yside;
    }

    gridOut._domains = {
        x: fillGridPositions('x', coerce, dfltGapX, dfltSideX, columns),
        y: fillGridPositions('y', coerce, dfltGapY, dfltSideY, rows, reversed)
    };
}

// coerce x or y sizing attributes and return an array of domains for this direction
function fillGridPositions(axLetter, coerce, dfltGap, dfltSide, len, reversed) {
    var dirGap = coerce(axLetter + 'gap', dfltGap);
    var domain = coerce('domain.' + axLetter);
    coerce(axLetter + 'side', dfltSide);

    var out = new Array(len);
    var start = domain[0];
    var step = (domain[1] - start) / (len - dirGap);
    var cellDomain = step * (1 - dirGap);
    for(var i = 0; i < len; i++) {
        var cellStart = start + step * i;
        out[reversed ? (len - 1 - i) : i] = [cellStart, cellStart + cellDomain];
    }
    return out;
}

// the (cartesian) contents of the grid - this needs to happen AFTER supplyDataDefaults
// so that we know what cartesian subplots are available
function contentDefaults(layoutIn, layoutOut) {
    var gridOut = layoutOut.grid;
    // make sure we got to the end of handleGridSizing
    if(!gridOut || !gridOut._domains) return;

    var gridIn = layoutIn.grid || {};
    var subplots = layoutOut._subplots;
    var hasSubplotGrid = gridOut._hasSubplotGrid;
    var rows = gridOut.rows;
    var columns = gridOut.columns;
    var useDefaultSubplots = gridOut.pattern === 'independent';

    var i, j, xId, yId, subplotId, subplotsOut, yPos;

    var axisMap = gridOut._axisMap = {};

    if(hasSubplotGrid) {
        var subplotsIn = gridIn.subplots || [];
        subplotsOut = gridOut.subplots = new Array(rows);
        var index = 1;

        for(i = 0; i < rows; i++) {
            var rowOut = subplotsOut[i] = new Array(columns);
            var rowIn = subplotsIn[i] || [];
            for(j = 0; j < columns; j++) {
                if(useDefaultSubplots) {
                    subplotId = (index === 1) ? 'xy' : ('x' + index + 'y' + index);
                    index++;
                } else subplotId = rowIn[j];

                rowOut[j] = '';

                if(subplots.cartesian.indexOf(subplotId) !== -1) {
                    yPos = subplotId.indexOf('y');
                    xId = subplotId.slice(0, yPos);
                    yId = subplotId.slice(yPos);
                    if((axisMap[xId] !== undefined && axisMap[xId] !== j) ||
                        (axisMap[yId] !== undefined && axisMap[yId] !== i)
                    ) {
                        continue;
                    }

                    rowOut[j] = subplotId;
                    axisMap[xId] = j;
                    axisMap[yId] = i;
                }
            }
        }
    } else {
        var xAxes = getAxes(layoutOut, gridIn, 'x');
        var yAxes = getAxes(layoutOut, gridIn, 'y');
        gridOut.xaxes = fillGridAxes(xAxes, subplots.xaxis, columns, axisMap, 'x');
        gridOut.yaxes = fillGridAxes(yAxes, subplots.yaxis, rows, axisMap, 'y');
    }

    var anchors = gridOut._anchors = {};
    var reversed = gridOut.roworder === 'top to bottom';

    for(var axisId in axisMap) {
        var axLetter = axisId.charAt(0);
        var side = gridOut[axLetter + 'side'];

        var i0, inc, iFinal;

        if(side.length < 8) {
            // grid edge -  ie not "* plot" - make these as free axes
            // since we're not guaranteed to have a subplot there at all
            anchors[axisId] = 'free';
        } else if(axLetter === 'x') {
            if((side.charAt(0) === 't') === reversed) {
                i0 = 0;
                inc = 1;
                iFinal = rows;
            } else {
                i0 = rows - 1;
                inc = -1;
                iFinal = -1;
            }
            if(hasSubplotGrid) {
                var column = axisMap[axisId];
                for(i = i0; i !== iFinal; i += inc) {
                    subplotId = subplotsOut[i][column];
                    if(!subplotId) continue;
                    yPos = subplotId.indexOf('y');
                    if(subplotId.slice(0, yPos) === axisId) {
                        anchors[axisId] = subplotId.slice(yPos);
                        break;
                    }
                }
            } else {
                for(i = i0; i !== iFinal; i += inc) {
                    yId = gridOut.yaxes[i];
                    if(subplots.cartesian.indexOf(axisId + yId) !== -1) {
                        anchors[axisId] = yId;
                        break;
                    }
                }
            }
        } else {
            if((side.charAt(0) === 'l')) {
                i0 = 0;
                inc = 1;
                iFinal = columns;
            } else {
                i0 = columns - 1;
                inc = -1;
                iFinal = -1;
            }
            if(hasSubplotGrid) {
                var row = axisMap[axisId];
                for(i = i0; i !== iFinal; i += inc) {
                    subplotId = subplotsOut[row][i];
                    if(!subplotId) continue;
                    yPos = subplotId.indexOf('y');
                    if(subplotId.slice(yPos) === axisId) {
                        anchors[axisId] = subplotId.slice(0, yPos);
                        break;
                    }
                }
            } else {
                for(i = i0; i !== iFinal; i += inc) {
                    xId = gridOut.xaxes[i];
                    if(subplots.cartesian.indexOf(xId + axisId) !== -1) {
                        anchors[axisId] = xId;
                        break;
                    }
                }
            }
        }
    }
}

function fillGridAxes(axesIn, axesAllowed, len, axisMap, axLetter) {
    var out = new Array(len);
    var i;

    function fillOneAxis(i, axisId) {
        if(axesAllowed.indexOf(axisId) !== -1 && axisMap[axisId] === undefined) {
            out[i] = axisId;
            axisMap[axisId] = i;
        } else out[i] = '';
    }

    if(Array.isArray(axesIn)) {
        for(i = 0; i < len; i++) {
            fillOneAxis(i, axesIn[i]);
        }
    } else {
        // default axis list is the first `len` axis ids
        fillOneAxis(0, axLetter);
        for(i = 1; i < len; i++) {
            fillOneAxis(i, axLetter + (i + 1));
        }
    }

    return out;
}

module.exports = {
    moduleType: 'component',
    name: 'grid',

    layoutAttributes: gridAttrs,
    sizeDefaults: sizeDefaults,
    contentDefaults: contentDefaults
};
