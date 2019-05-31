'use strict';

/**
 * Default config looked for by webpack and webpack-dev-server.
 */

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./webpack/webpack.prod');
} else {
    module.exports = require('./webpack/webpack.dev');
}
