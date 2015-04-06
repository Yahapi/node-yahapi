'use strict';

var RestErrors = require('./lib/RestErrors.js');
var Links = require('./lib/Links.js');
var Collection = require('./lib/Collection.js');

// Expose all errors directly in the module export
for (var property in RestErrors) {
    module.exports[property] = RestErrors[property];
}

module.exports.Links = Links;
module.exports.Collection = Collection;
