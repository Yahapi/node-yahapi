# node-yahapi

[![Build Status](https://travis-ci.org/Yahapi/node-yahapi.svg?branch=master)](https://travis-ci.org/Yahapi/node-yahapi) [![Coverage Status](https://coveralls.io/repos/Yahapi/node-yahapi/badge.svg?branch=master)](https://coveralls.io/r/Yahapi/node-yahapi?branch=master)

This library contains utility classes for building a Yahapi-style REST API in Node/IO.

Currently it contains the following classes:

- **RestErrors**: a collection of common HTTP errors.
- **LinksBuilder**: helper to add links to your JSON response.
- **Collection**: helper to create a collection resource representation.

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
var RestErrors = require("yahapi").RestErrors;

function TeapotError() {
    RestError.call(this, 418, "teapot-error", "I'm a teapot");
}
util.inherits(TeapotError, RestError);
```

## Links

The Links builder creates a set of hypermedia links for resource representations.
Links are useful for API discoverability and may simplify client logic, particularly
when used for pagination.

```javascript
'use strict';

var Links = require('yahapi').Links;

var links = new Links('http://www.example.org/test/12345?a=b');

links.add('one', { a: 'b', c: 'd' });
console.log(links.get().one.href); // http://www.example.org/test/12345?a=b&c=d

links.add('two', { offset: 20, limit: 10 });
console.log(links.get().two.href); // http://www.example.org/test/12345?a=b&offset=20&limit=10

links.add('three', '/resolve/like/browser');
console.log(links.get().three.href); // http://www.example.org/resolve/like/browser'

links.add('four', '/test', { offset: 20, limit: 10 });
console.log(links.get().four.href); // http://www.example.org/test?offset=20&limit=10

links.add('five', 'http://www.example.org/full/url');
console.log(links.get().five.href); // http://www.example.org/full/url

links.add('six', '/root', 'with', 'extra', 'args');
console.log(links.get().six.href); // http://www.example.org/root/with/extra/args

links.add('seven', '/this/will/dissapear', '/root', 'https://override.org:3000/full/url?offset=10', 'extra', { limit: 10 }, { limit: 20 }, 'paths');
console.log(links.get().seven.href); // https://override.org:3000/root/extra/paths?limit=20

console.log(links.get());
/*
{
  self: { href: 'http://www.example.org/test/12345?a=b' },
  one: { href: 'http://www.example.org/test/12345?a=b&c=d' },
  two: { href: 'http://www.example.org/test/12345?a=b&offset=20&limit=10' },
  three: { href: 'http://www.example.org/resolve/like/browser' },
  four: { href: 'http://www.example.org/test?offset=20&limit=10' },
  five: { href: 'http://www.example.org/full/url' },
  six: { href: 'http://www.example.org/root/with/extra/args' },
  seven: { href: 'https://override.org:3000/root/extra/paths?limit=20' }
}
*/

```

## Collection


```javascript
var Collection = require('yahapi').Collection;

var items = [1,2,3,4,5,6];
var self = 'http://www.example.org/test/12345?limit=3&offset=0';
new Collection(items, self).paginate(10, 3).build()
```

## Contribute

Run `gulp help` to view gulp commands.
