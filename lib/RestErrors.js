'use strict';

var util = require('util');

/**
 * The abstract exception for REST service errors.
 *
 * @class
 * @extends Error
 * @param {Number} httpStatus The HTTP status code (for example 404 Not Found, 400 Bad Request, etc).
 * @param {String} errorCode The error code.
 * @param {String} message The error message.
 */
function RestError(httpStatus, errorCode, message) {
    Error.call(this, message);
    this.status = httpStatus;
    this.code = errorCode;
    this.message = message;
}
util.inherits(RestError, Error);

module.exports.RestError = RestError;

/**
 * This error is thrown when the request was syntactically incorrect.
 *
 * @class
 * @extends RestError
 */
function BadRequestError() {
    RestError.call(this, 400, 'bad_request', 'Request body is invalid');
}
util.inherits(BadRequestError, RestError);

module.exports.BadRequestError = BadRequestError;

/**
 * This error is thrown when a user has not authenticated correclty.
 *
 * @class
 * @extends RestError
 */
function UnauthorizedError() {
    RestError.call(this, 401, 'unauthorized', 'Missing or invalid user credentials');
}
util.inherits(UnauthorizedError, RestError);

module.exports.UnauthorizedError = UnauthorizedError;

/**
 * This error is thrown when a user is authenticated but has insufficient priviliges to access or modify resource.
 *
 * @class
 * @extends RestError
 */
function ForbiddenError() {
    RestError.call(this, 403, 'forbidden', 'Invalid priviliges');
}
util.inherits(ForbiddenError, RestError);

module.exports.ForbiddenError = ForbiddenError;

/**
 * Error thrown when a resource could not be found.
 *
 * @extends RestError
 * @param {String} message The error message.
 */
function ResourceNotFoundError(message) {
    RestError.call(this, 404, 'resource_not_found', message);
}
util.inherits(ResourceNotFoundError, RestError);

module.exports.ResourceNotFoundError = ResourceNotFoundError;

/**
 * Error thrown when a resource already exists.
 *
 * @extends RestError
 * @param {String} message The error message.
 */
function ResourceExistsError(message) {
    RestError.call(this, 409, 'resource_exists', message);
}
util.inherits(ResourceExistsError, RestError);

module.exports.ResourceExistsError = ResourceExistsError;

/**
 * This error is thrown when a validation error occurred.
 *
 * @class
 * @extends RestError
 * @param {Object[]} errors An array containing one or more constraint violations.
 * @property {String} errors.code The error code.
 * @property {String} errors.message The validation error message.
 */
function ValidationError(errors) {
    RestError.call(this, 422, 'validation', 'One or more request parameters are invalid');
    this.errors = errors;
}
util.inherits(ValidationError, RestError);

module.exports.ValidationError = ValidationError;

/**
 * Error thrown when an assertion failed. This error is indicative for a coding error.
 *
 * @extends RestError
 * @param {String} message The error message.
 */
function AssertError(message) {
    RestError.call(this, 500, 'assert', message);
}
util.inherits(AssertError, RestError);

module.exports.AssertError = AssertError;

/**
 * Error thrown when an unexpected problem occurred while persisting the entity.
 *
 * @extends RestError
 * @param {String} message The database error message.
 * @param {Object[]} [errors] A list of errors that occurred.
 */
function DatabaseError(message, errors) {
    RestError.call(this, 500, 'database', message);
    if (errors) {
        this.errors = errors;
    }
}
util.inherits(DatabaseError, RestError);

module.exports.DatabaseError = DatabaseError;
