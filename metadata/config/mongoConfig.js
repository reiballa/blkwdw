var mongoose = require("mongoose");

var url = 'mongodb://localhost:27017/blkwdw';
mongoose.connect(url, {useNewUrlParser: true, useFindAndModify: false });
mongoose.Promise = global.Promise;

var db =mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;