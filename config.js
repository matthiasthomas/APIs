var bcrypt = require("bcrypt-nodejs");

var config = {

	securedPaths: ['/api/users/isLoggedIn', '/api/users/login'],
	smtpTransport: '',
	server: {
		address: '127.0.0.1',
		port: '8080'
	},
	hardDebug: false,
	debug: true,
	env: 'Dev',
	// Generate a salt
	salt: bcrypt.genSaltSync(10),
	tokenDurationMS: 10800000 //3 hours in ms

};

module.exports.config = config;