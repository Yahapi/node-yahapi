# node-yahapi

[![Build Status](https://travis-ci.org/Yahapi/node-yahapi.svg?branch=master)](https://travis-ci.org/Yahapi/node-yahapi) [![Coverage Status](https://coveralls.io/repos/Yahapi/node-yahapi/badge.svg?branch=master)](https://coveralls.io/r/Yahapi/node-yahapi?branch=master)

This library contains utility classes for building a Yahapi-style REST API.

Currently it contains the following classes:

- **errors**: a collection of common HTTP errors.
- **LinksBuilder**:

## Errors

Example:

```javascript
// ES 5
var UnauthorizedError = require('yahapi').UnauthorizedError;

// ES 6
import { ValidationError, UnauthorizedError } from 'yahapi';
```

The following errors are defined:

- **BadRequestError**: 400 error when request body was syntactically incorrect.
- **UnauthorizedError**: 401 error when user is not authenticated or credentials are invalid.
- **ForbiddenError**: 403 error when user is authenticated but has insufficient priviliges to access or modify resource.
- **ResourceNotFoundError**: 404 error when a resource request could not be resolved.
- **ResourceExistsError**: 409 error when a POST request was found invalid because it conflicts with an existing resource.
- **ValidationError**: 422 error when server understood the request and it is syntactically correct but was unable to process the request.
- **AssertError**: 500 error when a coding assertion failed.
- **DatabaseError**: 500 error when database connectivity or database constraints failed.

If you want to define your own errors you should inherit from `RestError`, for example:

```javascript
var RestError = require('yahapi').RestError;

function TeapotError() {
    RestError.call(this, 418, 'teapot-error', 'I\'m a teapot', 'My handle is broken :(');
}
util.inherits(TeapotError, RestError);
```

## LinksBuilder
