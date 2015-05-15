'use strict';

var assert = require('chai').assert;
var util = require('util');
var Collection = require('../').Collection;

describe('Collection', function () {

    var items = [];

    beforeEach(function() {
        for (var i = 0; i < 10; i++) {
            items.push({ num: i });
        }
    });

    describe('links', function() {
        // TODO should add links with query parameters inherited from base url
    });

    describe('paginate', function () {

        // TODO check for metadata

        it('should add limit and offset query parameters and include `prev` and `next` links', function () {
            var result = new Collection('http://www.example.org/test/12345?limit=3&offset=12', items).paginate(10).build();
            assert.deepEqual(result.links, {
                self: { href: 'http://www.example.org/test/12345?limit=3&offset=12' },
                previous: { href: 'http://www.example.org/test/12345?limit=3&offset=9' },
                next: { href: 'http://www.example.org/test/12345?limit=3&offset=15' },
                first: { href: 'http://www.example.org/test/12345?limit=3&offset=0' }
            });
        });

        it('should exclude `prev` link when `offset = 0`', function () {
            var result = new Collection('http://www.example.org/test/12345?limit=3&offset=0').paginate(10, 4).build();
            assert.deepEqual(result.links, {
                self: { href: 'http://www.example.org/test/12345?limit=3&offset=0' },
                next: { href: 'http://www.example.org/test/12345?limit=3&offset=3' },
                first: { href: 'http://www.example.org/test/12345?limit=3&offset=0' },
                last: { href: 'http://www.example.org/test/12345?limit=3&offset=3' }
            });
        });

        it('should exclude `next` link when `total <= offset + limit`', function () {
            var result = new Collection('http://www.example.org/test/12345?limit=3&offset=0').paginate(10, 3).build();
            assert.deepEqual(result.links, {
                first: { href: 'http://www.example.org/test/12345?limit=3&offset=0' },
                last: { href: 'http://www.example.org/test/12345?limit=3&offset=3' },
                self: { href: 'http://www.example.org/test/12345?limit=3&offset=0' }
            });
        });

        it('should default to defined limit', function () {
            var result = new Collection('http://www.example.org/test/12345').paginate(10).build();
            assert.deepEqual(result.links, {
                first: { href: 'http://www.example.org/test/12345?offset=0&limit=10' },
                self: { href: 'http://www.example.org/test/12345' },
                next: { href: 'http://www.example.org/test/12345?offset=10&limit=10' }
            });
        });

        it('should throw error when default limit is NaN', function () {
            try {
                new Collection('http://www.example.org/test/12345').paginate('test').build();
                assert.fail('Epxected exception');
            } catch (err) {
                assert.equal(err.message, 'Parameter `defaultLimit` is not a valid number');
            }
        });

        it('should throw error when default limit is NaN', function () {
            try {
                new Collection('http://www.example.org/test/12345').paginate(10, 'test').build();
                assert.fail('Expected exception');
            } catch (err) {
                assert.equal(err.message, 'Parameter `total` is not a valid number');
            }
        });
    });
});
