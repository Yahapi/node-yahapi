'use strict';

var errors = require('./lib/RestErrors.js');
var LinksBuilder = require('./lib/LinksBuilder.js');
var Collection = require('./lib/Collection.js');

// Expose all errors directly in the module export
for (var property in errors) {
    module.exports[property] = errors[property];
}

module.exports.LinksBuilder = LinksBuilder
module.exports.Collection = Collection;
