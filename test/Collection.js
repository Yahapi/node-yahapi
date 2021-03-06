'use strict';

var assert = require('chai').assert;
var util = require('util');
var Collection = require('../').Collection;

describe('Collection', function () {

    var items = null;

    beforeEach(function() {
        items = [];
        for (var i = 0; i < 5; i++) {
            items.push({ num: i });
        }
    });

    describe('items', function() {
        it('should transform items', function() {
            var func = function(elm) {
                return { num: elm.num * 2 };
            };
            var result = new Collection('http://www.example.org/test/12345?limit=3&offset=12', items).transform(func).build();
            assert.deepEqual(result.items, [
                { num: 0 }, { num: 2 }, { num: 4 }, { num: 6 }, { num: 8 }
            ]);
        });
    });

    describe('links', function() {
        it('should add custom link', function() {
            var collection = new Collection('http://www.example.org/test/12345?limit=3&offset=12', items);
            collection.link('rel1', 'http://www.1.org');
            var result = collection.link('rel2', 'http://www.2.org', { test: 1 }).link('rel2', 'http://www.3.org').build();
            assert.deepEqual(result.links, {
                rel1: { href: 'http://www.1.org' },
                rel2: { href: 'http://www.3.org' },
                self: { href: 'http://www.example.org/test/12345?limit=3&offset=12' }
            });
        });

        it('should add custom link to paginated collection', function() {
            var collection = new Collection('http://www.example.org/test/12345?limit=3&offset=12', items).paginate(10, 4);
            collection.link('rel1', 'http://www.1.org');
            var result = collection.link('rel2', 'http://www.2.org', { test: 1 }).link('rel2', 'http://www.3.org').build();
            assert.deepEqual(result.links, {
                self: { href: 'http://www.example.org/test/12345?limit=3&offset=12' },
                prev: { href: 'http://www.example.org/test/12345?limit=3&offset=9' },
                first: { href: 'http://www.example.org/test/12345?limit=3&offset=0' },
                last: { href: 'http://www.example.org/test/12345?limit=3&offset=3' },
                rel1: { href: 'http://www.1.org' },
                rel2: { href: 'http://www.3.org' }
            });
        });
    });

    describe('metadata', function() {
        it('should add pagination metadata', function () {
            var result = new Collection('http://www.example.org/test/12345?limit=3&offset=12', items).paginate(10, 320).build();
            assert.deepEqual(result.meta, {
                limit: 3,
                offset: 12,
                size: 5,
                total: 320
            });
        });

        it('should add custom metadata', function () {
            var collection = new Collection('http://www.example.org/test/12345?limit=3&offset=12', items);
            var result = collection.meta({ elm1: 'var1', elm2: { elm3: 3 } }).meta({ elm4: 4 }).build();
            assert.deepEqual(result.meta, {
                elm1: 'var1',
                elm2: { elm3: 3 },
                elm4: 4
            });
        });

        it('should combine pagination and custom metadata', function () {
            var collection = new Collection('http://www.example.org/test/12345?limit=3&offset=0', items).paginate(10, 3);
            var result = collection.meta({ elm1: 'var1', elm2: { elm3: 3 } }).meta({ elm4: 4 }).build();
            assert.deepEqual(result.meta, {
                elm1: 'var1',
                elm2: { elm3: 3 },
                elm4: 4,
                limit: 3,
                offset: 0,
                size: 5,
                total: 3
            });
        });
    });

    describe('paginate', function () {
        it('should add limit and offset query parameters and include `prev` and `next` links', function () {
            var result = new Collection('http://www.example.org/test/12345?limit=3&offset=12', items).paginate(10).build();
            assert.deepEqual(result.links, {
                self: { href: 'http://www.example.org/test/12345?limit=3&offset=12' },
                prev: { href: 'http://www.example.org/test/12345?limit=3&offset=9' },
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
