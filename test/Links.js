'use strict';

var assert = require('chai').assert;
var util = require('util');
var Links = require('../').Links;

describe('Links', function () {

    var links = null;

    beforeEach(function() {
        links = new Links('http://www.example.org/test?a=1&b=2');
    });

    it('should add extra query parameter to the url', function () {
        links.add('one', { c: '3' });
        links.add('two', { b: '-2' });
        links.add('three', { b: '-2' }, { b: '4', c: '3' });
        assert.deepEqual(links.get(), {
            self: { href: 'http://www.example.org/test?a=1&b=2' },
            one: { href: 'http://www.example.org/test?a=1&b=2&c=3' },
            two: { href: 'http://www.example.org/test?a=1&b=-2' },
            three: { href: 'http://www.example.org/test?a=1&b=4&c=3' }
        });
    });

    it('should override an entire url with any argument starting with http', function () {
        links.add('one', 'http://test1.org');
        links.add('two', 'http://test2.org/param?param=1', { param2: 2 });
        links.add('three', 'http://test3.org/param', 'http://override.org');
        links.add('four', 'http://test4.org:3000');
        assert.deepEqual(links.get(), {
            self: { href: 'http://www.example.org/test?a=1&b=2' },
            one: { href: 'http://test1.org' },
            two: { href: 'http://test2.org/param?param=1&param2=2' },
            three: { href: 'http://override.org' },
            four: { href: 'http://test4.org:3000' }
        });
    });

    it('should resolve paths starting with "/"', function () {
        links.add('one', '/test');
        links.add('two', '/overwrite/this', '/override');
        assert.deepEqual(links.get(), {
            self: { href: 'http://www.example.org/test?a=1&b=2' },
            one: { href: 'http://www.example.org/test' },
            two: { href: 'http://www.example.org/override' }
        });
    });

    it('should append paths which do not start with a "/"', function () {
        links.add('one', 'test2');
        links.add('two', 'append/this', 'and/this');
        assert.deepEqual(links.get(), {
            self: { href: 'http://www.example.org/test?a=1&b=2' },
            one: { href: 'http://www.example.org/test/test2?a=1&b=2' },
            two: { href: 'http://www.example.org/test/append/this/and/this?a=1&b=2' }
        });
    });

    it('should prioritize arguments as follows 1) full url, 2) resolve paths, 3) append paths and 4) query parameters', function () {
        links.add('one', 'http://www.example2.org', '/path1', 'path2', { p: 1 });
        links.add('two', { p: 1 }, 'path2', '/path1', 'http://www.example2.org');
        assert.deepEqual(links.get(), {
            self: { href: 'http://www.example.org/test?a=1&b=2' },
            one: { href: 'http://www.example2.org/path1/path2?p=1' },
            two: { href: 'http://www.example2.org/path1/path2?p=1' }
        });
    });
});
