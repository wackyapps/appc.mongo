var Mobware = require('mobware2'),
	server = new Mobware(),
	Connector = require('./lib'),
	connector = new Connector({
		url: 'mongodb://localhost/mobware'
	});

// lifecycle examples
server.on('starting', function(){
	server.logger.info('server is starting!');
});

server.on('started', function(){
	server.logger.info('server started!');
});

//--------------------- implement authorization ---------------------//

// fetch our configured apikey
var apikey = server.get('apikey');
server.logger.info('APIKey is:',apikey);

function APIKeyAuthorization(req, resp, next) {
	if (!apikey) return next();
	if (req.headers['apikey']) {
		var key = req.headers['apikey'];
		if (key == apikey) {
			return next();
		}
	}
	resp.status(401);
	return resp.json({
		id: "com.appcelerator.api.unauthorized",
		message: "Unauthorized",
		url: ""
	});
}

//--------------------- simple user model ---------------------//

var User = Mobware.createModel('user',{
	fields: {
		_id: {type:'string', required: true, primary: true},
		name: {type:'string', required: false, validator: /[a-zA-Z]{3,}/ }
	},
	connector: connector,	// a model level connector
	metadata: {
		mongodb: {
			collection: 'users'
		}
	}
});

// add an authorization policy for all requests at the server log
server.authorization = APIKeyAuthorization;

// create a user api from a user model
server.api(User);

// start the server
server.start(function(){
	server.logger.info('server started on port', server.port);
});