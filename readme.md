# seaport-advert
[![NPM](https://nodei.co/npm/seaport-advert.png)](https://nodei.co/npm/seaport-advert/)

Advertise and find your seaport ip:port combo using mdns.

## install

	npm install seaport-advert

## usage

### seaport server

    var seaport = require('seaport');
    var sa = require('seaport-advert');

    var registry = seaport.createServer()
    registry.listen(config.registry_port);
    sa.advert(config.registry_port);

### client 

    var seaport = require('seaport');
    var sa = require('seaport-advert');

    sa.find(function(err, about){
    	if (err) return console.log('bad things, probably a timeout', err);
      var ports = seaport.connect(about.host, about.port),
      var server = new Hapi.Server(ports.register('ddf-search@1.1.0'));	
    })
