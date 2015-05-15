'use strict';

var Collection = require('./lib/Collection');

var items = [1,2,3,4,5,6];
var requestUrl = 'http://www.example.org/test/12345?limit=3&offset=0';

var collection = new Collection(requestUrl, items).paginate(10, 23).build();
console.log(collection);
