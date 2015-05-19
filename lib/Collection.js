/**
* @file This module builds a collection resource representation with links,
* metadata and items.
* @author Niels Krijger
*/

'use strict';

var url = require('url');
var util = require('util');
var _ = require('lodash');
var Links = require('./Links');

/**
 * Creates a new Collection builder.
 *
 * @param {String} requestUrl The request url.
 * @param {Object[]} items Array of item objects.
 */
function Collection(requestUrl, items) {
    this.requestUrl = requestUrl;
    this.items = items || null;
    this.transformFunction = null;
    this.isPaginated = false; // Set to true when pagination is enabled
    this.offset = null;
    this.limit = null;
    this.total = null;
    this.metadata = null;
    this.defaultLimit = null;
    this.links = {}; // Custom links
    this._parseUrl(requestUrl);
}

module.exports = Collection;

/**
 * Set an item transformation function if you require items to be modified
 * upon representation.
 *
 * @param {Function} transformFunction
 */
Collection.prototype.transform = function (transformFunction) {
    this.transformFunction = transformFunction;
    return this;
};

/**
 * Sets the default page limit when paginating. Calling this enables 'prev' and 'next' pagination links and will
 * use 'limit' and 'offset' query parameters to create pagination links.
 *
 * @param {int} defaultLimit The default maximum number of results per page.
 * @param {int} [total] The max number of results in the collection. When
 * defined the collection will add `next` and `last` links.
 * @return {Collection}
 */
Collection.prototype.paginate = function(defaultLimit, total) {
    this.isPaginated = true;
    if (isNaN(defaultLimit)) {
        throw new Error('Parameter `defaultLimit` is not a valid number');
    }
    if (total !== undefined && total !== null && isNaN(total)) {
        throw new Error('Parameter `total` is not a valid number');
    }
    this.defaultLimit = defaultLimit;
    if (this.limit === null) {
        this.limit = this.defaultLimit;
    }
    this.total = total;
    return this;
};

/**
 * Adds custom metadata to the resource representation.
 *
 * @param {Object} obj Object that is merged to the current meta representation.
 * @return {Collection}
 */
Collection.prototype.meta = function(obj) {
    if (this.metadata === null) {
        this.metadata = {};
    }
    this.metadata = _.merge(this.metadata, obj);
    return this;
};

/**
 * Adds a custom link to the links property.
 *
 * @param {String} relation The link relationship (or rel).
 * @param {...} A list of arguments passed to `links.add`.
 */
Collection.prototype.link = function(relation) {
    this.links[relation] = Array.prototype.slice.call(arguments);
    return this;
};

/**
 * Builds a collection representation.
 *
 * @return {Object} A representation of the collection resource.
 */
Collection.prototype.build = function() {
    var representation = {};

    // Add metadata to representation
    this._addMetadata(representation);

    // Add items to representation
    this._addItems(representation);

    // Add links to representation
    this._addLinks(representation);

    return representation;
};

/**
 * Extracts the limit and offset from the request url.
 *
 * @param {String} requestUrl The request url.
 */
Collection.prototype._parseUrl = function(requestUrl) {
    var parsedUrl = url.parse(requestUrl, true);
    if (parsedUrl.query !== null) {

        // Set limit extracted from url or `null` if not found
        var parsedLimit = parseInt(parsedUrl.query.limit);
        this.limit = (!isNaN(parsedLimit)) ? parsedLimit : null;

        // Set offset extracted from url or `0` if not found
        var parsedOffset = parseInt(parsedUrl.query.offset);
        this.offset = (!isNaN(parsedOffset)) ? parsedOffset : 0;
    }
};

/**
 * Adds metadata to the representation.
 *
 * @param {Object} representation The collection representation.
 */
Collection.prototype._addMetadata = function(representation) {
    var metadata = {};
    if (this.isPaginated) {
        if (this.total !== null) {
            metadata.total = this.total;
        }
        if (this.items !== null) {
            metadata.size = this.items.length;
        }
        if (this.offset !== null) {
            metadata.offset = this.offset;
        }
        if (this.limit !== null) {
            metadata.limit = this.limit;
        }
    }
    if (this.metadata !== null) {
        metadata = _.merge(metadata, this.metadata);
    }
    if (Object.keys(metadata).length > 0) {
        representation.meta = metadata;
    }
};

/**
 * Adds items to the respresentation.
 *
 * @param {Object} representation The collection representation.
 */
Collection.prototype._addItems = function(representation) {
    representation.items = [];
    if (this.transformFunction) {
        // If representation function is set parse each item
        representation.items = _.map(this.items, this.transformFunction);
        // this.items.forEach(function(elm, index) {
        //     representation.items.push(this.transformFunction(elm));
        // }.bind(this));
    } else {
        // If no representation function is set just add the items plain
        representation.items = this.items;
    }
};

/**
 * Adds links to the representation.
 *
 * @param {Object} representation The collection representation.
 */
Collection.prototype._addLinks = function(representation) {
    var links = new Links(this.requestUrl);

    // Set pagination links
    if (this.isPaginated) {
        // Show `prev` link when there are previous results
        if (this.offset > 0) {
            var offset = (this.offset - this.limit > 0) ? (this.offset - this.limit) : 0;
            links.add('previous', {
                offset: offset
            });
        }

        // Show `next` link when there are more results available
        if (this.total === undefined || this.total === null || this.total > this.offset + this.limit) {
            links.add('next', { offset: (this.offset + this.limit), limit: this.limit });
        }

        // Always set `first` link
        links.add('first', { offset: 0, limit: this.limit });

        // Show `last` link if total number of elements is known
        if (this.total !== undefined && this.total !== null) {
            links.add('last', {
                offset: Math.floor(this.total / this.limit) * this.limit,
                limit: this.limit
            });
        }
    }

    // Add custom links
    _.forIn(this.links, function(args) {
        links.add.apply(links, args);
    });

    // Add query parameters to all links
    /*
    for (var property in this._queryParams) {
        if ((isPaginated && (property == 'limit' || property == 'offset')) || !this._queryParams.hasOwnProperty(property)) {
            continue; // continue when link is a pagination link or the property is inherited
        }
        for (var link in result) {
            if (result.hasOwnProperty(link)) {
                result[link].href += (params === 0) ? '?' : '&';
                if (this._queryParams[property]) {
                    result[link].href += property + '=' + this._queryParams[property];
                } else {
                    result[link].href += property;
                }
            }
        }
        params++;
    }
    */
    representation.links = links.get();
};
