/**
 * CONFIG
 **/
var config = require("./config.js").config;

/**
 * MODULES
 **/
var modules = {
	fs: require("fs"),
	bcrypt: require("bcrypt-nodejs"),
	crypto: require("crypto"),
	rbac: require("mongoose-rbac"),
	mail: config.smtpTransport
};

/**
 * MODELS
 **/
var models = {};
modules.fs.readdirSync("./models").forEach(function(file) {
	if (file.indexOf(".") != -1) {
		var fileName = file.substr(0, file.length - 3);
		var fileExt = file.substr(-3);
		if (fileExt == ".js") {
			if (fileName != "db") {
				models[fileName] = require("./models/" + file)[fileName];
			}
		}
	} else {
		modules.fs.readdirSync("./models/" + file).forEach(function(subFile) {
			var fileName = subFile.substr(0, subFile.length - 3);
			var fileExt = subFile.substr(-3);
			if (fileExt == ".js") {
				if (fileName != "db") {
					if (models[file]) {
						models[file][fileName] = require("./models/" + file + "/" + subFile)[fileName];
					} else {
						models[file] = {};
						models[file][fileName] = require("./models/" + file + "/" + subFile)[fileName];
					}
				}
			}
		});
	}
});

/**
 * EXPRESS
 **/
var express = require("express");
var errorhandler = require('errorhandler');
var bodyParser = require('body-parser');
var router = express.Router();
var morgan = require('morgan');
var http = require("http");
var app = express();
app.set("port", process.env.PORT || config.server.port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
if (true === config.hardDebug) {
	app.use(errorhandler());
	app.use(morgan('combined', {}));
}

app.use('/admin', express.static(__dirname + "/sites/Admin"));
app.use('/', express.static(__dirname + "/sites/Front End"));

/**
 * MIDDLEWARES
 **/
var middlewares = require("./middlewares.js");
app.all("*", middlewares.header, middlewares.authenticate(config, models));

/**
 * CONTROLLERS
 **/
modules.fs.readdirSync("./controllers").forEach(function(file) {
	if (file.indexOf(".") != -1) {
		if (file.substr(-3) == ".js") {
			route = require("./controllers/" + file);
			route.controller(app, config, modules, models, middlewares, router);
		}
	} else {
		modules.fs.readdirSync("./controllers/" + file).forEach(function(subFile) {
			if (subFile.substr(-3) == ".js") {
				route = require("./controllers/" + file + "/" + subFile);
				route.controller(app, config, modules, models, middlewares, router);
			}
		});
	}
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

/**
 * START LOGS
 **/
console.log("############################ ############################ ############################ ############################");
console.log("#          ***** Matthias TL *****");
console.log("#          Started since: " + new Date().toISOString());
console.log("#          Environement: " + config.env);
if (true === config.hardDebug) {
	console.log("#          Hard Debug ON");
} else if (true === config.debug) {
	console.log("#          Debug ON");
} else {
	console.log("#          Debug OFF");
}

/**
 * SERVER
 **/
http.createServer(app).listen(app.get("port"), function() {
	console.log("#          API listening on " + config.server.address + ":" + app.get("port"));
	console.log("############################ ############################ ############################ ############################");
});