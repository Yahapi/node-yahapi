'use strict';

var assert = require('chai').assert;
var util = require('util');

var BadRequestError = require('../index').BadRequestError;
var ValidationError = require('../index').ValidationError;
var UnauthorizedError = require('../index').UnauthorizedError;
var ForbiddenError = require('../index').ForbiddenError;
var ResourceNotFoundError = require('../index').ResourceNotFoundError;
var ResourceExistsError = require('../index').ResourceExistsError;
var DatabaseError = require('../index').DatabaseError;
var AssertError = require('../index').AssertError;

describe('RestErrors', function() {

    it('should return a valid BadRequestError with HTTP status 400', function() {
        var error = new BadRequestError();
        assert.instanceOf(error, Error);
        assert.deepEqual(error, {
            status: 400,
            code: 'bad-request-error',
            message: 'Request body is invalid'
        });
    });

    it('should return a valid UnauthorizedError with HTTP status 401', function() {
        var error = new UnauthorizedError();
        assert.instanceOf(error, Error);
        assert.deepEqual(error, {
            status: 401,
            code: 'unauthorized-error',
            message: 'Missing or invalid user credentials'
        });
    });

    it('should return a valid ForbiddenError with HTTP status 403', function() {
        var error = new ForbiddenError();
        assert.instanceOf(error, Error);
        assert.deepEqual(error, {
            status: 403,
            code: 'forbidden-error',
            message: 'Invalid priviliges'
        });
    });

    it('should return a valid ResourceNotFoundError with HTTP status 404', function() {
        var error = new ResourceNotFoundError('Unable to find resource');
        assert.instanceOf(error, Error);
        assert.deepEqual(error, {
            status: 404,
            code: 'resource-not-found-error',
            message: 'Unable to find resource'
        });
    });

    it('should return a valid `ResourceExistsError` with HTTP status 409', function() {
        var error = new ResourceExistsError('Unable to find resource');
        assert.instanceOf(error, Error);
        assert.deepEqual(error, {
            status: 409,
            code: 'resource-exists-error',
            message: 'Unable to find resource'
        });
    });

    it('should return a valid ValidationError with HTTP status 422', function() {
        var error = new ValidationError('Invalid message!');
        assert.instanceOf(error, Error);
        assert.deepEqual(error, {
            status: 422,
            code: 'validation-error',
            message: 'One or more request parameters are invalid',
            errors: 'Invalid message!'
        });
    });

    it('should return a valid AssertError with HTTP status 500', function() {
        var error = new AssertError('Invalid message!');
        assert.instanceOf(error, Error);
        assert.deepEqual(error, {
            status: 500,
            code: 'assert-error',
            message: 'Invalid message!'
        });
    });

    it('should return a valid DatabaseError with HTTP status 500', function() {
        var error = new DatabaseError('Unable to connect to database', {
            test: 'test'
        });
        assert.instanceOf(error, Error);
        assert.deepEqual(error, {
            status: 500,
            code: 'database-error',
            message: 'Unable to connect to database',
            errors: {
                test: 'test'
            }
        });
    });
});
