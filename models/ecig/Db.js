var mongoose = require('mongoose');

var Db = mongoose.createConnection('mongodb://127.0.0.1:27017/e-cig', function(err) {
	if (err) {
		console.log(err);
		throw "Can\'t connect to mongoDB";
	}
});

exports.Db = Db;