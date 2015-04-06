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

The following errors are available:

- **400 BadRequestError**: when request body was syntactically incorrect.
- **401 UnauthorizedError**: when user is not authenticated or credentials are invalid.
- **403 ForbiddenError**: when user is authenticated but has insufficient priviliges to access or modify resource.
- **404 ResourceNotFoundError**: when a resource request could not be resolved.
- **409 ResourceExistsError**: when a POST request was found invalid because it conflicts with an existing resource.
- **422 ValidationError**: when server understood the request and it is syntactically correct but was unable to process the request.
- **500 AssertError**: when a coding assertion failed.
- **500 DatabaseError**: when database connectivity or database constraints failed.

If you want to define your own errors you should inherit from `RestError`, for example:

```javascript
var util = require("util");
var RestError = require("yahapi").RestError;

function TeapotError() {
    RestError.call(this, 418, "teapot-error", "I'm a teapot");
}
util.inherits(TeapotError, RestError);
```

## LinksBuilder
