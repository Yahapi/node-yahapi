'use strict';

var Collection = require('./index').Collection;

var items = [1,2,3,4,5,6];
var requestUrl = 'http://www.example.org/test/12345?limit=3&offset=0';

var collection = new Collection(requestUrl, items)
    .paginate(10, 23)
    .transform(function(elm) { return elm * 2; })
    .link('customLink', '/my/custom/link')
    .build();

console.log(collection);


var util = require('util');
var RestError = require('./index').RestError;

function TeapotError() {
    RestError.call(this, 418, 'teapot', 'I\'m a teapot');
}
util.inherits(TeapotError, RestError);
console.log(new TeapotError());
