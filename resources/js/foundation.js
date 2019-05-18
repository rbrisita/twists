
window._ = require('lodash');

try {
    window.$ = window.jQuery = require('jquery');

    require('foundation-sites/dist/js/foundation'); // 'foundation.min' can also be used if you like
} catch (e) {}
