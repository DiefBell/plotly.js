'use strict';

var helpers = require('./helpers');

module.exports = {
    moduleType: 'component',
    name: 'rangeslider',

    layoutAttributes: require('./attributes'),
    handleDefaults: require('./defaults'),
    calcAutorange: require('./calc_autorange'),
    draw: require('./draw'),
    isVisible: helpers.isVisible,
    makeData: helpers.makeData,
    autoMarginOpts: helpers.autoMarginOpts
};
