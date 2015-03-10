#!/usr/bin/env node

var service = require('./');

var port = process.argv[2];

if (!port) {
	return service.find(function(err, resp){
		if (err) return console.log('An error occured', err);
		console.log(resp);
	})
}


service.advert(port);
console.log('advertised service on' , port)