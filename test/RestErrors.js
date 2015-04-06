'use strict';

var assert = require('chai').assert;
var util = require('util');
var errors = require('../index').errors;

describe('RestErrors', function() {

    it('should return a valid ValidationError', function() {
        var error = new errors.ValidationError('Invalid message!');
        expect(error).toBe('test');
    });
});
