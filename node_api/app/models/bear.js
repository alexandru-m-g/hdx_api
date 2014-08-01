// app/models/bear.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var HDXSchema   = new Schema({
	name: String
});

module.exports = mongoose.model('HDX_API', HDXSchema);