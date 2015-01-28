var bcrypt = require("bcrypt-nodejs");
var nodemailer = require('nodemailer');
// create reusable transporter object using SMTP transport
var smtpTransport = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'matthiasthomaslamotte@gmail.com',
		pass: 'g4CMaEtg9G:E32bwncr9{s'
	}
});

var profile = process.argv[2];
if (process.argv[0] == "forever") {
	profile = process.argv[3];
}

var config = {
	unsecuredPaths: ['/api/users/isLoggedIn', '/api/users/login', '/api', '/api/'],
	smtpTransport: smtpTransport,
	server: {
		address: '37.187.183.128',
		port: profile == "DEV" ? '8080' : '80'
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