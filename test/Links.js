'use strict';

var assert = require('chai').assert;
var util = require('util');
var Links = require('../').Links;

describe('Links', function () {

    describe('paginate', function () {
        it('should add limit and offset query parameters and include `prev` and `next` links', function () {
            var result = new Links('http://www.example.org/test/12345?limit=3&offset=12').paginate(10).build();
            assert.deepEqual(result, {
                self: { href: '/test/12345?offset=12&limit=3' },
                prev: { href: '/test/12345?offset=9&limit=3' },
                next: { href: '/test/12345?offset=15&limit=3' }
            });
        });

        it('should exclude `prev` link when `offset = 0`', function () {
            var result = new Links('http://www.example.org/test/12345?limit=3&offset=0').paginate(10, 4).build();
            assert.deepEqual(result, {
                self: { href: '/test/12345?offset=0&limit=3' },
                next: { href: '/test/12345?offset=3&limit=3' }
            });
        });

        it('should exclude `next` link when `total <= offset + limit`', function () {
            var result = new Links('http://www.example.org/test/12345?limit=3&offset=0').paginate(10, 3).build();
            assert.deepEqual(result, {
                self: { href: '/test/12345?offset=0&limit=3' }
            });
        });

        it('should default to defined limit', function () {
            var result = new Links('http://www.example.org/test/12345').paginate(10).build();
            assert.deepEqual(result, {
                self: { href: '/test/12345?offset=0&limit=10' },
                next: { href: '/test/12345?offset=10&limit=10' }
            });
        });

        it('should throw error when default limit is NaN', function () {
            try {
                new Links('http://www.example.org/test/12345').paginate('test').build();
                assert.fail('Epxected exception');
            } catch (err) {
                assert.equal(err.message, 'Parameter `defaultLimit` is not a valid number');
            }
        });

        it('should throw error when default limit is NaN', function () {
            try {
                new Links('http://www.example.org/test/12345').paginate(10, 'test').build();
                assert.fail('Expected exception');
            } catch (err) {
                assert.equal(err.message, 'Parameter `total` is not a valid number');
            }
        });
    });

    describe('param', function () {
        it('should add query parameter in the url', function () {
            var result = new Links('http://www.example.org/test/12345?limit=3&offset=2&test&test2=3').paginate(10).build();
            assert.deepEqual(result, {
                self: { href: '/test/12345?offset=2&limit=3&test&test2=3' },
                prev: { href: '/test/12345?offset=0&limit=3&test&test2=3' },
                next: { href: '/test/12345?offset=5&limit=3&test&test2=3' }
            });
        });

        it('should add a query parameter to paginated url', function () {
            var result = new Links('http://www.example.org/test/12345').setParam('test').setParam('test2', 3).build();
            assert.deepEqual(result, {
                self: { href: '/test/12345?test&test2=3' }
            });
        });

        it('should add a query parameter to paginated url', function () {
            var result = new Links('http://www.example.org/test/12345').setParam('test').setParam('test2', 3).build();
            assert.deepEqual(result, {
                self: { href: '/test/12345?test&test2=3' }
            });
        });
    });
});
