var bcrypt = require("bcrypt-nodejs");

var config = {

	unsecuredPaths: ['/api/users/isLoggedIn', '/api/users/login'],
	smtpTransport: '',
	server: {
		address: '37.187.183.128',
		port: '8080'
	},
	hardDebug: false,
	debug: true,
	env: 'Dev',
	// Generate a salt
	salt: bcrypt.genSaltSync(10),
	//Here we set the token duration for the connection of a user on the admin interface
	tokenDurationMS: 10800000 //3 hours in ms

};

module.exports.config = config;