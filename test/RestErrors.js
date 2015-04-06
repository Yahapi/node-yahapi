'use strict';

var assert = require('chai').assert;
var util = require('util');
var errors = require('../index').errors;

describe('RestErrors', function() {

    it('should return a valid ValidationError with HTTP status 422', function() {
        var error = new errors.ValidationError('Invalid message!');
        assert.instanceOf(error, Error);
        assert.deepEqual(error, {
            status: 422,
            code: 'validation-error',
            message: 'One or more request parameters are invalid',
            errors: 'Invalid message!'
        });
    });

    it('should return a valid UnauthorizedError with HTTP status 401', function() {
        var error = new errors.UnauthorizedError();
        assert.instanceOf(error, Error);
        assert.deepEqual(error, {
            status: 401,
            code: 'unauthorized-error',
            message: 'Missing or invalid user credentials'
        });
    });
});
