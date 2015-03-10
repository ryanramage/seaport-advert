var multicast = require('multicast-dns');
var address = require('network-address');
var hostile = require('hostile');

exports.find = function(opts, cb) {
	
	if (!cb) {
		cb = opts;
		opts = {};
	}

	var mdns = multicast();
	var name = opts.name || 'seaport';
	var reply = {
		host: null, 
		port: null
	}
	var timeoutID = setTimeout(function(){
		mdns.destroy();
		cb(new Error('Timeout on find'));
	}, opts.timeout || 5000);

	mdns.once('response', function(response) {

	  response.answers.forEach(function(a){
	  	if (a.name !== name) return;

	  	clearTimeout(timeoutID);
	  	reply.host = a.data.target;
	  	reply.port = a.data.port;
	  })
	  mdns.destroy();
	  cb(null, reply);

	})
	mdns.query({
	  questions:[{
	    name: name,
	    type: 'SRV'
	  }]
	})	
}


exports.advert = function(port, opts) {
	if (!opts) opts = {};
	

	var mdns = multicast();
	var name = opts.name || 'seaport';
	var ip = opts.ip || null;


	var get_ip = function(cb){
		if (ip) return cb(null, ip);
		if (!opts.docker) return cb(null, address());

		// in docker, the first line of the hosts file is the address
		hostile.get(true, function (err, lines) {
			if (err) return cb(err);

			ip = lines[0][0];
			return cb(null, ip);
		})	
	}

	mdns.on('query', function(query) {
		query.questions.forEach(function(q) { 
			if (q.name !== name) return;
			get_ip(function(err, ip){
				mdns.respond({
				  answers: [{
				    name: name,
				    type: 'SRV',
				    data: {
				      port:port,
				      target: ip
				    }
				  }]
				})  
			})
		}) 
	})

}