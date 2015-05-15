/**
 * @file This module builds a set of hypermedia links for resource representations.
 * Resource links are useful for API discoverability and may simplify client
 * implementation.
 * @author Niels Krijger
 */

'use strict';

var _ = require('lodash');
var url = require('url');
var util = require('util');

/**
 * Creates a new Links builder.
 *
 * @param {String} requestUrl The current request url.
 */
function Links(requestUrl) {
    this.requestUrl = requestUrl;
    this.links = {
        self: {
            href: url.format(this.requestUrl)
        }
    };
}

module.exports = Links;

/**
 * Adds a new link.
 *
 * Each link has a relation or link 'name' that is a semantic description of the link.
 * A relation should only contain the following characters: [a-Z0-9_]
 *
 * @param {String} relation The relation.
 */
Links.prototype.add = function(relation) {
    // Do NOT slice arguments, see also:
    // http://stackoverflow.com/questions/23509312/does-node-js-really-not-optimize-calls-to-slice-callarguments
    var queryParams = {};
    var paths = [];
    var resolves = [];
    var newUrl = this.requestUrl;
    for (var i = 1; i < arguments.length; i++) {
        if (arguments[i] === null) {
            continue;
        }
        if (typeof arguments[i] === 'object') {
            queryParams = _.merge(queryParams, arguments[i]);
        } else if (_.isString(arguments[i])) {
            if (arguments[i].indexOf('http') === 0) {
                newUrl = arguments[i];
            } else if (_.isString(arguments[i]) && arguments[i].indexOf('/') === 0) {
                resolves.push(arguments[i]);
            } else if (_.isString(arguments[i])) {
                paths.push(arguments[i]);
            }
        }
    }
    this.links[relation] = {
        href: this._assembleUrl(newUrl, resolves, paths, queryParams)
    };
    return this;
};

/**
 * Assembles a new url using a base url, any '/resolve'-type paths, basic paths
 * and query parameters.
 */
Links.prototype._assembleUrl = function(newUrl, resolves, paths, queryParams) {
    var pieces = newUrl.split('?');
    newUrl = pieces[0];
    var queryParamString = (pieces[1] !== undefined) ? pieces[1] : null;

    // Resolve like browser
    resolves.forEach(function(path) {
        newUrl = url.resolve(newUrl, path);
    });

    // When resolving paths it is highly unlikely query parameters should be kept
    if (resolves.length > 0) {
        queryParamString = null;
    }

    // Append paths
    paths.forEach(function(path) {
        newUrl += '/' + path;
    });

    // Overwrite any existing params in the url
    var params = _.merge(this._parseQueryParams(queryParamString), queryParams);

    // Append search parameter object to the url
    if (newUrl.indexOf('?') !== -1) {
        newUrl = newUrl.substr(0, newUrl.indexOf('?'));
    }
    var keys = Object.keys(params);
    if (keys.length > 0) {
        newUrl += '?';
        for (var i = 0; i < keys.length; i++) {
            if (i > 0) {
                newUrl += '&';
            }
            newUrl += keys[i] + '=' + encodeURIComponent(params[keys[i]]);
        }
    }
    return newUrl;
};

/**
 * Takes a string like '?search=a=b' and creates an object like { a: 'b' }
 */
Links.prototype._parseQueryParams = function(queryParamString) {
    if (queryParamString === null || queryParamString === undefined) {
        return {};
    }
    var result = {};
    if (queryParamString.slice(0, 1) == '?') {
        queryParamString = queryParamString.slice(1);
    }
    var params = queryParamString.split('&');
    params.forEach(function(param) {
        var pieces = param.split('=');
        result[pieces[0]] = (pieces[1] !== undefined) ? pieces[1] : '';
    });
    return result;
};

/**
 * Returns an object with resource links.
 *
 * @return {Object} An object with links to the current and related resources.
 */
Links.prototype.get = function() {
    return this.links;
};
