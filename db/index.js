var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
});
var connection=mongoose.createConnection('mongodb://localhost:27017/treasure')
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(connection);
exports.connection=connection;
exports.autoIncrement=autoIncrement;